import axios from 'axios';
import { BASE_URL } from '../../config/api.js';

const API_URL = '/api/auth';
// Admin create service provider
const registerServiceProvider = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${BASE_URL}${API_URL}/register/service-provider`, userData, config);
  return response.data;
};

// Register user
const register = async (userData) => {
  const response = await axios.post(`${BASE_URL}${API_URL}/register`, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${BASE_URL}${API_URL}/login`, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get current user
const getMe = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${BASE_URL}${API_URL}/me`, config);
  return response.data;
};

// Update profile
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${BASE_URL}${API_URL}/profile`, userData, config);
  if (response.data) {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...currentUser, ...response.data.data.user };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return response.data;
};

// Update password
const updatePassword = async (passwordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${BASE_URL}${API_URL}/password`, passwordData, config);
  return response.data;
};

// Forgot password
const forgotPassword = async (email) => {
  const response = await axios.post(`${BASE_URL}${API_URL}/forgot-password`, { email });
  return response.data;
};

// Reset password
const resetPassword = async (resetData) => {
  const response = await axios.post(`${BASE_URL}${API_URL}/reset-password`, resetData);
  return response.data;
};

// Resend verification email
const resendVerification = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${BASE_URL}${API_URL}/resend-verification`, {}, config);
  return response.data;
};

const authService = {
  register,
  registerServiceProvider,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  resendVerification,
};

export default authService;
