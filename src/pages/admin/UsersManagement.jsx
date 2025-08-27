import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAnalytics } from '../../features/admin/adminSlice';
import { useForm } from 'react-hook-form';
import { createServiceProvider } from '../../features/auth/authSlice';

const UsersManagement = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const { userAnalytics, loading } = useSelector((s) => s.admin);

    useEffect(() => {
        dispatch(getUserAnalytics({}));
    }, [dispatch]);

    if (!user || user.role !== 'admin') return <div className="p-6">Access denied</div>;

    const { register, handleSubmit, reset } = useForm();

    const onCreateProvider = async (data) => {
        try {
            await dispatch(createServiceProvider(data)).unwrap();
            reset();
            dispatch(getUserAnalytics({}));
            alert('Service provider created');
        } catch (e) {
            alert(e);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm text-gray-500">Total Users</h3>
                        <p className="text-2xl font-semibold">{userAnalytics?.data?.trends?.reduce((a, c) => a + (c.count || 0), 0) || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm text-gray-500">By Role</h3>
                        <ul className="mt-2 text-sm">
                            {(userAnalytics?.data?.roleDistribution || []).map((r) => (
                                <li key={r._id} className="flex justify-between"><span>{r._id}</span><span>{r.count}</span></li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm text-gray-500">Verified Emails</h3>
                        <ul className="mt-2 text-sm">
                            {(userAnalytics?.data?.verificationStats || []).map((v) => (
                                <li key={String(v._id)} className="flex justify-between"><span>{v._id ? 'Verified' : 'Unverified'}</span><span>{v.count}</span></li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Admin-only: create service provider */}
            <div id="create-provider" className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Create Service Provider</h3>
                <form onSubmit={handleSubmit(onCreateProvider)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">First Name</label>
                        <input className="w-full border rounded px-3 py-2" {...register('firstName', { required: true })} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Last Name</label>
                        <input className="w-full border rounded px-3 py-2" {...register('lastName', { required: true })} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full border rounded px-3 py-2" {...register('email', { required: true })} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Phone</label>
                        <input className="w-full border rounded px-3 py-2" {...register('phone', { required: true })} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Password</label>
                        <input type="password" className="w-full border rounded px-3 py-2" {...register('password', { required: true })} />
                    </div>
                    <div className="md:col-span-2 mt-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Provider</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UsersManagement;


