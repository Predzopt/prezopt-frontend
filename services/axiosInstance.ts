import { BASE_URL } from '@/utils/CONSTANTS';
import axios from 'axios';

// In-memory access token
let accessToken: string | null = null;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // Changed to false to avoid CORS issues
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token to requests
axiosInstance.interceptors.request.use(config => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
