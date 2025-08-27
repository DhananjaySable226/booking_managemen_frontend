import axios from 'axios';

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:5000';

const API_URL = '/api/services';

// Get all services
const getServices = async (params = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.category) queryParams.append('category', params.category);
  if (params.minPrice) queryParams.append('minPrice', params.minPrice);
  if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
  if (params.rating) queryParams.append('rating', params.rating);
  if (params.location) queryParams.append('location', params.location);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const response = await axios.get(`${BASE_URL}${API_URL}?${queryParams.toString()}`, config);
  return response.data;
};

// Get single service by ID
const getServiceById = async (id) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(`${BASE_URL}${API_URL}/${id}`, config);
  return response.data;
};

// Search services
const searchServices = async (searchParams) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const queryParams = new URLSearchParams();
  if (searchParams.query) queryParams.append('q', searchParams.query);
  if (searchParams.category) queryParams.append('category', searchParams.category);
  if (searchParams.location) queryParams.append('location', searchParams.location);
  if (searchParams.page) queryParams.append('page', searchParams.page);
  if (searchParams.limit) queryParams.append('limit', searchParams.limit);

  const response = await axios.get(`${BASE_URL}${API_URL}/search?${queryParams.toString()}`, config);
  return response.data;
};

// Get services by category
const getServicesByCategory = async (category) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(`${BASE_URL}${API_URL}/category/${category}`, config);
  return response.data;
};

// Get featured services
const getFeaturedServices = async () => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(`${BASE_URL}${API_URL}/featured`, config);
  return response.data;
};

// Create new service (requires authentication)
const createService = async (serviceData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${BASE_URL}${API_URL}`, serviceData, config);
  return response.data;
};

// Update service (requires authentication)
const updateService = async (id, serviceData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${BASE_URL}${API_URL}/${id}`, serviceData, config);
  return response.data;
};

// Delete service (requires authentication)
const deleteService = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.delete(`${BASE_URL}${API_URL}/${id}`, config);
  return response.data;
};

// Add review to service (requires authentication)
const addReview = async (serviceId, reviewData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.post(`${BASE_URL}${API_URL}/${serviceId}/reviews`, reviewData, config);
  return response.data;
};

// Upload service images (requires authentication)
const uploadImages = async (serviceId, images) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const formData = new FormData();
  images.forEach((image, index) => {
    formData.append('images', image);
  });

  const response = await axios.post(`${BASE_URL}${API_URL}/${serviceId}/images`, formData, config);
  return response.data;
};

// Delete service image (requires authentication)
const deleteImage = async (serviceId, imageId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.delete(`${BASE_URL}${API_URL}/${serviceId}/images/${imageId}`, config);
  return response.data;
};

// Update service availability (requires authentication)
const updateAvailability = async (serviceId, availabilityData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.put(`${BASE_URL}${API_URL}/${serviceId}/availability`, availabilityData, config);
  return response.data;
};

// Get provider services (requires authentication)
const getProviderServices = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
    },
  };

  const response = await axios.get(`${BASE_URL}${API_URL}/provider/my-services`, config);
  return response.data;
};

// Check service availability
const checkAvailability = async (serviceId, date, time) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(`${BASE_URL}${API_URL}/${serviceId}/availability`, {
    params: { date, time },
    ...config,
  });
  return response.data;
};

const servicesService = {
  getServices,
  getServiceById,
  searchServices,
  getServicesByCategory,
  getFeaturedServices,
  createService,
  updateService,
  deleteService,
  addReview,
  uploadImages,
  deleteImage,
  updateAvailability,
  getProviderServices,
  checkAvailability,
};

export default servicesService;
