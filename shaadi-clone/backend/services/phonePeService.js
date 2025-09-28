const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const phonePeConfig = require('../config/phonepe');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

class PhonePeService {
  
  // Initiate payment with PhonePe
  async initiatePayment(userId, planType, duration, userAgent, ipAddress) {
    try {
      // Get plan pricing
      const planPricing = this.getPlanPricing();
      const planKey = `${planType}-${duration}`;
      const amount = planPricing[planKey];
      
      if (!amount) {
        throw new Error('Invalid plan or duration selected');
      }

      // Generate unique merchant transaction ID
      const merchantTransactionId = `MT${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      // Get user details
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Create payment record
      const payment = new Payment({
        user: userId,
        amount: amount,
        planType,
        duration,
        merchantTransactionId,
        deviceContext: {
          userAgent,
          ipAddress
        }
      });
      await payment.save();

      // Prepare PhonePe payment payload
      const paymentPayload = {
        merchantId: phonePeConfig.merchantId,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: userId.toString(),
        amount: amount * 100, // PhonePe expects amount in paisa
        redirectUrl: phonePeConfig.redirectUrl,
        redirectMode: 'POST',
        callbackUrl: phonePeConfig.callbackUrl,
        mobileNumber: user.phone.replace(/[^0-9]/g, ''), // Clean phone number
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      // Generate X-VERIFY header
      const { payloadBase64, xVerify } = phonePeConfig.generateXVerifyHeader(paymentPayload);

      // Make API call to PhonePe
      const response = await axios.post(
        phonePeConfig.getPaymentUrl(),
        {
          request: payloadBase64
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': xVerify
          }
        }
      );

      // Update payment with PhonePe response
      payment.phonepeResponse = response.data;
      payment.gatewayOrderId = response.data.data?.merchantTransactionId;
      await payment.save();

      if (response.data.success) {
        return {
          success: true,
          paymentUrl: response.data.data.instrumentResponse.redirectInfo.url,
          merchantTransactionId: merchantTransactionId,
          message: 'Payment initiated successfully'
        };
      } else {
        throw new Error(response.data.message || 'Payment initiation failed');
      }

    } catch (error) {
      console.error('PhonePe payment initiation error:', error);
      throw new Error(error.message || 'Payment initiation failed');
    }
  }

  // Handle payment callback from PhonePe
  async handleCallback(callbackData, signature) {
    try {
      // Verify signature
      const isValidSignature = phonePeConfig.verifyCallback(signature, callbackData);
      
      if (!isValidSignature) {
        throw new Error('Invalid callback signature');
      }

      const { merchantTransactionId, transactionId, amount, state } = callbackData;

      // Find payment record
      const payment = await Payment.findOne({ merchantTransactionId });
      if (!payment) {
        throw new Error('Payment record not found');
      }

      // Update payment status
      payment.phonepeTransactionId = transactionId;
      payment.phonepeResponse = callbackData;
      payment.completedAt = new Date();

      if (state === 'COMPLETED') {
        payment.status = 'SUCCESS';
        
        // Activate subscription
        await this.activateSubscription(payment);
        
      } else if (state === 'FAILED') {
        payment.status = 'FAILED';
      } else {
        payment.status = 'CANCELLED';
      }

      await payment.save();

      return {
        success: payment.status === 'SUCCESS',
        payment,
        message: `Payment ${payment.status.toLowerCase()}`
      };

    } catch (error) {
      console.error('PhonePe callback handling error:', error);
      throw error;
    }
  }

  // Check payment status with PhonePe
  async checkPaymentStatus(merchantTransactionId) {
    try {
      const xVerify = phonePeConfig.generateStatusXVerifyHeader(merchantTransactionId);
      
      const response = await axios.get(
        phonePeConfig.getStatusUrl(merchantTransactionId),
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': xVerify,
            'X-MERCHANT-ID': phonePeConfig.merchantId
          }
        }
      );

      const payment = await Payment.findOne({ merchantTransactionId });
      
      if (payment && response.data.success) {
        const paymentData = response.data.data;
        
        // Update payment record
        payment.phonepeTransactionId = paymentData.transactionId;
        payment.phonepeResponse = response.data;
        
        if (paymentData.state === 'COMPLETED') {
          payment.status = 'SUCCESS';
          payment.completedAt = new Date();
          await this.activateSubscription(payment);
        } else if (paymentData.state === 'FAILED') {
          payment.status = 'FAILED';
          payment.completedAt = new Date();
        }
        
        await payment.save();
      }

      return {
        success: response.data.success,
        payment,
        phonepeData: response.data
      };

    } catch (error) {
      console.error('Payment status check error:', error);
      throw error;
    }
  }

  // Activate subscription after successful payment
  async activateSubscription(payment) {
    try {
      // Calculate subscription dates
      const startDate = new Date();
      const endDate = new Date(startDate);
      const durationMonths = parseInt(payment.duration.split(' ')[0]);
      endDate.setMonth(endDate.getMonth() + durationMonths);

      // Create subscription record
      const subscription = new Subscription({
        user: payment.user,
        planType: payment.planType,
        duration: payment.duration,
        price: payment.amount,
        startDate,
        endDate,
        paymentId: payment.merchantTransactionId,
        paymentMethod: 'PhonePe',
        features: payment.planType === 'Premium' ? {
          contactsPerDay: 10,
          messagesPerDay: 50,
          profileViews: true,
          advancedSearch: true,
          prioritySupport: false,
          profileHighlight: false
        } : {
          contactsPerDay: 25,
          messagesPerDay: 100,
          profileViews: true,
          advancedSearch: true,
          prioritySupport: true,
          profileHighlight: true
        }
      });

      await subscription.save();

      // Update user membership
      await User.findByIdAndUpdate(payment.user, {
        membershipType: payment.planType,
        membershipExpiry: endDate
      });

      // Link subscription to payment
      payment.subscription = subscription._id;
      await payment.save();

      return subscription;

    } catch (error) {
      console.error('Subscription activation error:', error);
      throw error;
    }
  }

  // Get plan pricing
  getPlanPricing() {
    return {
      'Premium-1 month': 1599,
      'Premium-3 months': 3999,
      'Premium-6 months': 7999,
      'Premium-12 months': 14999,
      'Premium Plus-1 month': 2999,
      'Premium Plus-3 months': 7999,
      'Premium Plus-6 months': 14999,
      'Premium Plus-12 months': 24999
    };
  }

  // Get payment history for user
  async getPaymentHistory(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const payments = await Payment.find({ user: userId })
        .populate('subscription')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Payment.countDocuments({ user: userId });

      return {
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };

    } catch (error) {
      console.error('Get payment history error:', error);
      throw error;
    }
  }

  // Initiate refund (if needed)
  async initiateRefund(paymentId, refundAmount, reason) {
    try {
      const payment = await Payment.findById(paymentId);
      
      if (!payment || !payment.isSuccessful()) {
        throw new Error('Invalid payment for refund');
      }

      // Update payment record with refund info
      payment.refund = {
        status: 'PENDING',
        amount: refundAmount,
        reason: reason,
        initiatedAt: new Date()
      };

      await payment.save();

      // Note: PhonePe refund API implementation would go here
      // For now, marking as manual process

      return {
        success: true,
        message: 'Refund initiated successfully',
        refundId: `REF${Date.now()}`
      };

    } catch (error) {
      console.error('Refund initiation error:', error);
      throw error;
    }
  }
}

module.exports = new PhonePeService();