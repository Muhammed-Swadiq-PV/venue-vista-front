import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useHandleSignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try { 
      localStorage.removeItem('token');
      navigate('/');
      toast.success('Successfully signed out.');
    } catch (error) {
      console.error('Error during signout:', error);
      toast.error('Signout failed. Please try again.');
    }
  };

  return handleSignOut;
};
