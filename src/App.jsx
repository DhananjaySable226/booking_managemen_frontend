import React, { useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './app/store';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Bookings from './pages/Bookings';
import BookingDetail from './pages/BookingDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ServiceManagement from './pages/admin/ServiceManagement';
import UsersManagement from './pages/admin/UsersManagement';
import BookingsManagement from './pages/admin/BookingsManagement';
import ServiceForm from './pages/ServiceForm';
import ServiceProviderDashboard from './pages/ServiceProviderDashboard';
import NotFound from './pages/NotFound';
import Payments from './pages/Payments';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Checkout from './pages/Checkout';

// Redux actions
import { getMe } from './features/auth/authSlice';

// Guard to prevent duplicate getMe calls across React StrictMode remounts in development
let lastFetchedToken = null;

function App() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const hasFetchedMeRef = useRef(false);

  useEffect(() => {
    const token = user?.token;
    if (!token) return;

    // Prevent duplicate calls across remounts and state changes
    const alreadyFetchedForThisToken = lastFetchedToken === token || hasFetchedMeRef.current;
    if (alreadyFetchedForThisToken) return;

    hasFetchedMeRef.current = true;
    lastFetchedToken = token;
    dispatch(getMe());
  }, [dispatch, user?.token]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/payments" element={<ProtectedRoute forbidRoles={['admin', 'service_provider']}><Payments /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute forbidRoles={['admin', 'service_provider']}><Cart /></ProtectedRoute>} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute forbidRoles={['admin', 'service_provider']}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute forbidRoles={['admin', 'service_provider']}>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/:id"
              element={
                <ProtectedRoute>
                  <BookingDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute adminOnly>
                  <ServiceManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <UsersManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute adminOnly>
                  <BookingsManagement />
                </ProtectedRoute>
              }
            />

            {/* Service Provider Routes */}
            <Route
              path="/provider/*"
              element={
                <ProtectedRoute>
                  <ServiceProviderDashboard />
                </ProtectedRoute>
              }
            />

            {/* Service Management Routes */}
            <Route
              path="/services/create"
              element={
                <ProtectedRoute>
                  <ServiceForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/edit/:id"
              element={
                <ProtectedRoute>
                  <ServiceForm />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </PersistGate>
  );
}

export default App;

