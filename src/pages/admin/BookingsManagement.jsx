import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookingAnalytics } from '../../features/admin/adminSlice';

const BookingsManagement = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const { bookingAnalytics, loading } = useSelector((s) => s.admin);

    useEffect(() => {
        dispatch(getBookingAnalytics({}));
    }, [dispatch]);

    if (!user || user.role !== 'admin') return <div className="p-6">Access denied</div>;

    const totalBookings = (bookingAnalytics?.data?.trends || []).reduce((a, c) => a + (c.count || 0), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">View Bookings</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm text-gray-500">Total Bookings</h3>
                        <p className="text-2xl font-semibold">{totalBookings}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm text-gray-500">By Status</h3>
                        <ul className="mt-2 text-sm">
                            {(bookingAnalytics?.data?.statusDistribution || []).map((s) => (
                                <li key={s._id} className="flex justify-between"><span>{s._id}</span><span>{s.count}</span></li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm text-gray-500">Top Services</h3>
                        <ul className="mt-2 text-sm">
                            {(bookingAnalytics?.data?.topServices || []).map((t) => (
                                <li key={t._id?._id || t._id} className="flex justify-between"><span>{t._id?.name || 'Service'}</span><span>{t.count}</span></li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookingsManagement;


