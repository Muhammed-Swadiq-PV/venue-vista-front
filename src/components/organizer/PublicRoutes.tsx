import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const PublicRouteOrg: React.FC = () => {
    const token = Cookies.get('OrganizerAccessToken');

    return token ? <Navigate to="/organizer/home" /> : <Outlet />;
};

export default PublicRouteOrg;