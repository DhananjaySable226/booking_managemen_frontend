import React, { useState } from 'react';
import PaymentHistory from '../components/payments/PaymentHistory';
import PaymentStatistics from '../components/payments/PaymentStatistics';
import PaymentMethods from '../components/payments/PaymentMethods';
import RazorpayPayment from '../components/payments/RazorpayPayment';

const Payments = () => {
    const [activeTab, setActiveTab] = useState('history');

    const tabs = [
        { id: 'history', name: 'Payment History', icon: '📋' },
        { id: 'statistics', name: 'Statistics', icon: '📊' },
        { id: 'methods', name: 'Payment Methods', icon: '💳' },
        { id: 'new', name: 'New Payment', icon: '➕' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'history':
                return <PaymentHistory />;
            case 'statistics':
                return <PaymentStatistics />;
            case 'methods':
                return (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Methods</h2>
                        <PaymentMethods
                            amount={1500}
                            currency="INR"
                            bookingId="example_booking_123"
                            onSuccess={(data) => console.log('Payment successful:', data)}
                            onFailure={(error) => console.error('Payment failed:', error)}
                            description="Payment for service booking"
                            customerName="John Doe"
                            customerEmail="john@example.com"
                            customerPhone="+1234567890"
                        />
                    </div>
                );
            case 'new':
                return (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a New Payment</h2>
                        <RazorpayPayment
                            amount={1500}
                            currency="INR"
                            bookingId="example_booking_123"
                            onSuccess={(data) => console.log('Payment successful:', data)}
                            onFailure={(error) => console.error('Payment failed:', error)}
                            description="Payment for service booking"
                            customerName="John Doe"
                            customerEmail="john@example.com"
                            customerPhone="+1234567890"
                        />
                    </div>
                );
            default:
                return <PaymentHistory />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
                <p className="mt-2 text-gray-600">
                    Manage your payments, view history, and access detailed statistics.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Payments;


