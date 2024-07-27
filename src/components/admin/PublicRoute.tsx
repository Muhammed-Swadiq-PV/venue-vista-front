import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRouteAdm: React.FC = () => {
    const token = localStorage.getItem('adminToken');

    return token ? <Navigate to="/admin/dashboard" /> : <Outlet />;
};

export default PublicRouteAdm;