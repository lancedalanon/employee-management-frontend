import axios from 'axios';
import store from '@/store/store'; 
import { performLogout } from '@/store/slices/authSlice';

// Create an Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LARAVEL_URL,
  timeout: 10000,
  withCredentials: true, // Ensure cookies are sent with requests
});

// Add a request interceptor to attach the token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState(); // Access global Redux state
    const token = state.auth.token; // Retrieve token from auth state

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Include Bearer token
    }

    config.headers['Accept'] = 'application/json';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle responses
axiosInstance.interceptors.response.use(
  (response) => {
    return response; 
  },
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      store.dispatch(performLogout());
      window.location.href = '/login'; // Redirect to login on unauthorized access
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
