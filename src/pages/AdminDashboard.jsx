import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  UsersIcon, 
  CalendarIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  CogIcon,
  BellIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { 
  getDashboardStats, 
  getRevenueAnalytics, 
  getBookingAnalytics,
  getUserAnalytics,
  getServiceAnalytics 
} from '../features/admin/adminSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { 
    dashboardStats, 
    revenueAnalytics, 
    bookingAnalytics,
    userAnalytics,
    serviceAnalytics,
    loading, 
    error 
  } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
      return;
    }

    fetchDashboardData();
  }, [user, navigate, selectedPeriod]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        dispatch(getDashboardStats({ period: selectedPeriod })),
        dispatch(getRevenueAnalytics({ period: selectedPeriod })),
        dispatch(getBookingAnalytics({ period: selectedPeriod })),
        dispatch(getUserAnalytics({ period: selectedPeriod })),
        dispatch(getServiceAnalytics({ period: selectedPeriod }))
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  const getPercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const renderStatCard = (title, value, change, icon, color = 'blue') => {
    const isPositive = change >= 0;
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center mt-2">
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              )}
              <span className={`ml-1 text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="ml-1 text-sm text-gray-500">vs last period</span>
            </div>
          </div>
          <div className={`p-3 rounded-full bg-${color}-100`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  const renderQuickActions = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <UsersIcon className="h-8 w-8 text-blue-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">Manage Users</span>
        </button>
        <button
          onClick={() => navigate('/admin/services')}
          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <CogIcon className="h-8 w-8 text-green-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">Manage Services</span>
        </button>
        <button
          onClick={() => navigate('/admin/bookings')}
          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <CalendarIcon className="h-8 w-8 text-purple-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">View Bookings</span>
        </button>
        <button
          onClick={() => navigate('/admin/analytics')}
          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ChartBarIcon className="h-8 w-8 text-orange-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">Analytics</span>
        </button>
      </div>
    </div>
  );

  const renderRecentActivity = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {dashboardStats?.recentActivity?.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTopServices = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Services</h3>
      <div className="space-y-3">
        {serviceAnalytics?.topServices?.map((service, index) => (
          <div key={service._id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
              <img
                src={service.image || '/placeholder-service.jpg'}
                alt={service.name}
                className="w-8 h-8 rounded object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{service.name}</p>
                <p className="text-xs text-gray-500">{service.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{formatCurrency(service.revenue)}</p>
              <p className="text-xs text-gray-500">{service.bookings} bookings</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Welcome back, {user?.firstName}! Here's what's happening with your platform.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <BellIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {renderStatCard(
            'Total Revenue',
            formatCurrency(dashboardStats?.totalRevenue || 0),
            getPercentageChange(
              dashboardStats?.currentRevenue || 0,
              dashboardStats?.previousRevenue || 0
            ),
            <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />,
            'blue'
          )}
          {renderStatCard(
            'Total Bookings',
            formatNumber(dashboardStats?.totalBookings || 0),
            getPercentageChange(
              dashboardStats?.currentBookings || 0,
              dashboardStats?.previousBookings || 0
            ),
            <CalendarIcon className="h-6 w-6 text-green-600" />,
            'green'
          )}
          {renderStatCard(
            'Active Users',
            formatNumber(dashboardStats?.activeUsers || 0),
            getPercentageChange(
              dashboardStats?.currentUsers || 0,
              dashboardStats?.previousUsers || 0
            ),
            <UsersIcon className="h-6 w-6 text-purple-600" />,
            'purple'
          )}
          {renderStatCard(
            'Conversion Rate',
            `${((dashboardStats?.conversionRate || 0) * 100).toFixed(1)}%`,
            getPercentageChange(
              dashboardStats?.currentConversionRate || 0,
              dashboardStats?.previousConversionRate || 0
            ),
            <ChartBarIcon className="h-6 w-6 text-orange-600" />,
            'orange'
          )}
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>Revenue chart will be displayed here</p>
            </div>
          </div>

          {/* Bookings Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Trend</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>Booking chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {renderQuickActions()}
          {renderRecentActivity()}
          {renderTopServices()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
