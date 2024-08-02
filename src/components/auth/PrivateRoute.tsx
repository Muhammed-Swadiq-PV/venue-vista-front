import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute: React.FC = () => {
  // const token = localStorage.getItem('userAccessToken');
  const token = Cookies.get('userAccessToken');

  return token ? <Outlet /> : <Navigate to="/user/signin" />;
};

export default PrivateRoute;