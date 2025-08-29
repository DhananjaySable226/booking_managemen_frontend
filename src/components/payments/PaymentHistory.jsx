import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPaymentHistory } from '../../features/payments/paymentsSlice';
import { format } from 'date-fns';

const PaymentHistory = () => {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(getPaymentHistory());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      processing: { color: 'bg-blue-100 text-blue-800', text: 'Processing' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Failed' },
      cancelled: { color: 'bg-gray-100 text-gray-800', text: 'Cancelled' },
      refunded: { color: 'bg-purple-100 text-purple-800', text: 'Refunded' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    const methodIcons = {
      razorpay: '💳',
      card: '💳',
      upi: '📱',
      netbanking: '🏦',
      wallet: '👛',
      cash: '💵'
    };
    return methodIcons[method] || '💳';
  };

  const formatAmount = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading payment history: {error}</p>
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-6xl mb-4">💳</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
        <p className="text-gray-600">Your payment history will appear here once you make your first payment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
        <span className="text-sm text-gray-500">{payments.length} payments</span>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <li key={payment._id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getPaymentMethodIcon(payment.paymentMethod)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {payment.description || 'Payment'}
                      </h3>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>
                        {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{payment.paymentMethod}</span>
                      {payment.razorpayPaymentId && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-xs">
                            {payment.razorpayPaymentId.slice(-8)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatAmount(payment.amount, payment.currency)}
                  </div>
                  {payment.refundAmount && (
                    <div className="text-xs text-red-600">
                      Refunded: {formatAmount(payment.refundAmount, payment.currency)}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional payment details */}
              {payment.metadata && Object.keys(payment.metadata).length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    {payment.razorpayOrderId && (
                      <div>
                        <span className="font-medium">Order ID:</span> {payment.razorpayOrderId}
                      </div>
                    )}
                    {payment.booking && (
                      <div>
                        <span className="font-medium">Booking:</span> {payment.booking._id?.slice(-8)}
                      </div>
                    )}
                    {payment.failureReason && (
                      <div className="col-span-2">
                        <span className="font-medium text-red-600">Failure Reason:</span> {payment.failureReason}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PaymentHistory;
