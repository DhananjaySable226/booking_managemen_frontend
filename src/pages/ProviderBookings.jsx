import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
    getProviderBookings,
    acceptBooking,
    rejectBooking,
    completeBooking
} from '../features/bookings/bookingsSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProviderBookings = ({ onDataRefresh = null }) => {
    const dispatch = useDispatch();
    const { providerBookings: bookings, loading: isLoading, error: isError, message } = useSelector((state) => state.bookings);
    const { user } = useSelector((state) => state.auth);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectingBookingId, setRejectingBookingId] = useState(null);



    useEffect(() => {
        // Only fetch if we don't have bookings data yet
        if (user && user.role === 'service_provider' && (!bookings || bookings.length === 0)) {
            console.log('ProviderBookings: Fetching data');
            dispatch(getProviderBookings());
        } else {
            console.log('ProviderBookings: Data already available or user not provider', {
                hasUser: !!user,
                userRole: user?.role,
                hasBookings: !!bookings,
                bookingsLength: bookings?.length
            });
        }
    }, [dispatch, user, bookings]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError, message]);

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-green-100 text-green-800',
            in_progress: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            no_show: 'bg-gray-100 text-gray-800'
        };

        const s = typeof status === 'string' && status.length > 0 ? status : 'pending';
        const label = s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ');
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

    const handleAccept = async (bookingId) => {
        try {
            await dispatch(acceptBooking(bookingId)).unwrap();
            toast.success('Booking accepted successfully');
            // Refresh data to update statistics
            if (onDataRefresh) {
                onDataRefresh();
            } else {
                dispatch(getProviderBookings());
            }
        } catch (err) {
            toast.error(err || 'Failed to accept booking');
        }
    };

    const handleReject = async (bookingId) => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        try {
            await dispatch(rejectBooking({ id: bookingId, reason: rejectReason })).unwrap();
            toast.success('Booking rejected successfully');
            setRejectReason('');
            setRejectingBookingId(null);
            // Refresh data to update statistics
            if (onDataRefresh) {
                onDataRefresh();
            } else {
                dispatch(getProviderBookings());
            }
        } catch (err) {
            toast.error(err || 'Failed to reject booking');
        }
    };

    const handleComplete = async (bookingId) => {
        try {
            await dispatch(completeBooking(bookingId)).unwrap();
            toast.success('Booking completed successfully');
            // Refresh data to update statistics
            if (onDataRefresh) {
                onDataRefresh();
            } else {
                dispatch(getProviderBookings());
            }
        } catch (err) {
            toast.error(err || 'Failed to complete booking');
        }
    };

    const openRejectModal = (bookingId) => {
        setRejectingBookingId(bookingId);
        setRejectReason('');
    };

    const closeRejectModal = () => {
        setRejectingBookingId(null);
        setRejectReason('');
    };

    // Only show loading spinner if we're actually loading AND don't have any data
    if (isLoading && (!bookings || bookings.length === 0)) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Incoming Bookings</h1>
                <p className="mt-2 text-gray-600">Manage booking requests for your services</p>
            </div>

            {bookings?.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No incoming bookings</h3>
                    <p className="mt-1 text-sm text-gray-500">You'll see booking requests here when customers book your services.</p>
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
                                                        {formatDate(booking.bookingDate)} at {formatTime(booking.startTime)}
                                                    </p>
                                                </div>
                                                <div className="mt-1 text-sm text-gray-500">
                                                    <p>Customer: {booking.user?.firstName} {booking.user?.lastName} ({booking.user?.email})</p>
                                                </div>
                                                {booking.specialRequests && (
                                                    <div className="mt-1 text-sm text-gray-500">
                                                        <p className="font-medium">Special Requests:</p>
                                                        <p className="italic">{booking.specialRequests}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatPrice(booking.totalAmount)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {booking.duration} hours
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                {/* Action buttons based on status */}
                                                {booking.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAccept(booking._id)}
                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => openRejectModal(booking._id)}
                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                                {booking.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleComplete(booking._id)}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        Mark Complete
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

            {/* Reject Modal */}
            {rejectingBookingId && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Booking</h3>
                            <div className="mb-4">
                                <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for rejection *
                                </label>
                                <textarea
                                    id="rejectReason"
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Please provide a reason for rejecting this booking..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={closeRejectModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReject(rejectingBookingId)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Reject Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderBookings;
