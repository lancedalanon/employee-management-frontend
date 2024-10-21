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
        const userData = CookieUtils.getCookie('userData');

        // Token is missing, handle logout
        if (!userData) {
            handleLogout();
            return Promise.reject(new Error('No token, user is logged out.'));
        }

        // Parse userData to get the token
        let parsedUserData: { token?: string; };
        try {
            parsedUserData = JSON.parse(userData);
        } catch {
            handleLogout();
            return Promise.reject(new Error('Failed to parse user data.'));
        }

        // Check if token is available
        if (!parsedUserData.token) {
            handleLogout();
            return Promise.reject(new Error('No token found in user data.'));
        }

        // Set the Authorization header
        config.headers['Authorization'] = `Bearer ${parsedUserData.token}`;
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
    CookieUtils.deleteCookie('userData', { path: '/' });

    // Redirect to the login page
    redirect('/login');
};

// Export the configured Axios instance
export default axiosInstance;
