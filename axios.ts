import axios from 'axios';

// Utility function to extract a cookie value by its name
const getCookie = (name) => {
  const cookies = `; ${document.cookie}`;
  const cookieParts = cookies.split(`; ${name}=`);
  if (cookieParts.length === 2) {
    return cookieParts.pop().split(';').shift();
  }
  return null;
};

// Utility function to remove the token and log out the user
const logoutUser = () => {
  // Remove token from cookies by setting it to expire
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Redirect to login page (or other appropriate action)
  window.location.href = '/login'; // Modify as needed for your app's routing
};

// Function to add Authorization header if token is available
const attachAuthToken = (config) => {
  const token = getCookie('token'); // Get token from cookies
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Attach token to header
  }
  return config;
};

// Handle request errors (optional but useful for debugging)
const handleRequestError = (error) => Promise.reject(error);

// Handle token expiration (401) and log the user out
const handleResponseError = (error) => {
  if (error.response && error.response.status === 401) {
    logoutUser(); // If token is invalid or expired, log the user out
  }
  return Promise.reject(error); // Propagate other errors
};

// Create an axios instance with a base URL
const apiClient = axios.create({
  baseURL: process.env.LARAVEL_PUBLIC_LINK || 'https://employee-management-backend-3asm.onrender.com',
});

// Intercept requests to attach token if available
apiClient.interceptors.request.use(attachAuthToken, handleRequestError);

// Intercept responses to handle authentication errors (like expired tokens)
apiClient.interceptors.response.use((response) => response, handleResponseError);

export default apiClient;
