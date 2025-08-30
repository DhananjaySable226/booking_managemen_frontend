import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
  CurrencyDollarIcon,
  UserIcon,
  CogIcon,
  BellIcon,
  HeartIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { getUserBookings } from '../features/bookings/bookingsSlice';
import { getPaymentHistory, getPaymentStats } from '../features/payments/paymentsSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { fetchFavorites } from '../features/favorites/favoritesSlice';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalSpent: 0,
    averageRating: 0
  });

  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const { userBookings: bookings, loading: bookingsLoading } = useSelector((state) => state.bookings);
  const { payments, loading: paymentsLoading, stats: paymentStats } = useSelector((state) => state.payments);
  const { items: favoriteServices, loading: favoritesLoading } = useSelector((state) => state.favorites);



  // Show loading if auth is still loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect based on user role
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'service_provider') {
      return <Navigate to="/provider" replace />;
    }
  }

  // Show login message if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h1>
          <p className="text-gray-600">You need to be logged in to view the dashboard.</p>
          <Link
            to="/login"
            className="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Fetch data when user is available
  useEffect(() => {
    if (user && user.token) {
      dispatch(getUserBookings());
      dispatch(getPaymentHistory());
      dispatch(getPaymentStats({ period: 'month' }));
      dispatch(fetchFavorites());
    }
  }, [dispatch, user]);

  // Calculate stats when bookings and payment stats change
  useEffect(() => {
    const totalBookings = bookings?.length || 0;
    const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
    const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;

    // Use payment statistics for financial data
    const paymentTotals = paymentStats?.totals || {};
    const totalSpent = paymentTotals.completedAmount || 0;
    const averageRating = bookings?.filter(b => b.rating)
      .reduce((sum, b) => sum + (b.rating || 0), 0) / (bookings?.filter(b => b.rating).length || 1) || 0;

    setStats({
      totalBookings,
      completedBookings,
      pendingBookings,
      totalSpent,
      averageRating
    });
  }, [bookings, paymentStats]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', text: 'Confirmed' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
      in_progress: { color: 'bg-purple-100 text-purple-800', text: 'In Progress' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return [...Array(5)].map((_, index) => (
      <span key={index}>
        {index < Math.floor(rating) ? (
          <StarIconSolid className="h-4 w-4 text-yellow-400" />
        ) : (
          <StarIcon className="h-4 w-4 text-gray-300" />
        )}
      </span>
    ));
  };

  // Show loading if data is still loading
  if (bookingsLoading || paymentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.firstName || 'User'}! Here's what's happening with your bookings.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completedBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900">{formatPrice(stats.totalSpent)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: UserIcon },
                { id: 'bookings', name: 'My Bookings', icon: CalendarIcon },
                { id: 'payments', name: 'Payments', icon: CreditCardIcon },
                { id: 'favorites', name: 'Favorites', icon: HeartIcon },
                { id: 'settings', name: 'Settings', icon: CogIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h3>
                  {bookings && Array.isArray(bookings) && bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking._id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={booking.service?.images?.[0] || '/placeholder-service.jpg'}
                                alt={booking.service?.name || 'Service'}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <h4 className="font-medium text-gray-900">{booking.service?.name || 'Unknown Service'}</h4>
                                <p className="text-sm text-gray-500">
                                  {formatDate(booking.bookingDate)} at {booking.startTime || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">{formatPrice(booking.totalAmount)}</p>
                              {getStatusBadge(booking.status)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No bookings yet</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Link
                        to="/services"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <CalendarIcon className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-gray-700">Book a Service</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <UserIcon className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-gray-700">Update Profile</span>
                      </Link>
                      <Link
                        to="/payments"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <CreditCardIcon className="h-5 w-5 text-purple-600 mr-3" />
                        <span className="text-gray-700">Payment Methods</span>
                      </Link>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <BellIcon className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Welcome!</p>
                          <p className="text-sm text-blue-700">Complete your profile to get started</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">My Bookings</h3>
                  <Link
                    to="/services"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Book New Service
                  </Link>
                </div>

                {bookings && Array.isArray(bookings) && bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <img
                              src={booking.service?.images?.[0] || '/placeholder-service.jpg'}
                              alt={booking.service?.name || 'Service'}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{booking.service?.name || 'Unknown Service'}</h4>
                              <p className="text-sm text-gray-500 mt-1">{booking.service?.description || 'No description'}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  {formatDate(booking.bookingDate)}
                                </span>
                                <span className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}
                                </span>
                                <span className="flex items-center">
                                  <MapPinIcon className="h-4 w-4 mr-1" />
                                  {booking.service?.location?.city || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formatPrice(booking.totalAmount)}</p>
                            {getStatusBadge(booking.status)}
                            {booking.rating && (
                              <div className="flex items-center justify-end mt-2">
                                {renderStars(booking.rating)}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end space-x-3">
                          <Link
                            to={`/bookings/${booking._id}`}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View Details
                          </Link>
                          {booking.status === 'completed' && !booking.rating && (
                            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                              Rate Service
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by booking your first service.</p>
                    <div className="mt-6">
                      <Link
                        to="/services"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Browse Services
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
                {payments && Array.isArray(payments) && payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment._id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{payment.description || 'Service Payment'}</p>
                            <p className="text-sm text-gray-500">{formatDate(payment.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formatPrice(payment.amount)}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No payment history</p>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Favorite Services</h3>
                {favoritesLoading ? (
                  <div className="flex justify-center py-8"><LoadingSpinner size="small" /></div>
                ) : favoriteServices && favoriteServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteServices.map((svc) => (
                      <div key={svc._id} className="border rounded-lg overflow-hidden">
                        <img src={(svc.images?.[0]?.url) || svc.images?.[0] || '/placeholder-service.jpg'} alt={svc.name} className="w-full h-40 object-cover" />
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900">{svc.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{svc.location?.city || ''}</p>
                          <div className="mt-3">
                            <Link to={`/services/${svc._id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">View</Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No favorite services yet</p>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <Link
                    to="/profile"
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <UserIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Profile Settings</p>
                      <p className="text-sm text-gray-500">Update your personal information</p>
                    </div>
                  </Link>
                  <Link
                    to="/payments"
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <CreditCardIcon className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Payment Methods</p>
                      <p className="text-sm text-gray-500">Manage your payment options</p>
                    </div>
                  </Link>
                  <Link
                    to="/notifications"
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <BellIcon className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Notifications</p>
                      <p className="text-sm text-gray-500">Configure notification preferences</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
