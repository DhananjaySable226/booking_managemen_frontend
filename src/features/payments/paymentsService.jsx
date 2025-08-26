import axios from 'axios';

const API_URL = '/api/payments';

// Create payment intent
const createPaymentIntent = async (paymentData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${API_URL}/create-intent`, paymentData, config);
  return response.data;
};

// Confirm payment
const confirmPayment = async (paymentIntentId, paymentMethodId) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${API_URL}/confirm`, {
    paymentIntentId,
    paymentMethodId,
  }, config);
  return response.data;
};

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

  const response = await axios.get(`${API_URL}/history?${queryParams.toString()}`, config);
  return response.data;
};

// Get payment details
const getPaymentDetails = async (paymentId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.get(`${API_URL}/${paymentId}`, config);
  return response.data;
};

// Refund payment (admin only)
const refundPayment = async (paymentId, refundData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${API_URL}/${paymentId}/refund`, refundData, config);
  return response.data;
};

// Create Stripe customer
const createStripeCustomer = async (customerData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${API_URL}/customer`, customerData, config);
  return response.data;
};

// Update payment method
const updatePaymentMethod = async (paymentMethodId, paymentMethodData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/payment-method/${paymentMethodId}`, paymentMethodData, config);
  return response.data;
};

// Get saved payment methods
const getPaymentMethods = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.get(`${API_URL}/payment-methods`, config);
  return response.data;
};

// Add payment method
const addPaymentMethod = async (paymentMethodData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${API_URL}/payment-methods`, paymentMethodData, config);
  return response.data;
};

// Delete payment method
const deletePaymentMethod = async (paymentMethodId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/payment-methods/${paymentMethodId}`, config);
  return response.data;
};

// Set default payment method
const setDefaultPaymentMethod = async (paymentMethodId) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/payment-methods/${paymentMethodId}/default`, {}, config);
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

  const response = await axios.get(`${API_URL}/stats?${queryParams.toString()}`, config);
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

  const response = await axios.get(`${API_URL}?${queryParams.toString()}`, config);
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

  const response = await axios.get(`${API_URL}/export?${queryParams.toString()}`, config);
  return response.data;
};

// Verify payment webhook
const verifyWebhook = async (webhookData, signature) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Stripe-Signature': signature,
    },
  };

  const response = await axios.post(`${API_URL}/webhook`, webhookData, config);
  return response.data;
};

const paymentsService = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  getPaymentDetails,
  refundPayment,
  createStripeCustomer,
  updatePaymentMethod,
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  getPaymentStats,
  getAllPayments,
  exportPayments,
  verifyWebhook,
};

export default paymentsService;
