//routes/userRoutes.tsx

import React from "react";
import { Routes, Route } from 'react-router-dom';
import Signin from "../pages/user/Signin";
import Signup from "../pages/user/Signup";
import ForgotPassword from "../components/auth/ForgotPassword";
import OTP from "../pages/user/Otp";


const AuthRoutes: React.FC = () => {
    return(
        <Routes>
            <Route path="/signin" element={<Signin/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OTP />} />
        </Routes>
    )
}

export default AuthRoutes;