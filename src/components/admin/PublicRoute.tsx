import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute: React.FC = () => {
    const token = localStorage.getItem('token');

    return token ? <Navigate to="/admin/dashboard" /> : <Outlet />;
};

export default PublicRoute;