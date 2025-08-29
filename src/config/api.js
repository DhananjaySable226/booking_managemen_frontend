// Centralized API base URL resolution
// - Uses Vite env when provided
// - Falls back to Render backend URL in production builds
// - Defaults to localhost in development

const envBaseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : undefined;

const isProduction = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD;

// Hard default for production to ensure Netlify deployments work even if env var is missing
const productionFallback = 'https://booking-management-backend.onrender.com';
const developmentFallback = 'http://localhost:5000';

export const BASE_URL = envBaseUrl || (isProduction ? productionFallback : developmentFallback);

export const withBaseUrl = (path) => `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;



