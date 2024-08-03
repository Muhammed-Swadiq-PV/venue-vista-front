import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = Cookies.get('adminAccessToken');
    const userToken = Cookies.get('userAccessToken');
    const organizerToken = Cookies.get('OrganizerAccessToken');

    if (!adminToken && !userToken && !organizerToken) {
      // Redirect to the appropriate sign-in page based on the current path
      const currentPath = window.location.pathname;
      const redirectPath = currentPath.includes('/admin')
        ? '/admin/signin'
        : currentPath.includes('/organizer')
        ? '/organizer/signin'
        : '/user/signin';

      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);
};

export default useAuthRedirect;
