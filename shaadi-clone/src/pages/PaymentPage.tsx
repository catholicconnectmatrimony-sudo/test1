import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import {
  CheckCircle,
  Star,
  Security,
  Speed,
  Visibility,
  Message,
  Support,
  Highlight,
  Payment,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

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

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('Premium');
  const [selectedDuration, setSelectedDuration] = useState<string>('3 months');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Get selected plan from location state if available
  useEffect(() => {
    if (location.state?.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan);
    }
    if (location.state?.selectedDuration) {
      setSelectedDuration(location.state.selectedDuration);
    }
  }, [location.state]);

  // Fetch plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const planData = await paymentService.getPlans();
        setPlans(planData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelect = (planType: string) => {
    setSelectedPlan(planType);
  };

  const handleDurationSelect = (duration: string) => {
    setSelectedDuration(duration);
  };

  const getSelectedPlanData = () => {
    const plan = plans.find(p => p.type === selectedPlan);
    const pricing = plan?.pricing.find(p => p.duration === selectedDuration);
    return { plan, pricing };
  };

  const handlePayment = () => {
    setConfirmDialog(true);
  };

  const confirmPayment = async () => {
    try {
      setPaymentProcessing(true);
      setConfirmDialog(false);
      
      const result = await paymentService.initiatePayment(selectedPlan, selectedDuration);
      
      if (result.success) {
        // Store transaction ID for status checking
        localStorage.setItem('currentPaymentId', result.merchantTransactionId);
        
        // Open PhonePe payment page
        paymentService.openPhonePePayment(result.paymentUrl);
        
        // Navigate to payment status page
        navigate('/payment/status', {
          state: { merchantTransactionId: result.merchantTransactionId }
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'profileViews': return <Visibility color="primary" />;
      case 'advancedSearch': return <Speed color="primary" />;
      case 'prioritySupport': return <Support color="primary" />;
      case 'profileHighlight': return <Highlight color="primary" />;
      default: return <CheckCircle color="primary" />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading payment plans...
        </Typography>
      </Container>
    );
  }

  const { plan: selectedPlanData, pricing: selectedPricing } = getSelectedPlanData();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Choose Your Membership Plan
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Unlock premium features and find your perfect match faster
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Plan Selection */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Select Plan
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {plans.map((plan) => (
              <Grid item xs={12} sm={6} key={plan.type}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedPlan === plan.type ? 2 : 1,
                    borderColor: selectedPlan === plan.type ? 'primary.main' : 'grey.300',
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: 3 }
                  }}
                  onClick={() => handlePlanSelect(plan.type)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" fontWeight="bold">
                        {plan.type}
                      </Typography>
                      {plan.type === 'Premium Plus' && (
                        <Chip
                          label="Most Popular"
                          color="primary"
                          size="small"
                          icon={<Star />}
                          sx={{ ml: 2 }}
                        />
                      )}
                    </Box>
                    
                    <List dense>
                      {paymentService.getPlanFeaturesList(plan.features).map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircle color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Duration Selection */}
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Select Duration
          </Typography>
          
          <FormControl component="fieldset" sx={{ mb: 4 }}>
            <RadioGroup
              value={selectedDuration}
              onChange={(e) => handleDurationSelect(e.target.value)}
            >
              {selectedPlanData?.pricing.map((pricing) => (
                <FormControlLabel
                  key={pricing.duration}
                  value={pricing.duration}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {pricing.duration}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {paymentService.formatAmount(pricing.price)}
                          {pricing.originalPrice && (
                            <span style={{ textDecoration: 'line-through', marginLeft: 8 }}>
                              {paymentService.formatAmount(pricing.originalPrice)}
                            </span>
                          )}
                        </Typography>
                      </Box>
                      {pricing.savings > 0 && (
                        <Chip
                          label={`Save ₹${pricing.savings}`}
                          color="success"
                          size="small"
                        />
                      )}
                    </Box>
                  }
                  sx={{
                    border: 1,
                    borderColor: 'grey.300',
                    borderRadius: 1,
                    p: 2,
                    m: 1,
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Payment Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Payment Summary
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight="bold">
                {selectedPlan} Membership
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedDuration}
              </Typography>
            </Box>
            
            {selectedPricing && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Plan Price:</Typography>
                  <Typography variant="body2">
                    {paymentService.formatAmount(selectedPricing.price)}
                  </Typography>
                </Box>
                
                {selectedPricing.savings > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="success.main">
                      Savings:
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      -₹{selectedPricing.savings}
                    </Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total Amount:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {paymentService.formatAmount(selectedPricing.price)}
                  </Typography>
                </Box>
              </>
            )}
            
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Payment />}
              onClick={handlePayment}
              disabled={paymentProcessing}
              sx={{ mb: 2 }}
            >
              {paymentProcessing ? 'Processing...' : 'Pay with PhonePe'}
            </Button>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Security fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Secure payment powered by PhonePe
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            You are about to purchase:
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            {selectedPlan} - {selectedDuration}
          </Typography>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {selectedPricing && paymentService.formatAmount(selectedPricing.price)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You will be redirected to PhonePe for secure payment processing.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={confirmPayment}
            variant="contained"
            disabled={paymentProcessing}
          >
            {paymentProcessing ? <CircularProgress size={20} /> : 'Proceed to Pay'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentPage;