const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // User and Subscription Info
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  
  // Payment Details
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  planType: {
    type: String,
    enum: ['Premium', 'Premium Plus'],
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  
  // PhonePe Transaction Details
  merchantTransactionId: {
    type: String,
    unique: true,
    required: true
  },
  phonepeTransactionId: {
    type: String
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'CARD', 'NET_BANKING', 'WALLET'],
    default: 'UPI'
  },
  
  // PhonePe Response Data
  phonepeResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  
  // Payment Gateway Details
  gateway: {
    type: String,
    default: 'PhonePe'
  },
  gatewayOrderId: {
    type: String
  },
  
  // Timestamps
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  
  // Additional Info
  deviceContext: {
    userAgent: String,
    ipAddress: String
  },
  
  // Refund Details (if applicable)
  refund: {
    status: {
      type: String,
      enum: ['NONE', 'PENDING', 'SUCCESS', 'FAILED'],
      default: 'NONE'
    },
    amount: Number,
    refundId: String,
    initiatedAt: Date,
    completedAt: Date,
    reason: String
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ merchantTransactionId: 1 });
paymentSchema.index({ phonepeTransactionId: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return `₹${this.amount.toLocaleString('en-IN')}`;
});

// Method to check if payment is successful
paymentSchema.methods.isSuccessful = function() {
  return this.status === 'SUCCESS';
};

// Method to check if payment is pending
paymentSchema.methods.isPending = function() {
  return this.status === 'PENDING';
};

// Method to check if payment failed
paymentSchema.methods.hasFailed = function() {
  return this.status === 'FAILED' || this.status === 'CANCELLED';
};

module.exports = mongoose.model('Payment', paymentSchema);