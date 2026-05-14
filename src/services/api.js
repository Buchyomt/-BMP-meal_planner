import axios from 'axios';

// Ensure we use the live backend when hosted on Vercel, regardless of env vars
const isLive = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
const API_URL = isLive ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');


const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bmp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (e.g., redirect to login or clear storage)
      localStorage.removeItem('bmp_token');
      localStorage.removeItem('bmp_user');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
