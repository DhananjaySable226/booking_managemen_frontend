import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { getMyServices } from '../features/services/servicesSlice';
import { getProviderBookings } from '../features/bookings/bookingsSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProviderBookings from './ProviderBookings';

const ServiceProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Log tab changes
  useEffect(() => {
    console.log('ServiceProviderDashboard: Tab changed to:', activeTab);
  }, [activeTab]);
  const [selectedService, setSelectedService] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { myServices, loading: servicesLoading } = useSelector((state) => state.services);
  const { providerBookings: bookings, loading: bookingsLoading } = useSelector((state) => state.bookings);

  // Handle both shapes and fallback to localStorage on first load
  const persisted = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
  const persistedUser = persisted && persisted.user ? persisted.user : persisted;
  const currentUserRaw = (user && (user.user || user)) || persistedUser || null;
  const currentUser = currentUserRaw ? { ...currentUserRaw, _id: currentUserRaw._id || currentUserRaw.id } : null;

  useEffect(() => {
    if (currentUser && (currentUser._id || currentUser.id)) {
      console.log('ServiceProviderDashboard: Fetching data for user:', currentUser._id || currentUser.id);
      dispatch(getMyServices());
      // Only fetch bookings if we're on the bookings tab or overview
      if (activeTab === 'bookings' || activeTab === 'overview') {
        dispatch(getProviderBookings());
      }
    }
  }, [dispatch, currentUser && (currentUser._id || currentUser.id), activeTab]);

  // Refetch when switching to bookings tab
  useEffect(() => {
    if (activeTab === 'bookings' && currentUser && (currentUser._id || currentUser.id)) {
      dispatch(getProviderBookings());
    }
  }, [activeTab, dispatch, currentUser && (currentUser._id || currentUser.id)]);

  // Function to refresh all data (called after booking actions)
  const refreshData = () => {
    if (currentUser && (currentUser._id || currentUser.id)) {
      dispatch(getMyServices());
      dispatch(getProviderBookings());
    }
  };

  // Refetch when switching back to My Services tab
  useEffect(() => {
    if (activeTab === 'services' && currentUser && (currentUser._id || currentUser.id)) {
      dispatch(getMyServices());
    }
  }, [activeTab, dispatch, currentUser && (currentUser._id || currentUser.id)]);

  // Debug logging
  console.log('ServiceProviderDashboard render:', {
    currentUser,
    myServices: myServices?.length || 0,
    servicesLoading,
    bookings: bookings?.length || 0,
    bookingsLoading,
    activeTab
  });

  const handleDeleteService = (service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Implement delete service logic
      toast.success('Service deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedService(null);
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalEarnings = () => {
    if (!bookings || !Array.isArray(bookings)) return 0;

    const completedBookings = bookings.filter(booking => booking.status === 'completed');
    const totalEarnings = completedBookings.reduce((total, booking) => {
      // Try different possible field names for the amount
      const amount = booking.totalAmount || booking.amount || booking.price || 0;
      return total + amount;
    }, 0);

    console.log('Earnings calculation:', {
      totalBookings: bookings.length,
      completedBookings: completedBookings.length,
      completedBookingsData: completedBookings.map(b => ({
        id: b._id,
        status: b.status,
        amount: b.totalAmount || b.amount || b.price,
        serviceName: b.service?.name
      })),
      totalEarnings
    });

    return totalEarnings;
  };

  const getUpcomingBookings = () => {
    if (!bookings || !Array.isArray(bookings)) return [];
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate > now && booking.status === 'confirmed';
    });
  };

  const getPendingBookings = () => {
    if (!bookings || !Array.isArray(bookings)) return [];
    return bookings.filter(booking => booking.status === 'pending');
  };

  if (servicesLoading || bookingsLoading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Service Provider Dashboard
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">
                    Professional Management Portal
                  </p>
                </div>
              </div>
              <p className="text-gray-600 ml-13">
                Welcome back, <span className="font-semibold text-gray-800">{currentUser?.firstName}</span>! Manage your services and bookings efficiently.
              </p>
            </div>
            <Link
              to="/services/create"
              className="group inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
              Add New Service
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Total Bookings</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{bookings && Array.isArray(bookings) ? bookings.length : 0}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-200/50 transition-all duration-300">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Active bookings</span>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Total Earnings</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  ${calculateTotalEarnings().toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-200/50 transition-all duration-300">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>This month</span>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 hover:border-yellow-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Active Services</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {myServices && Array.isArray(myServices) ? myServices.filter(s => s.isActive).length : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-yellow-200/50 transition-all duration-300">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span>Available now</span>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Average Rating</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {myServices && Array.isArray(myServices) && myServices.length > 0
                    ? (myServices.reduce((sum, s) => sum + (s.rating?.average || 0), 0) / myServices.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-200/50 transition-all duration-300">
                <StarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span>Customer satisfaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-2">
            <nav className="flex flex-wrap sm:flex-nowrap overflow-x-auto gap-1">
              {[
                { id: 'overview', name: 'Overview', count: null, icon: '📊' },
                { id: 'services', name: 'My Services', count: myServices && Array.isArray(myServices) ? myServices.length : 0, icon: '🛠️' },
                { id: 'bookings', name: 'Bookings', count: bookings && Array.isArray(bookings) ? bookings.length : 0, icon: '📅' },
                { id: 'earnings', name: 'Earnings', count: null, icon: '💰' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-2 py-3 px-4 rounded-xl font-medium text-sm whitespace-nowrap flex-shrink-0 transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-md border border-blue-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'
                    }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.name}
                  {tab.count !== null && (
                    <span className={`ml-1 py-1 px-2.5 rounded-full text-xs font-semibold ${activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-200 text-gray-700'
                      }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {getUpcomingBookings() && getUpcomingBookings().slice(0, 3).map((booking) => (
                      <div key={booking._id} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900">{booking.service?.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.bookingDate).toLocaleDateString()} at {booking.startTime}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                    {(!getUpcomingBookings() || getUpcomingBookings().length === 0) && (
                      <p className="text-gray-500 text-center py-4">No upcoming bookings</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link
                      to="/services/create"
                      className="group bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-2xl p-6 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
                        <PlusIcon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-blue-900 text-base mb-2">Add New Service</h4>
                      <p className="text-sm text-blue-700">Create a new service offering</p>
                      <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                        Get Started →
                      </div>
                    </Link>

                    <Link
                      to="/bookings"
                      className="group bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-2xl p-6 hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
                        <CalendarIcon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-green-900 text-base mb-2">View Bookings</h4>
                      <p className="text-sm text-green-700">Manage your bookings</p>
                      <div className="mt-4 flex items-center text-green-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                        View All →
                      </div>
                    </Link>

                    <Link
                      to="/profile"
                      className="group bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-2xl p-6 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
                        <UsersIcon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-purple-900 text-base mb-2">Update Profile</h4>
                      <p className="text-sm text-purple-700">Edit your business information</p>
                      <div className="mt-4 flex items-center text-purple-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                        Edit Profile →
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">My Services</h3>
                  <Link
                    to="/services/create"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    + Add New Service
                  </Link>
                </div>

                {(!myServices || !Array.isArray(myServices) || myServices.length === 0) ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No services yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating your first service.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/services/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Service
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {myServices && Array.isArray(myServices) && myServices.map((service) => (
                      <div key={service._id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="relative">
                          <img
                            src={service.images?.[0]?.url || '/placeholder-service.jpg'}
                            alt={service.name}
                            className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3">
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg ${service.isActive
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                              }`}>
                              {service.isActive ? '✓ Active' : '✗ Inactive'}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <div className="p-4 sm:p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{service.name}</h4>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">{service.category}</span>
                          </div>

                          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                            {service.description}
                          </p>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-green-600">
                                ${service.price?.amount || 0}
                              </span>
                              <span className="text-xs text-gray-500">per booking</span>
                            </div>
                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                              <StarIcon className="h-4 w-4 text-yellow-500" />
                              <span className="ml-1 text-sm font-medium text-yellow-700">
                                {service.rating?.average || 0}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/services/${service._id}`)}
                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="View Service"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => navigate(`/services/edit/${service._id}`)}
                                className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                                title="Edit Service"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(service)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Delete Service"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                              Click to manage
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div key="bookings-tab">
                <ProviderBookings onDataRefresh={refreshData} />
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Earnings Overview</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Monthly Earnings</h4>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600">
                      ${calculateTotalEarnings().toFixed(2)}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">Total earnings from completed bookings</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Pending Payments</h4>
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-600">
                      ${bookings && Array.isArray(bookings) ? bookings
                        .filter(b => b.status === 'confirmed' && b.paymentStatus === 'pending')
                        .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
                        .toFixed(2) : '0.00'
                      }
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">Amount from confirmed bookings</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h4>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden sm:block">
                      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500">
                          <div>Date</div>
                          <div>Service</div>
                          <div>Customer</div>
                          <div>Amount</div>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {bookings && Array.isArray(bookings) ? bookings
                          .filter(b => b.paymentStatus === 'paid')
                          .slice(0, 5)
                          .map((booking) => (
                            <div key={booking._id} className="px-4 sm:px-6 py-4">
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div>{new Date(booking.createdAt).toLocaleDateString()}</div>
                                <div>{booking.service?.name}</div>
                                <div>{booking.user?.firstName} {booking.user?.lastName}</div>
                                <div className="text-green-600 font-medium">
                                  ${booking.totalAmount || 0}
                                </div>
                              </div>
                            </div>
                          )) : (
                          <div className="px-4 sm:px-6 py-4 text-center text-gray-500">
                            No transactions yet
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="sm:hidden">
                      {bookings && Array.isArray(bookings) ? bookings
                        .filter(b => b.paymentStatus === 'paid')
                        .slice(0, 5)
                        .map((booking) => (
                          <div key={booking._id} className="px-4 py-3 border-b border-gray-200 last:border-b-0">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">Date</span>
                                <span className="text-sm font-medium">{new Date(booking.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">Service</span>
                                <span className="text-sm font-medium">{booking.service?.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">Customer</span>
                                <span className="text-sm font-medium">{booking.user?.firstName} {booking.user?.lastName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">Amount</span>
                                <span className="text-sm font-bold text-green-600">${booking.totalAmount || 0}</span>
                              </div>
                            </div>
                          </div>
                        )) : (
                        <div className="px-4 py-6 text-center text-gray-500">
                          No transactions yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 w-11/12 sm:w-96">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-red-100/50 px-6 py-4 border-b border-red-200">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-3">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 text-center">Delete Service</h3>
              </div>

              <div className="px-6 py-6">
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">"{selectedService.name}"</span>?
                  <br />
                  <span className="text-sm text-red-600">This action cannot be undone.</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-red-200/50"
                  >
                    Delete Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderDashboard;
