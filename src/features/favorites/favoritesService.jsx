import axios from 'axios';

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : 'http://localhost:5000';

const API_URL = '/api/users/me/favorites';

const authHeader = () => ({
    Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
});

const getFavorites = async () => {
    const response = await axios.get(`${BASE_URL}${API_URL}`, { headers: authHeader() });
    return response.data;
};

const addFavorite = async (serviceId) => {
    const response = await axios.post(`${BASE_URL}${API_URL}/${serviceId}`, {}, { headers: authHeader() });
    return response.data;
};

const removeFavorite = async (serviceId) => {
    const response = await axios.delete(`${BASE_URL}${API_URL}/${serviceId}`, { headers: authHeader() });
    return response.data;
};

export default { getFavorites, addFavorite, removeFavorite };


