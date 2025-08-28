import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PaymentMethods from './PaymentMethods';
import RazorpayPayment from './RazorpayPayment';
import PaymentHistory from './PaymentHistory';

const PaymentExample = () => {
  const [activeTab, setActiveTab] = useState('payment');
  const { user } = useSelector((state) => state.auth);

  const tabs = [
    { id: 'payment', name: 'Make Payment', icon: '💳' },
    { id: 'history', name: 'Payment History', icon: '📋' },
    { id: 'simple', name: 'Simple Payment', icon: '⚡' }
  ];

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    // Handle successful payment (e.g., redirect, show success message)
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    // Handle payment failure (e.g., show error message)
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'payment':
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h2>
            <PaymentMethods
              amount={1500}
              currency="INR"
              bookingId="example_booking_123"
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
              description="Payment for service booking"
              customerName={user?.firstName + ' ' + user?.lastName}
              customerEmail={user?.email}
              customerPhone={user?.phone}
            />
          </div>
        );

      case 'history':
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
            <PaymentHistory />
          </div>
        );

      case 'simple':
        return (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Payment</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Service Payment</h3>
                <p className="text-gray-600">Quick payment for service booking</p>
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Amount:</span>
                  <span className="text-xl font-bold text-gray-900">₹1,000</span>
                </div>
              </div>

              <RazorpayPayment
                amount={1000}
                currency="INR"
                bookingId="quick_booking_456"
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
                description="Quick service payment"
                customerName={user?.firstName + ' ' + user?.lastName}
                customerEmail={user?.email}
                customerPhone={user?.phone}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Examples</h1>
          <p className="text-gray-600">Different ways to integrate Razorpay payments</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white rounded-lg shadow-sm p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentExample;
