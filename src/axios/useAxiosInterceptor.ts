// useAxiosInterceptor.ts
import { useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRedirect } from '../contexts/RedirectContext';
import axiosInstance from './axiosInterceptor';

interface ErrorResponseData {
    message?: string;
    [key: string]: any; 
  }

export const useAxiosInterceptor = () => {

  const { setRedirectPath } = useRedirect();

  useEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { status, data } = error.response;

          switch (status) {
            case 401:
              handleUnauthorized();
              break;
            case 403:
              handleForbidden(data as ErrorResponseData);
              break;
            case 500:
              toast.error('Server error. Please try again later.');
              break;
            default:
              toast.error((data as ErrorResponseData).message || 'An error occurred. Please try again.');
          }
        } else {
          toast.error('Network error. Please check your connection.');
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [setRedirectPath]);

  const handleUnauthorized = useCallback(() => {
    toast.error('Session expired. Redirecting to sign-in.');
    clearTokens();
    redirectToSignIn();
  }, []);

  const handleForbidden = useCallback((data: ErrorResponseData) => {
    if (data.message && data.message.includes('blocked')) {
      toast.error('Your account has been blocked. Redirecting to sign-in.');
      clearTokens(['userAccessToken', 'OrganizerAccessToken']);
      redirectToSignIn();
    } else {
      toast.error('Forbidden. You do not have permission to access this resource.');
    }
  }, []);

  const clearTokens = useCallback((tokens = ['adminAccessToken', 'userAccessToken', 'OrganizerAccessToken']) => {
    tokens.forEach(token => Cookies.remove(token, { path: `/${token.split('Access')[0].toLowerCase()}` }));
  }, []);

  const redirectToSignIn = useCallback(() => {
    const currentPath = window.location.pathname;
    let redirectPath = '/user/signin';
    if (currentPath.includes('/admin')) redirectPath = '/admin/signin';
    else if (currentPath.includes('/organizer')) redirectPath = '/organizer/signin';
    setRedirectPath(redirectPath);
  }, [setRedirectPath]);

  return axiosInstance;
};