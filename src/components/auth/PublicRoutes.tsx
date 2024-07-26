import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute: React.FC = () => {
    const token = localStorage.getItem('userToken');

    return token ? <Navigate to="/user/home" /> : <Outlet />;
};

export default PublicRoute;