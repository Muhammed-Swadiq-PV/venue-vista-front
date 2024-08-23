
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export const useHandleSignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try { 
      Cookies.remove('userAccessToken', {path: '/user'});
      Cookies.remove('userRefreshToken', {path: '/user'});
      Cookies.remove('userId', {path: '/user'});
      navigate('/');
      toast.success('Successfully signed out.');
    } catch (error) {
      console.error('Error during signout:', error);
      toast.error('Signout failed. Please try again.');
    }
  };

  return handleSignOut;
};
