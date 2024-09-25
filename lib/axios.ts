import axios from 'axios';
import Cookies from 'js-cookie';

// Create an Axios instance with default settings
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_LARAVEL_URL, 
    timeout: 10000, 
});

// Add a request interceptor to attach the token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; 
        }
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
        // Handle errors based on the response
        const { response } = error;
        if (response && response.status === 401) {
            // Handle unauthorized access
            dispatch(performLogout());
            Cookies.remove('token'); 
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;