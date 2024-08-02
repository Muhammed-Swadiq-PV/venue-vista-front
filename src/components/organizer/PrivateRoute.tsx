import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute: React.FC = () => {
  // const token = localStorage.getItem('token');
  const token = Cookies.get('OrganizerAccessToken');

  return token ? <Outlet /> : <Navigate to="/organizer/signin" />;
};

export default PrivateRoute;