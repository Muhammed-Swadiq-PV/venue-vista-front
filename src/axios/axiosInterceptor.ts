import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../apiConfig';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the token
axiosInstance.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken'); 
    const userToken  = localStorage.getItem('userToken');
    const organizerToken = localStorage.getItem('token');

    let token = '';
    if (adminToken) {
      token = adminToken;
    }else if (userToken) {
      token = userToken;
    } else if (organizerToken) {
      token = organizerToken;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          toast.error('Unauthorized. Please log in again.');
          // Optionally redirect to login page
          break;
        case 403:
          toast.error('Forbidden. You do not have permission to access this resource.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(error.response.data.message || 'An error occurred. Please try again.');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
