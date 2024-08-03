//this component handling the redirection for block 
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRedirect } from '../contexts/RedirectContext';

const RedirectHandler: React.FC = () => {
  const { redirectPath } = useRedirect();
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [redirectPath, navigate]);

  return null; // This component doesn't render anything
};

export default RedirectHandler;
