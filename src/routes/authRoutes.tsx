//routes/userRoutes.tsx

import React from "react";
import { Routes, Route } from 'react-router-dom';
import Signin from "../pages/user/Signin";
import Signup from "../pages/user/Signup";
import ForgotPassword from "../components/auth/ForgotPassword";
import OTP from "../pages/user/Otp";
import UHome from "../pages/user/U-Home";
import PrivateRoute from "../components/auth/PrivateRoute";
import PublicRoute from "../components/auth/PublicRoutes";
import EventHallDetails from "../pages/user/EventHallDetails";
import CreateProfile from "../pages/user/CreateProfile";
import { OrganizerProvider } from "../hooks/useNearestOrganizer";


const AuthRoutes: React.FC = () => {
    return (
        <OrganizerProvider>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-otp" element={<OTP />} />
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route path="/home" element={<UHome />} />
                    <Route path="/event-hall/:id" element={<EventHallDetails />} />
                    <Route path="/create-profile" element={<CreateProfile />} />
                </Route>
            </Routes>
        </OrganizerProvider>
    )
}

export default AuthRoutes;