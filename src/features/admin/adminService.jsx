import axios from 'axios';

// Use relative API path so Vite proxy routes to the correct backend
const API_URL = `/api/admin`;

// Get dashboard statistics
const getDashboardStats = async (params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const queryParams = new URLSearchParams();
  if (params.period) queryParams.append('period', params.period);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);

  const url = queryParams.toString() ? `${API_URL}/dashboard?${queryParams.toString()}` : `${API_URL}/dashboard`;
  const response = await axios.get(url, config);
  return response.data;
};

// Get revenue analytics
const getRevenueAnalytics = async (params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const queryParams = new URLSearchParams();
  if (params.period) queryParams.append('period', params.period);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.groupBy) queryParams.append('groupBy', params.groupBy);

  const response = await axios.get(`${API_URL}/analytics/revenue?${queryParams.toString()}`, config);
  return response.data;
};

// Get booking analytics
const getBookingAnalytics = async (params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const queryParams = new URLSearchParams();
  if (params.period) queryParams.append('period', params.period);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.groupBy) queryParams.append('groupBy', params.groupBy);

  const response = await axios.get(`${API_URL}/analytics/bookings?${queryParams.toString()}`, config);
  return response.data;
};

// Get user analytics
const getUserAnalytics = async (params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const queryParams = new URLSearchParams();
  if (params.period) queryParams.append('period', params.period);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);

  const response = await axios.get(`${API_URL}/analytics/users?${queryParams.toString()}`, config);
  return response.data;
};

// Get service analytics
const getServiceAnalytics = async (params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const queryParams = new URLSearchParams();
  if (params.period) queryParams.append('period', params.period);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.limit) queryParams.append('limit', params.limit);

  const response = await axios.get(`${API_URL}/analytics/services?${queryParams.toString()}`, config);
  return response.data;
};

// Get system health
const getSystemHealth = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.get(`${API_URL}/system/health`, config);
  return response.data;
};

// Send bulk notifications
const sendBulkNotifications = async (notificationData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${API_URL}/notifications/bulk`, notificationData, config);
  return response.data;
};

// Export data
const exportData = async (exportParams) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
    responseType: 'blob',
  };

  const queryParams = new URLSearchParams();
  if (exportParams.type) queryParams.append('type', exportParams.type);
  if (exportParams.startDate) queryParams.append('startDate', exportParams.startDate);
  if (exportParams.endDate) queryParams.append('endDate', exportParams.endDate);
  if (exportParams.format) queryParams.append('format', exportParams.format);

  const response = await axios.get(`${API_URL}/export?${queryParams.toString()}`, config);
  return response.data;
};

// Update system settings
const updateSystemSettings = async (settings) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/settings`, settings, config);
  return response.data;
};

// Get admin notifications
const getNotifications = async (params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.read) queryParams.append('read', params.read);

  const response = await axios.get(`${API_URL}/notifications?${queryParams.toString()}`, config);
  return response.data;
};

// Mark notification as read
const markNotificationRead = async (notificationId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, config);
  return response.data;
};

// Get user management data
const getUsers = async (params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.role) queryParams.append('role', params.role);
  if (params.status) queryParams.append('status', params.status);
  if (params.search) queryParams.append('search', params.search);

  const response = await axios.get(`${API_URL}/users?${queryParams.toString()}`, config);
  return response.data;
};

// Update user role
const updateUserRole = async (userId, role) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/users/${userId}/role`, { role }, config);
  return response.data;
};

// Deactivate user
const deactivateUser = async (userId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/users/${userId}/deactivate`, {}, config);
  return response.data;
};

// Activate user
const activateUser = async (userId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/users/${userId}/activate`, {}, config);
  return response.data;
};

// Get booking management data
const getBookings = async (params = {}) => {
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
  if (params.search) queryParams.append('search', params.search);

  const response = await axios.get(`${API_URL}/bookings?${queryParams.toString()}`, config);
  return response.data;
};

// Update booking status
const updateBookingStatus = async (bookingId, status) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/bookings/${bookingId}/status`, { status }, config);
  return response.data;
};

// Get service management data
const getServices = async (params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.category) queryParams.append('category', params.category);
  if (params.status) queryParams.append('status', params.status);
  if (params.search) queryParams.append('search', params.search);

  const response = await axios.get(`${API_URL}/services?${queryParams.toString()}`, config);
  return response.data;
};

// Approve service
const approveService = async (serviceId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/services/${serviceId}/approve`, {}, config);
  return response.data;
};

// Reject service
const rejectService = async (serviceId, reason) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/services/${serviceId}/reject`, { reason }, config);
  return response.data;
};

// Get payment management data
const getPayments = async (params = {}) => {
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

  const response = await axios.get(`${API_URL}/payments?${queryParams.toString()}`, config);
  return response.data;
};

// Refund payment
const refundPayment = async (paymentId, amount, reason) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${API_URL}/payments/${paymentId}/refund`, { amount, reason }, config);
  return response.data;
};

const adminService = {
  getDashboardStats,
  getRevenueAnalytics,
  getBookingAnalytics,
  getUserAnalytics,
  getServiceAnalytics,
  getSystemHealth,
  sendBulkNotifications,
  exportData,
  updateSystemSettings,
  getNotifications,
  markNotificationRead,
  getUsers,
  updateUserRole,
  deactivateUser,
  activateUser,
  getBookings,
  updateBookingStatus,
  getServices,
  approveService,
  rejectService,
  getPayments,
  refundPayment,
};

export default adminService;
