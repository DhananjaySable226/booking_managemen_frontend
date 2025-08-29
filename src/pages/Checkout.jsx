import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  CreditCardIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  clearCart,
} from '../features/cart/cartSlice';
import { createBooking } from '../features/bookings/bookingsSlice';
import PaymentMethods from '../components/payments/PaymentMethods';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemCount = useSelector(selectCartItemCount);
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // Local helpers
  const calculateItemTotal = (item) => {
    if (!item) return 0;
    const unit = typeof item.basePrice === 'number' ? item.basePrice : (typeof item.price === 'number' ? item.price : 0);
    const qty = item.quantity || 1;
    return unit * qty;
  };

  const formatPrice = (amount) => {
    const value = typeof amount === 'number' ? amount : (amount || 0);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  };

  useEffect(() => {
    if (!user) {
      toast.error('Please login to complete checkout');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    // Pre-fill form with user data
    setValue('firstName', user.firstName || '');
    setValue('lastName', user.lastName || '');
    setValue('email', user.email || '');
    setValue('phone', user.phone || '');
  }, [user, cartItems, navigate, setValue]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% GST for India
  };

  const calculateBookingFees = () => {
    return cartItemCount * 50; // ₹50 per booking
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateBookingFees();
  };

  const computeEndTime = (startTime, durationHours) => {
    try {
      const [h, m] = (startTime || '00:00').split(':').map(Number);
      const start = new Date(2000, 0, 1, h || 0, m || 0, 0, 0);
      const end = new Date(start.getTime() + Math.round((durationHours || 1) * 60) * 60000);
      const hh = String(end.getHours()).padStart(2, '0');
      const mm = String(end.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    } catch (e) {
      return startTime;
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate contact information
      const formData = watch();
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        toast.error('Please fill in all required fields');
        return;
      }
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handlePaymentSuccess = async (paymentData) => {
    setIsProcessing(true);
    try {
      const paymentId = paymentData?._id || paymentData?.id || paymentData?.razorpayPaymentId;
      if (!paymentId) {
        toast.error('Verified payment id missing');
        throw new Error('Missing verified payment id');
      }
      // Create bookings for each cart item
      const bookings = [];
      for (const item of cartItems) {
        const bookingData = {
          serviceId: item.serviceId,
          bookingDate: item.date,
          startTime: item.time,
          endTime: computeEndTime(item.time, item.quantity || 1),
          duration: item.quantity || 1,
          totalAmount: Number(calculateItemTotal(item)) || 0,
          specialRequests: watch('specialRequests') || '',
          contactInfo: {
            phone: watch('phone'),
            email: watch('email'),
          },
          location: watch('location') || '',
          paymentId,
          paymentStatus: 'paid'
        };

        const booking = await dispatch(createBooking(bookingData)).unwrap();
        bookings.push(booking);
      }

      // Clear cart and show success
      dispatch(clearCart());
      setOrderComplete(true);
      toast.success('Order completed successfully!');

    } catch (error) {
      console.error('Booking creation error:', error);
      toast.error('Failed to create bookings. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    toast.error('Payment failed. Please try again.');
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
          {step > 1 ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            <span className="text-sm font-medium">1</span>
          )}
        </div>
        <div className={`ml-2 text-sm font-medium ${step >= 1 ? 'text-primary-600' : 'text-gray-500'
          }`}>
          Contact Info
        </div>
      </div>

      <div className={`w-16 h-0.5 mx-4 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'
        }`}></div>

      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
          {step >= 2 ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            <span className="text-sm font-medium">2</span>
          )}
        </div>
        <div className={`ml-2 text-sm font-medium ${step >= 2 ? 'text-primary-600' : 'text-gray-500'
          }`}>
          Payment
        </div>
      </div>
    </div>
  );

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your booking. You will receive a confirmation email shortly.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate('/services')}
                className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-md font-medium hover:bg-gray-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Checkout</h1>
              <button
                onClick={() => navigate('/cart')}
                className="text-primary-100 hover:text-white"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {renderStepIndicator()}

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {step === 1 ? (
                  // Step 1: Contact Information
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          {...register('firstName', { required: 'First name is required' })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          {...register('lastName', { required: 'Last name is required' })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[\+]?[1-9][\d]{0,15}$/,
                            message: 'Invalid phone number',
                          },
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        {...register('specialRequests')}
                        rows="3"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Any special requirements or requests..."
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleNextStep}
                        className="bg-primary-600 text-white px-6 py-2 rounded-md font-medium hover:bg-primary-700"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                ) : (
                  // Step 2: Payment
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>

                    <PaymentMethods
                      amount={calculateTotal()}
                      currency="INR"
                      bookingId={`booking_${Date.now()}`}
                      onSuccess={handlePaymentSuccess}
                      onFailure={handlePaymentFailure}
                      description={`Payment for ${cartItems.length} booking(s)`}
                      customerName={`${watch('firstName')} ${watch('lastName')}`}
                      customerEmail={watch('email')}
                      customerPhone={watch('phone')}
                    />

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handlePreviousStep}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-400"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                  {/* Cart Items */}
                  <div className="space-y-3 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.serviceId} className="flex items-center space-x-3">
                        <img
                          src={item.image || '/placeholder-service.jpg'}
                          alt={item.serviceName}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.serviceName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity || 1}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(calculateItemTotal(item))}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Booking Fees</span>
                      <span>{formatPrice(calculateBookingFees())}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>GST (18%)</span>
                      <span>{formatPrice(calculateTax())}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-semibold text-gray-900">
                        <span>Total</span>
                        <span>{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <ShieldCheckIcon className="h-4 w-4 mr-2 text-green-500" />
                      <span>Secure payment processing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
