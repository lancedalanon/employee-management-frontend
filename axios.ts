import axios, { InternalAxiosRequestConfig } from 'axios'; 
import CookieUtils from '@/app/utils/useCookies';
import { redirect } from 'next/navigation';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL,
    withCredentials: true,
});

// Interceptor to check for token before each request
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = CookieUtils.getCookie('token');

        // Token is missing, handle logout
        if (!token) {
            handleLogout();
            return Promise.reject(new Error('No token, user is logged out.'));
        }

        config.headers['Authorization'] = `Bearer ${token}`;
        config.headers['Accept'] = 'application/json';

        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Logout function
const handleLogout = () => {
    // Remove token cookie
    CookieUtils.deleteCookie('token', { path: '/' });

    // Redirect to the login page
    redirect('/login');
};

// Export the configured Axios instance
export default axiosInstance;
