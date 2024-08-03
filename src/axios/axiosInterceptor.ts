// axiosInterceptor.ts
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const adminToken = Cookies.get('adminAccessToken');
    const userToken = Cookies.get('userAccessToken');
    const organizerToken = Cookies.get('OrganizerAccessToken');

    let token = adminToken || userToken || organizerToken;

    let role = 'user';

    if (adminToken) {
      role = 'admin';
    } else if (organizerToken) {
      role = 'organizer';
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['X-Role'] = role;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;