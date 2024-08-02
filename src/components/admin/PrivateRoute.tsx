import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute: React.FC = () => {
 
  const token = Cookies.get('adminAccessToken');

  return token ? <Outlet /> : <Navigate to="/admin/signin" />;
};

export default PrivateRoute;