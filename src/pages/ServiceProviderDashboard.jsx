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
import { getProviderServices } from '../features/services/serviceSlice';
import { getProviderBookings } from '../features/bookings/bookingsSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ServiceProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedService, setSelectedService] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { services, loading: servicesLoading } = useSelector((state) => state.services);
  const { bookings, loading: bookingsLoading } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (user && user._id) {
      dispatch(getProviderServices(user._id));
      dispatch(getProviderBookings());
    }
  }, [dispatch, user]);

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
    return bookings
      .filter(booking => booking.status === 'completed' && booking.paymentStatus === 'paid')
      .reduce((total, booking) => total + (booking.totalAmount || 0), 0);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Provider Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Welcome back, {user?.firstName}! Manage your services and bookings.
              </p>
            </div>
            <Link
              to="/services/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New Service
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{bookings && Array.isArray(bookings) ? bookings.length : 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${calculateTotalEarnings().toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Services</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {services && Array.isArray(services) ? services.filter(s => s.isActive).length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <StarIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {services && Array.isArray(services) && services.length > 0 
                    ? (services.reduce((sum, s) => sum + (s.rating?.average || 0), 0) / services.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', count: null },
                { id: 'services', name: 'My Services', count: services && Array.isArray(services) ? services.length : 0 },
                { id: 'bookings', name: 'Bookings', count: bookings && Array.isArray(bookings) ? bookings.length : 0 },
                { id: 'earnings', name: 'Earnings', count: null }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  {tab.count !== null && (
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
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
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      to="/services/create"
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors"
                    >
                      <PlusIcon className="h-8 w-8 text-blue-600 mb-2" />
                      <h4 className="font-medium text-blue-900">Add New Service</h4>
                      <p className="text-sm text-blue-700">Create a new service offering</p>
                    </Link>
                    
                    <Link
                      to="/bookings"
                      className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors"
                    >
                      <CalendarIcon className="h-8 w-8 text-green-600 mb-2" />
                      <h4 className="font-medium text-green-900">View Bookings</h4>
                      <p className="text-sm text-green-700">Manage your bookings</p>
                    </Link>
                    
                    <Link
                      to="/profile"
                      className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition-colors"
                    >
                      <UsersIcon className="h-8 w-8 text-purple-600 mb-2" />
                      <h4 className="font-medium text-purple-900">Update Profile</h4>
                      <p className="text-sm text-purple-700">Edit your business information</p>
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
                
                {(!services || !Array.isArray(services) || services.length === 0) ? (
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services && Array.isArray(services) && services.map((service) => (
                      <div key={service._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative">
                          <img
                            src={service.images?.[0]?.url || '/placeholder-service.jpg'}
                            alt={service.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">{service.name}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {service.description}
                          </p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-green-600">
                              ${service.price?.amount || 0}
                            </span>
                            <div className="flex items-center">
                              <StarIcon className="h-4 w-4 text-yellow-400" />
                              <span className="ml-1 text-sm text-gray-600">
                                {service.rating?.average || 0}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 capitalize">{service.category}</span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/services/${service._id}`)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => navigate(`/services/edit/${service._id}`)}
                                className="text-indigo-600 hover:text-indigo-800"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(service)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
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
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">All Bookings</h3>
                
                {(!bookings || !Array.isArray(bookings) || bookings.length === 0) ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      When customers book your services, they'll appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings && Array.isArray(bookings) && bookings.map((booking) => (
                          <tr key={booking._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={booking.service?.images?.[0]?.url || '/placeholder-service.jpg'}
                                    alt={booking.service?.name}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {booking.service?.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {booking.user?.firstName} {booking.user?.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.user?.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(booking.bookingDate).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.startTime} - {booking.endTime}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${booking.totalAmount || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Earnings Overview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Monthly Earnings</h4>
                    <div className="text-3xl font-bold text-green-600">
                      ${calculateTotalEarnings().toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Total earnings from completed bookings</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Pending Payments</h4>
                    <div className="text-3xl font-bold text-yellow-600">
                      ${bookings && Array.isArray(bookings) ? bookings
                        .filter(b => b.status === 'confirmed' && b.paymentStatus === 'pending')
                        .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
                        .toFixed(2) : '0.00'
                      }
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Amount from confirmed bookings</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h4>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
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
                          <div key={booking._id} className="px-6 py-4">
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
                          <div className="px-6 py-4 text-center text-gray-500">
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Service</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete "{selectedService.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderDashboard;
