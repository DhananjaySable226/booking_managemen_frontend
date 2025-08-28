import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { 
  createRazorpayOrder, 
  verifyRazorpayPayment,
  reset 
} from '../../features/payments/paymentsSlice';

const RazorpayPayment = ({ 
  amount, 
  currency = 'INR', 
  bookingId, 
  onSuccess, 
  onFailure,
  description = 'Payment for booking',
  customerName,
  customerEmail,
  customerPhone 
}) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.payments);
  const [orderId, setOrderId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle payment success
  const handlePaymentSuccess = async (response) => {
    setIsProcessing(true);
    try {
      const result = await dispatch(verifyRazorpayPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      })).unwrap();

      if (result.success) {
        toast.success('Payment successful!');
        onSuccess && onSuccess(result.data);
      } else {
        toast.error('Payment verification failed');
        onFailure && onFailure(result);
      }
    } catch (error) {
      toast.error(error || 'Payment verification failed');
      onFailure && onFailure({ error });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment failure
  const handlePaymentFailure = (response) => {
    console.error('Payment failed:', response.error);
    toast.error(response.error.description || 'Payment failed');
    onFailure && onFailure(response);
  };

  // Initialize payment
  const initializePayment = async () => {
    if (!amount || amount < 1) {
      toast.error('Invalid amount');
      return;
    }

    try {
      const result = await dispatch(createRazorpayOrder({
        amount,
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          bookingId,
          description
        }
      })).unwrap();

      if (result.success) {
        setOrderId(result.data.orderId);
        openRazorpayCheckout(result.data);
      } else {
        toast.error('Failed to create payment order');
      }
    } catch (error) {
      toast.error(error || 'Failed to create payment order');
    }
  };

  // Open Razorpay checkout
  const openRazorpayCheckout = (orderData) => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK not loaded');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Booking Management System',
      description: description,
      order_id: orderData.orderId,
      handler: handlePaymentSuccess,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone
      },
      notes: {
        bookingId: bookingId,
        description: description
      },
      theme: {
        color: '#3B82F6'
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal closed');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Reset state on unmount
  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  return (
    <div className="w-full">
      <button
        onClick={initializePayment}
        disabled={loading || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Creating Order...
          </div>
        ) : isProcessing ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          `Pay ₹${amount}`
        )}
      </button>
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">Payment order created successfully!</p>
        </div>
      )}
    </div>
  );
};

export default RazorpayPayment;
