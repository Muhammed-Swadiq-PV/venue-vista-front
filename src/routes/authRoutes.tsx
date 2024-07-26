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


const AuthRoutes: React.FC = () => {
    return(
        <Routes>
            <Route element={<PublicRoute/>}>
            <Route path="/signin" element={<Signin/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OTP />} />
            </Route>
            <Route element={<PrivateRoute/>}>
            <Route path="/home" element={<UHome />} />
            </Route>
        </Routes>
    )
}

export default AuthRoutes;