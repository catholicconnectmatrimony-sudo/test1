const crypto = require('crypto');

class PhonePeConfig {
  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID;
    this.saltKey = process.env.PHONEPE_SALT_KEY;
    this.saltIndex = process.env.PHONEPE_SALT_INDEX || 1;
    this.environment = process.env.PHONEPE_ENVIRONMENT || 'UAT'; // UAT or PROD
    
    // PhonePe URLs
    this.baseUrl = this.environment === 'PROD' 
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
    
    this.redirectUrl = process.env.CLIENT_URL + '/payment/success';
    this.callbackUrl = process.env.SERVER_URL + '/api/payments/phonepe/callback';
  }

  // Generate X-VERIFY header for PhonePe API authentication
  generateXVerifyHeader(payload) {
    const payloadString = JSON.stringify(payload);
    const payloadBase64 = Buffer.from(payloadString).toString('base64');
    const string = payloadBase64 + '/pg/v1/pay' + this.saltKey;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const xVerify = sha256 + '###' + this.saltIndex;
    return { payloadBase64, xVerify };
  }

  // Generate X-VERIFY header for status check
  generateStatusXVerifyHeader(merchantTransactionId) {
    const string = `/pg/v1/status/${this.merchantId}/${merchantTransactionId}` + this.saltKey;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const xVerify = sha256 + '###' + this.saltIndex;
    return xVerify;
  }

  // Verify callback signature
  verifyCallback(receivedSignature, response) {
    const responseString = JSON.stringify(response);
    const responseBase64 = Buffer.from(responseString).toString('base64');
    const expectedSignature = crypto
      .createHash('sha256')
      .update(responseBase64 + this.saltKey)
      .digest('hex') + '###' + this.saltIndex;
    
    return receivedSignature === expectedSignature;
  }

  // Get payment URLs
  getPaymentUrl() {
    return `${this.baseUrl}/pg/v1/pay`;
  }

  getStatusUrl(merchantTransactionId) {
    return `${this.baseUrl}/pg/v1/status/${this.merchantId}/${merchantTransactionId}`;
  }
}

module.exports = new PhonePeConfig();