import axios from 'axios';

// Clean and normalize API Base URL
let rawUrl = (import.meta.env.VITE_API_URL || '/api').trim();
rawUrl = rawUrl.replace(/\/+$/, '');
if (!rawUrl.endsWith('/api') && !rawUrl.startsWith('/api')) {
  rawUrl = `${rawUrl}/api`;
}

const API_BASE_URL = rawUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token and fix relative URL joining
api.interceptors.request.use(
  (config) => {
    // Ensure relative endpoint URLs don't strip /api prefix from baseURL
    if (config.url && config.url.startsWith('/') && config.baseURL && config.baseURL.length > 1) {
      config.url = config.url.substring(1);
    }
    if (config.baseURL && !config.baseURL.endsWith('/')) {
      config.baseURL = `${config.baseURL}/`;
    }

    const token = localStorage.getItem('ecomind_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on unauthorized response
      localStorage.removeItem('ecomind_token');
      localStorage.removeItem('ecomind_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
