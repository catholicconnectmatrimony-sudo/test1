const express = require('express');
const { auth } = require('../middleware/auth');
const phonePeService = require('../services/phonePeService');
const Payment = require('../models/Payment');

const router = express.Router();

// @route   POST /api/payments/initiate
// @desc    Initiate payment with PhonePe
// @access  Private
router.post('/initiate', auth, async (req, res) => {
  try {
    const { planType, duration } = req.body;
    
    if (!planType || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Plan type and duration are required'
      });
    }

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const result = await phonePeService.initiatePayment(
      req.user.id,
      planType,
      duration,
      userAgent,
      ipAddress
    );

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment initiation failed'
    });
  }
});

// @route   POST /api/payments/phonepe/callback
// @desc    Handle PhonePe payment callback
// @access  Public (PhonePe webhook)
router.post('/phonepe/callback', async (req, res) => {
  try {
    const signature = req.headers['x-verify'];
    const callbackData = req.body;

    if (!signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing signature'
      });
    }

    const result = await phonePeService.handleCallback(callbackData, signature);

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('PhonePe callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Callback processing failed'
    });
  }
});

// @route   GET /api/payments/status/:merchantTransactionId
// @desc    Check payment status
// @access  Private
router.get('/status/:merchantTransactionId', auth, async (req, res) => {
  try {
    const { merchantTransactionId } = req.params;

    // Verify that this transaction belongs to the current user
    const payment = await Payment.findOne({ 
      merchantTransactionId,
      user: req.user.id 
    }).populate('subscription');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check latest status from PhonePe
    const result = await phonePeService.checkPaymentStatus(merchantTransactionId);

    res.json({
      success: true,
      payment: result.payment,
      status: result.payment.status,
      subscription: result.payment.subscription
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check payment status'
    });
  }
});

// @route   GET /api/payments/history
// @desc    Get payment history for user
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await phonePeService.getPaymentHistory(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history'
    });
  }
});

// @route   GET /api/payments/plans
// @desc    Get available payment plans with pricing
// @access  Public
router.get('/plans', (req, res) => {
  try {
    const plans = [
      {
        type: 'Premium',
        features: {
          contactsPerDay: 10,
          messagesPerDay: 50,
          profileViews: true,
          advancedSearch: true,
          prioritySupport: false,
          profileHighlight: false
        },
        pricing: [
          { duration: '1 month', price: 1599, savings: 0 },
          { duration: '3 months', price: 3999, savings: 797, originalPrice: 4797 },
          { duration: '6 months', price: 7999, savings: 1595, originalPrice: 9594 },
          { duration: '12 months', price: 14999, savings: 4189, originalPrice: 19188 }
        ]
      },
      {
        type: 'Premium Plus',
        features: {
          contactsPerDay: 25,
          messagesPerDay: 100,
          profileViews: true,
          advancedSearch: true,
          prioritySupport: true,
          profileHighlight: true
        },
        pricing: [
          { duration: '1 month', price: 2999, savings: 0 },
          { duration: '3 months', price: 7999, savings: 998, originalPrice: 8997 },
          { duration: '6 months', price: 14999, savings: 2995, originalPrice: 17994 },
          { duration: '12 months', price: 24999, savings: 10989, originalPrice: 35988 }
        ]
      }
    ];

    res.json({
      success: true,
      plans
    });

  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get plans'
    });
  }
});

// @route   POST /api/payments/refund/:paymentId
// @desc    Initiate refund for a payment
// @access  Private (Admin only - add admin middleware)
router.post('/refund/:paymentId', auth, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { refundAmount, reason } = req.body;

    // Note: Add admin check middleware here for production
    
    const result = await phonePeService.initiateRefund(paymentId, refundAmount, reason);

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Refund initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate refund'
    });
  }
});

// @route   GET /api/payments/receipt/:merchantTransactionId
// @desc    Get payment receipt
// @access  Private
router.get('/receipt/:merchantTransactionId', auth, async (req, res) => {
  try {
    const { merchantTransactionId } = req.params;

    const payment = await Payment.findOne({
      merchantTransactionId,
      user: req.user.id
    })
    .populate('user', 'firstName lastName email phone')
    .populate('subscription');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment receipt not found'
      });
    }

    const receipt = {
      receiptId: payment.merchantTransactionId,
      paymentDate: payment.completedAt || payment.createdAt,
      amount: payment.amount,
      planType: payment.planType,
      duration: payment.duration,
      status: payment.status,
      paymentMethod: 'PhonePe',
      transactionId: payment.phonepeTransactionId,
      user: {
        name: `${payment.user.firstName} ${payment.user.lastName}`,
        email: payment.user.email,
        phone: payment.user.phone
      },
      subscription: payment.subscription
    };

    res.json({
      success: true,
      receipt
    });

  } catch (error) {
    console.error('Get receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get receipt'
    });
  }
});

module.exports = router;