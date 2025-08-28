import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import RazorpayPayment from './RazorpayPayment';

const PaymentMethods = ({ 
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
  const [selectedMethod, setSelectedMethod] = useState('razorpay');
  const { user } = useSelector((state) => state.auth);

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Pay with UPI, Cards, Net Banking, Wallets',
      icon: '💳',
      available: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay with your credit or debit card',
      icon: '💳',
      available: false // Not implemented yet
    },
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay using UPI apps like Google Pay, PhonePe',
      icon: '📱',
      available: false // Not implemented yet
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'Pay using your bank account',
      icon: '🏦',
      available: false // Not implemented yet
    }
  ];

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    onSuccess && onSuccess(paymentData);
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    onFailure && onFailure(error);
  };

  const renderPaymentMethod = () => {
    switch (selectedMethod) {
      case 'razorpay':
        return (
          <RazorpayPayment
            amount={amount}
            currency={currency}
            bookingId={bookingId}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
            description={description}
            customerName={customerName || user?.firstName + ' ' + user?.lastName}
            customerEmail={customerEmail || user?.email}
            customerPhone={customerPhone || user?.phone}
          />
        );
      default:
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">This payment method is not available yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
        
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => method.available && setSelectedMethod(method.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{method.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{method.name}</h4>
                    {selectedMethod === method.id && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                </div>
              </div>
              
              {!method.available && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Coming Soon</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-xl font-semibold text-gray-900">
            ₹{amount.toLocaleString()}
          </span>
        </div>
        
        {renderPaymentMethod()}
      </div>
    </div>
  );
};

export default PaymentMethods;
