import React from 'react';
import axiosInstance from '../../axios/axiosInterceptor';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useHandleSignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await axiosInstance.get('/users/signout'); 
      localStorage.removeItem('userToken');
      navigate('/');
      toast.success('Successfully signed out.');
    } catch (error) {
      console.error('Error during signout:', error);
      toast.error('Signout failed. Please try again.');
    }
  };

  return handleSignOut;
};
