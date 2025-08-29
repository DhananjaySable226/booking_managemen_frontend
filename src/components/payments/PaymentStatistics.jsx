import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPaymentStats } from '../../features/payments/paymentsSlice';
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const PaymentStatistics = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.payments);
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const params = {};
    if (period) params.period = period;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    dispatch(getPaymentStats(params));
  }, [dispatch, period, startDate, endDate]);

  const formatAmount = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount || 0);
  };

  const formatPercentage = (value, total) => {
    if (!total || total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'text-green-600 bg-green-100',
      pending: 'text-yellow-600 bg-yellow-100',
      failed: 'text-red-600 bg-red-100',
      processing: 'text-blue-600 bg-blue-100',
      cancelled: 'text-gray-600 bg-gray-100',
      refunded: 'text-purple-600 bg-purple-100'
    };
    return colors[status] || colors.pending;
  };

  const getMethodIcon = (method) => {
    const icons = {
      razorpay: '💳',
      card: '💳',
      upi: '📱',
      netbanking: '🏦',
      wallet: '👛',
      cash: '💵'
    };
    return icons[method] || '💳';
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
        <p className="text-red-600">Error loading statistics: {error}</p>
      </div>
    );
  }

  const totals = stats?.totals || {};
  const statusStats = stats?.status || [];
  const methodStats = stats?.methods || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Payment Statistics</h2>
        
        {/* Filters */}
        <div className="flex space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            placeholder="Start Date"
          />
          
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            placeholder="End Date"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Payments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{totals.totalPayments || 0}</p>
            </div>
          </div>
        </div>

        {/* Total Amount */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatAmount(totals.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Completed Payments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{totals.completedPayments || 0}</p>
              <p className="text-xs text-gray-500">
                {formatPercentage(totals.completedPayments, totals.totalPayments)}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{totals.pendingPayments || 0}</p>
              <p className="text-xs text-gray-500">
                {formatPercentage(totals.pendingPayments, totals.totalPayments)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Status Breakdown</h3>
          <div className="space-y-3">
            {statusStats.map((stat) => (
              <div key={stat._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(stat._id)}`}>
                    {stat._id.charAt(0).toUpperCase() + stat._id.slice(1)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{stat.count}</p>
                  <p className="text-xs text-gray-500">{formatAmount(stat.totalAmount)}</p>
                </div>
              </div>
            ))}
            {statusStats.length === 0 && (
              <p className="text-gray-500 text-center py-4">No payment data available</p>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {methodStats.map((stat) => (
              <div key={stat._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-xl mr-2">{getMethodIcon(stat._id)}</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {stat._id.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{stat.count}</p>
                  <p className="text-xs text-gray-500">{formatAmount(stat.totalAmount)}</p>
                </div>
              </div>
            ))}
            {methodStats.length === 0 && (
              <p className="text-gray-500 text-center py-4">No payment method data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Average Payment</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatAmount(totals.averageAmount)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Success Rate</p>
            <p className="text-2xl font-bold text-green-600">
              {formatPercentage(totals.completedPayments, totals.totalPayments)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Failed Payments</p>
            <p className="text-2xl font-bold text-red-600">{totals.failedPayments || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatistics;
