import axios from 'axios';
//import.meta.env.VITE_API_BASE_URL
const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://meee-4gerxcsv.b4a.run/api';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // This is important for cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on login/register pages
      // and if the error is not from the auth check endpoint
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register' || currentPath === '/admin-login';
      const isAuthCheck = error.config?.url?.includes('/check');
      
      if (!isAuthPage && !isAuthCheck) {
        // Clear any stored auth state
        localStorage.removeItem('authState');
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 