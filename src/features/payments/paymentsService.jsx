import axios from 'axios';

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'https://booking-management-backend.onrender.com';

const API_URL = '/api/payments';

// Razorpay functions
// Create Razorpay order
const createRazorpayOrder = async (orderData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${BASE_URL}${API_URL}/razorpay/create-order`, orderData, config);
  return response.data;
};

// Verify Razorpay payment
const verifyRazorpayPayment = async (paymentData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${BASE_URL}${API_URL}/razorpay/verify`, paymentData, config);
  return response.data;
};

// Get Razorpay payment details
const getRazorpayPaymentDetails = async (paymentId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.get(`${BASE_URL}${API_URL}/razorpay/${paymentId}`, config);
  return response.data;
};

// Refund Razorpay payment
const refundRazorpayPayment = async (paymentId, refundData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${BASE_URL}${API_URL}/razorpay/${paymentId}/refund`, refundData, config);
  return response.data;
};

// Get Razorpay payment methods
const getRazorpayPaymentMethods = async () => {
  const response = await axios.get(`${BASE_URL}${API_URL}/razorpay/payment-methods`);
  return response.data;
};

// Create Razorpay customer
const createRazorpayCustomer = async (customerData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${BASE_URL}${API_URL}/razorpay/customer`, customerData, config);
  return response.data;
};

// Generic payment data calls
// Get payment history
const getPaymentHistory = async (params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.status) queryParams.append('status', params.status);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);

  const response = await axios.get(`${BASE_URL}${API_URL}/history?${queryParams.toString()}`, config);
  return response.data;
};

// Get payment details
const getPaymentDetails = async (paymentId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.get(`${BASE_URL}${API_URL}/${paymentId}`, config);
  return response.data;
};

// Get payment statistics
const getPaymentStats = async (params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const queryParams = new URLSearchParams();
  if (params.period) queryParams.append('period', params.period);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);

  const response = await axios.get(`${BASE_URL}${API_URL}/stats?${queryParams.toString()}`, config);
  return response.data;
};

// Get all payments (admin only)
const getAllPayments = async (params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.status) queryParams.append('status', params.status);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.userId) queryParams.append('userId', params.userId);

  const response = await axios.get(`${BASE_URL}${API_URL}?${queryParams.toString()}`, config);
  return response.data;
};

// Export payments (admin only)
const exportPayments = async (params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
    responseType: 'blob',
  };

  const queryParams = new URLSearchParams();
  if (params.format) queryParams.append('format', params.format);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.status) queryParams.append('status', params.status);

  const response = await axios.get(`${BASE_URL}${API_URL}/export?${queryParams.toString()}`, config);
  return response.data;
};

const paymentsService = {
  // Razorpay
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayPaymentDetails,
  refundRazorpayPayment,
  getRazorpayPaymentMethods,
  createRazorpayCustomer,
  // Generic data
  getPaymentHistory,
  getPaymentDetails,
  getPaymentStats,
  getAllPayments,
  exportPayments,
};

export default paymentsService;
