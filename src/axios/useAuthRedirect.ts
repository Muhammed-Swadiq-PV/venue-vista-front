import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = Cookies.get('adminAccessToken');
    const userToken = Cookies.get('userAccessToken');
    const organizerToken = Cookies.get('OrganizerAccessToken');

    if(adminToken){
      if(window.location.pathname.startsWith('/admin')){
        return;
      }
      navigate('/admin/dashboard', {replace:true});
    } else if(organizerToken){
     if ( window.location.pathname.startsWith('/organizer')){
      return;
     }
     navigate('/organizer/home', {replace: true});
    } else if(userToken){
      if(window.location.pathname.startsWith('/user')){
        return;
      }
      navigate('/user/home', {replace: true});
    } else {
      
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

