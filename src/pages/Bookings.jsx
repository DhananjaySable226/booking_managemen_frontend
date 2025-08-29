import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getUserBookings } from '../features/bookings/bookingsSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Bookings = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading, isError, message } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getUserBookings());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800'
    };

    const s = typeof status === 'string' && status.length > 0 ? status : 'pending';
    const label = s.charAt(0).toUpperCase() + s.slice(1);
    const cls = statusClasses[s] || statusClasses.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
        {label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-2 text-gray-600">Manage your service bookings</p>
      </div>

      {bookings?.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by booking a service.</p>
          <div className="mt-6">
            <Link
              to="/services"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Browse Services
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {bookings?.map((booking) => (
              <li key={booking._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={booking.service?.images?.[0] || '/placeholder-service.jpg'}
                          alt={booking.service?.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {booking.service?.name}
                          </p>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <p>
                            {formatDate(booking.bookingDate || booking.date)} at {formatTime(booking.startTime || booking.time)}
                          </p>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          <p>Provider: {booking.service?.provider?.firstName} {booking.service?.provider?.lastName}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(booking.totalAmount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.duration} minutes
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/bookings/${booking._id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          View Details
                        </Link>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => {
                              // Handle cancel booking
                              toast.error('Cancel functionality not implemented yet');
                            }}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Bookings;
