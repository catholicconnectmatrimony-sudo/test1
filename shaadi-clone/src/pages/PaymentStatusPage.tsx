import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  HourglassEmpty,
  Receipt,
  Home,
  Refresh,
  Star,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

const PaymentStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();
  
  const [paymentStatus, setPaymentStatus] = useState<string>('PENDING');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  const merchantTransactionId = location.state?.merchantTransactionId || 
                               localStorage.getItem('currentPaymentId');

  useEffect(() => {
    if (!merchantTransactionId) {
      navigate('/payment');
      return;
    }

    checkPaymentStatus();
    
    // Poll for status updates every 5 seconds for pending payments
    const interval = setInterval(() => {
      if (paymentStatus === 'PENDING' && retryCount < 12) { // 1 minute max
        checkPaymentStatus();
        setRetryCount(prev => prev + 1);
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [merchantTransactionId, paymentStatus, retryCount]);

  const checkPaymentStatus = async () => {
    try {
      setLoading(true);
      const result = await paymentService.checkPaymentStatus(merchantTransactionId);
      
      setPaymentStatus(result.status);
      setPaymentData(result);
      
      // If payment is successful, update user context
      if (result.status === 'SUCCESS' && result.subscription) {
        // Refresh user data to reflect new membership
        window.location.reload();
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'SUCCESS':
        return <CheckCircle sx={{ fontSize: 80, color: 'success.main' }} />;
      case 'FAILED':
      case 'CANCELLED':
        return <Error sx={{ fontSize: 80, color: 'error.main' }} />;
      default:
        return <HourglassEmpty sx={{ fontSize: 80, color: 'warning.main' }} />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'SUCCESS':
        return {
          title: 'Payment Successful!',
          subtitle: 'Your premium membership has been activated.',
          color: 'success.main'
        };
      case 'FAILED':
        return {
          title: 'Payment Failed',
          subtitle: 'There was an issue processing your payment.',
          color: 'error.main'
        };
      case 'CANCELLED':
        return {
          title: 'Payment Cancelled',
          subtitle: 'You cancelled the payment process.',
          color: 'error.main'
        };
      default:
        return {
          title: 'Processing Payment...',
          subtitle: 'Please wait while we confirm your payment.',
          color: 'warning.main'
        };
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      const receipt = await paymentService.getPaymentReceipt(merchantTransactionId);
      // Here you could generate and download a PDF receipt
      console.log('Receipt data:', receipt);
      alert('Receipt download functionality will be implemented');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const statusMessage = getStatusMessage();

  if (loading && !paymentData) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Checking payment status...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ textAlign: 'center', p: 4 }}>
        <CardContent>
          {/* Status Icon */}
          <Box sx={{ mb: 3 }}>
            {getStatusIcon()}
          </Box>

          {/* Status Message */}
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color={statusMessage.color}
            gutterBottom
          >
            {statusMessage.title}
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            {statusMessage.subtitle}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              {error}
            </Alert>
          )}

          {/* Payment Details */}
          {paymentData && (
            <Box sx={{ mb: 4, textAlign: 'left' }}>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Payment Details
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Star color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Plan"
                    secondary={`${paymentData.payment?.planType} - ${paymentData.payment?.duration}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Receipt color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Amount Paid"
                    secondary={paymentService.formatAmount(paymentData.payment?.amount || 0)}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Transaction ID"
                    secondary={paymentData.payment?.merchantTransactionId}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <HourglassEmpty color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Status"
                    secondary={
                      <Chip
                        label={paymentStatus}
                        color={
                          paymentStatus === 'SUCCESS' ? 'success' :
                          paymentStatus === 'PENDING' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    }
                  />
                </ListItem>
              </List>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {paymentStatus === 'SUCCESS' && (
              <>
                <Button
                  variant="contained"
                  startIcon={<Home />}
                  onClick={() => navigate('/profile')}
                  size="large"
                >
                  Go to Profile
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Receipt />}
                  onClick={handleDownloadReceipt}
                  size="large"
                >
                  Download Receipt
                </Button>
              </>
            )}
            
            {paymentStatus === 'PENDING' && (
              <>
                <Button
                  variant="outlined"
                  startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
                  onClick={checkPaymentStatus}
                  disabled={loading}
                  size="large"
                >
                  Refresh Status
                </Button>
                
                <Button
                  variant="text"
                  onClick={() => navigate('/payment')}
                  size="large"
                >
                  Try Again
                </Button>
              </>
            )}
            
            {(paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') && (
              <>
                <Button
                  variant="contained"
                  onClick={() => navigate('/payment')}
                  size="large"
                >
                  Try Again
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={() => navigate('/')}
                  size="large"
                >
                  Go Home
                </Button>
              </>
            )}
          </Box>

          {/* Success Message for Premium Users */}
          {paymentStatus === 'SUCCESS' && paymentData?.subscription && (
            <Alert severity="success" sx={{ mt: 3, textAlign: 'left' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Welcome to {paymentData.payment?.planType} Membership! 🎉
              </Typography>
              <Typography variant="body2">
                Your membership is active until{' '}
                {new Date(paymentData.subscription.endDate).toLocaleDateString()}.
                You can now enjoy all premium features!
              </Typography>
            </Alert>
          )}

          {/* Help Text */}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
            Having issues? Contact our support team for assistance.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PaymentStatusPage;