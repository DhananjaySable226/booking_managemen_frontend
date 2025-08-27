import axios from 'axios';

const API_URL = '/api/bookings';

// Create new booking
const createBooking = async (bookingData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(API_URL, bookingData, config);
  return response.data;
};

// Get user bookings
const getUserBookings = async (params = {}) => {
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

  const response = await axios.get(`${API_URL}/my-bookings?${queryParams.toString()}`, config);
  return response.data;
};

// Get single booking by ID
const getBookingById = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
};

// Update booking
const updateBooking = async (id, bookingData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${id}`, bookingData, config);
  return response.data;
};

// Cancel booking
const cancelBooking = async (id, reason) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${id}/cancel`, { reason }, config);
  return response.data;
};

// Rate booking
const rateBooking = async (id, ratingData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${API_URL}/${id}/rate`, ratingData, config);
  return response.data;
};

// Get provider bookings (for service providers)
const getProviderBookings = async (params = {}) => {
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

  const response = await axios.get(`${API_URL}/provider?${queryParams.toString()}`, config);
  return response.data;
};

// Get all bookings (for admins)
const getAllBookings = async (params = {}) => {
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
  if (params.serviceId) queryParams.append('serviceId', params.serviceId);

  const response = await axios.get(`${API_URL}?${queryParams.toString()}`, config);
  return response.data;
};

// Check availability
const checkAvailability = async (serviceId, date, time) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(`${API_URL}/availability`, {
    params: { serviceId, date, time },
    ...config,
  });
  return response.data;
};

// Add booking note (for providers/admins)
const addNote = async (id, note) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${API_URL}/${id}/notes`, { note }, config);
  return response.data;
};

// Get booking notes
const getBookingNotes = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.get(`${API_URL}/${id}/notes`, config);
  return response.data;
};

// Update booking status (for providers/admins)
const updateBookingStatus = async (id, status) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${id}/status`, { status }, config);
  return response.data;
};

// Get booking statistics
const getBookingStats = async (params = {}) => {
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

// Export bookings
const exportBookings = async (params = {}) => {
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

const bookingsService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  rateBooking,
  getProviderBookings,
  getAllBookings,
  checkAvailability,
  addNote,
  getBookingNotes,
  updateBookingStatus,
  getBookingStats,
  exportBookings,
};

export default bookingsService;
