import axios from 'axios';

const API_URL = '/api/services';

// Get all services
const getServices = async (filters = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(API_URL, { params: filters }, config);
  return response.data;
};

// Get single service
const getService = async (id) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
};

// Create service
const createService = async (serviceData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(API_URL, serviceData, config);
  return response.data;
};

// Update service
const updateService = async (id, serviceData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${id}`, serviceData, config);
  return response.data;
};

// Delete service
const deleteService = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

// Search services
const searchServices = async (searchParams) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(`${API_URL}/search`, { params: searchParams }, config);
  return response.data;
};

// Get services by category
const getServicesByCategory = async (category) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(`${API_URL}/category/${category}`, config);
  return response.data;
};

// Get featured services
const getFeaturedServices = async () => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(`${API_URL}/featured`, config);
  return response.data;
};

// Add service review
const addServiceReview = async (serviceId, reviewData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${API_URL}/${serviceId}/reviews`, reviewData, config);
  return response.data;
};

// Get provider services
const getProviderServices = async (providerId) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(`${API_URL}/provider/${providerId}`, config);
  return response.data;
};

// Get current user's services (for service providers)
const getMyServices = async () => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.get(`${API_URL}/provider/my-services`, config);
  return response.data;
};

const serviceService = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  searchServices,
  getServicesByCategory,
  getFeaturedServices,
  addServiceReview,
  getProviderServices,
  getMyServices,
};

export default serviceService;
