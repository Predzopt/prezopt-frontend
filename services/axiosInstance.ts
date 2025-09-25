import { BASE_URL } from '@/utils/CONSTANTS';
import axios from 'axios';

// In-memory access token
export let accessToken: null | string = null;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// // Attach access token to requests
// axiosInstance.interceptors.request.use(config => {
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });
