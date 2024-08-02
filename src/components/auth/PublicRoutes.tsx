import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const PublicRoute: React.FC = () => {

    const token = Cookies.get('userAccessToken')

    return token ? <Navigate to="/user/home" /> : <Outlet />;
};

export default PublicRoute;