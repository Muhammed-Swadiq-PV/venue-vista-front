import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const PublicRouteAdm: React.FC = () => {
    const token = Cookies.get('adminAccessToken');

    return token ? <Navigate to="/admin/dashboard" /> : <Outlet />;
};

export default PublicRouteAdm;