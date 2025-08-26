import React from 'react';

const FAQ = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-4">FAQ</h1>
            <div className="space-y-4">
                <div>
                    <h2 className="font-medium">How do I book a service?</h2>
                    <p className="text-gray-600">Browse services, select one, choose date/time, and confirm.</p>
                </div>
                <div>
                    <h2 className="font-medium">How can I cancel?</h2>
                    <p className="text-gray-600">Go to My Bookings and select a booking to cancel.</p>
                </div>
            </div>
        </div>
    );
};

export default FAQ;


