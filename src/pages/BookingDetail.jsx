import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getBookingById } from '../features/bookings/bookingsSlice';

const BookingDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { bookings, booking, loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (!booking || booking?._id !== id) {
      dispatch(getBookingById(id));
    }
  }, [dispatch, id]);

  const effectiveBooking = booking || bookings.find(b => b._id === id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!effectiveBooking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Booking not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Booking Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Booking ID: {effectiveBooking._id}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Service</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {effectiveBooking.service?.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {(() => {
                  const dateValue = effectiveBooking.bookingDate || effectiveBooking.date;
                  const startTime = effectiveBooking.startTime || effectiveBooking.time;
                  if (!dateValue) return '—';
                  const d = new Date(dateValue);
                  const dateStr = isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
                  return `${dateStr}${startTime ? ` at ${startTime}` : ''}`;
                })()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {effectiveBooking.status}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                ${effectiveBooking.totalAmount}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
