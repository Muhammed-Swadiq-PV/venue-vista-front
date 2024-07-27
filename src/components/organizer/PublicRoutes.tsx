import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRouteOrg: React.FC = () => {
    const token = localStorage.getItem('token');

    return token ? <Navigate to="/organizer/home" /> : <Outlet />;
};

export default PublicRouteOrg;