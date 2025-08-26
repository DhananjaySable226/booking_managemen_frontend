import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  CreditCardIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { createBooking } from '../../features/bookings/bookingsSlice';
import { createPaymentIntent } from '../../features/payments/paymentsSlice';

const BookingForm = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const { service } = useSelector((state) => state.services);
  const { loading, error } = useSelector((state) => state.bookings);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // Get service details from location state or Redux
  const bookingService = location.state?.service || service;

  useEffect(() => {
    if (location.state?.selectedDate) {
      setSelectedDate(location.state.selectedDate);
    }
    if (location.state?.selectedTime) {
      setSelectedTime(location.state.selectedTime);
    }
  }, [location.state]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const calculateTotal = () => {
    const basePrice = bookingService?.price || 0;
    const bookingFee = 10;
    const durationMultiplier = duration;
    return (basePrice * durationMultiplier) + bookingFee;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Reset time when date changes
    setSelectedTime('');
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
  };

  const validateBooking = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return false;
    }
    if (!selectedTime) {
      toast.error('Please select a time');
      return false;
    }
    if (duration < 1) {
      toast.error('Duration must be at least 1 hour');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateBooking()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const onSubmit = async (data) => {
    if (!validateBooking()) return;

    setIsProcessing(true);
    try {
      const bookingData = {
        serviceId: bookingService._id,
        providerId: bookingService.provider._id,
        bookingDate: selectedDate,
        startTime: selectedTime,
        duration: duration,
        totalAmount: calculateTotal(),
        specialRequests: data.specialRequests || '',
        contactInfo: {
          phone: data.phone || user.phone,
          email: data.email || user.email,
        },
        location: data.location || '',
      };

      // Create payment intent first
      const paymentIntent = await dispatch(createPaymentIntent({
        amount: calculateTotal(),
        currency: 'usd',
        metadata: {
          serviceId: bookingService._id,
          serviceName: bookingService.name,
        }
      })).unwrap();

      // Create booking
      const booking = await dispatch(createBooking(bookingData)).unwrap();

      toast.success('Booking created successfully!');
      
      // Navigate to payment page or booking confirmation
      navigate('/booking-confirmation', {
        state: {
          booking,
          paymentIntent,
          service: bookingService,
        }
      });

    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          <CheckCircleIcon className="w-5 h-5" />
        </div>
        <div className={`ml-2 text-sm font-medium ${
          step >= 1 ? 'text-primary-600' : 'text-gray-500'
        }`}>
          Booking Details
        </div>
      </div>
      
      <div className={`w-16 h-0.5 mx-4 ${
        step >= 2 ? 'bg-primary-600' : 'bg-gray-200'
      }`}></div>
      
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          {step >= 2 ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            <span className="text-sm font-medium">2</span>
          )}
        </div>
        <div className={`ml-2 text-sm font-medium ${
          step >= 2 ? 'text-primary-600' : 'text-gray-500'
        }`}>
          Payment
        </div>
      </div>
    </div>
  );

  if (!bookingService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No service selected</h2>
          <p className="text-gray-600">Please select a service to book.</p>
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
            <h1 className="text-2xl font-bold">Book Your Service</h1>
            <p className="text-primary-100">Complete your booking in a few simple steps</p>
          </div>

          {renderStepIndicator()}

          <div className="p-6">
            {step === 1 ? (
              // Step 1: Booking Details
              <div className="space-y-6">
                {/* Service Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={bookingService.images?.[0] || '/placeholder-service.jpg'}
                      alt={bookingService.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{bookingService.name}</h3>
                      <p className="text-sm text-gray-600">{bookingService.description}</p>
                      <div className="flex items-center mt-1">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          {bookingService.location?.city}, {bookingService.location?.state}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {formatPrice(bookingService.price)}
                      </div>
                      <div className="text-sm text-gray-500">per hour</div>
                    </div>
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CalendarIcon className="h-4 w-4 inline mr-1" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <ClockIcon className="h-4 w-4 inline mr-1" />
                      Select Time
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Choose a time</option>
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>
                          {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Duration Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours)
                  </label>
                  <div className="flex items-center space-x-4">
                    {[1, 2, 3, 4, 5].map((hours) => (
                      <button
                        key={hours}
                        type="button"
                        onClick={() => handleDurationChange(hours)}
                        className={`px-4 py-2 rounded-md border ${
                          duration === hours
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {hours} {hours === 1 ? 'hour' : 'hours'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <PhoneIcon className="h-4 w-4 inline mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue={user?.phone}
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[\+]?[1-9][\d]{0,15}$/,
                          message: 'Invalid phone number',
                        },
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+1234567890"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPinIcon className="h-4 w-4 inline mr-1" />
                    Service Location (if different from provider location)
                  </label>
                  <textarea
                    {...register('location')}
                    rows="2"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter specific address or location details..."
                  />
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    {...register('specialRequests')}
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Any special requirements or requests..."
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Price Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Price ({duration} hour{duration > 1 ? 's' : ''})</span>
                      <span>{formatPrice(bookingService.price * duration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Fee</span>
                      <span>{formatPrice(10)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-lg text-green-600">{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            ) : (
              // Step 2: Payment
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <div className="ml-3 flex items-center">
                        <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Credit/Debit Card</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Payment Form */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Card Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Final Price Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Final Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service</span>
                      <span>{bookingService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time</span>
                      <span>
                        {selectedDate} at {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span>{duration} hour{duration > 1 ? 's' : ''}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount</span>
                        <span className="text-lg text-green-600">{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || isProcessing}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading || isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
