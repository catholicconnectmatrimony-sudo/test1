const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface PaymentInitiationResponse {
  success: boolean;
  paymentUrl: string;
  merchantTransactionId: string;
  message: string;
}

interface PaymentStatusResponse {
  success: boolean;
  payment: any;
  status: string;
  subscription: any;
}

interface PaymentPlan {
  type: string;
  features: {
    contactsPerDay: number;
    messagesPerDay: number;
    profileViews: boolean;
    advancedSearch: boolean;
    prioritySupport: boolean;
    profileHighlight: boolean;
  };
  pricing: Array<{
    duration: string;
    price: number;
    savings: number;
    originalPrice?: number;
  }>;
}

interface PaymentHistory {
  payments: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class PaymentService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Get available subscription plans
  async getPlans(): Promise<PaymentPlan[]> {
    const response = await fetch(`${API_BASE_URL}/payments/plans`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch plans');
    }

    return data.plans;
  }

  // Initiate payment with PhonePe
  async initiatePayment(planType: string, duration: string): Promise<PaymentInitiationResponse> {
    const response = await fetch(`${API_BASE_URL}/payments/initiate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ planType, duration }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Payment initiation failed');
    }

    return data;
  }

  // Check payment status
  async checkPaymentStatus(merchantTransactionId: string): Promise<PaymentStatusResponse> {
    const response = await fetch(`${API_BASE_URL}/payments/status/${merchantTransactionId}`, {
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to check payment status');
    }

    return data;
  }

  // Get payment history
  async getPaymentHistory(page: number = 1, limit: number = 10): Promise<PaymentHistory> {
    const response = await fetch(`${API_BASE_URL}/payments/history?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch payment history');
    }

    return data;
  }

  // Get payment receipt
  async getPaymentReceipt(merchantTransactionId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/payments/receipt/${merchantTransactionId}`, {
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch receipt');
    }

    return data.receipt;
  }

  // Open PhonePe payment page
  openPhonePePayment(paymentUrl: string): void {
    // Open payment URL in new window/tab
    const paymentWindow = window.open(
      paymentUrl,
      'phonepe_payment',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    );

    if (!paymentWindow) {
      // Fallback: redirect to payment URL in same window
      window.location.href = paymentUrl;
    }
  }

  // Format amount to Indian currency
  formatAmount(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  // Calculate savings percentage
  calculateSavingsPercentage(originalPrice: number, currentPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  // Get plan features as formatted list
  getPlanFeaturesList(features: PaymentPlan['features']): string[] {
    const featuresList = [];
    
    if (features.contactsPerDay > 0) {
      featuresList.push(`${features.contactsPerDay} contacts per day`);
    }
    
    if (features.messagesPerDay > 0) {
      featuresList.push(`${features.messagesPerDay} messages per day`);
    }
    
    if (features.profileViews) {
      featuresList.push('See who viewed your profile');
    }
    
    if (features.advancedSearch) {
      featuresList.push('Advanced search filters');
    }
    
    if (features.prioritySupport) {
      featuresList.push('Priority customer support');
    }
    
    if (features.profileHighlight) {
      featuresList.push('Profile highlighting');
    }

    return featuresList;
  }

  // Validate plan selection
  validatePlanSelection(planType: string, duration: string): boolean {
    const validPlans = ['Premium', 'Premium Plus'];
    const validDurations = ['1 month', '3 months', '6 months', '12 months'];
    
    return validPlans.includes(planType) && validDurations.includes(duration);
  }

  // Get recommended plan based on user activity
  getRecommendedPlan(): { planType: string; duration: string; reason: string } {
    // Simple logic for recommendation - can be enhanced based on user behavior
    return {
      planType: 'Premium',
      duration: '3 months',
      reason: 'Most popular choice with great savings'
    };
  }
}

export const paymentService = new PaymentService();