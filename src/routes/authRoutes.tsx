//routes/userRoutes.tsx

import React from "react";
import { Routes, Route } from 'react-router-dom'
import Signin from "../components/auth/Signin";
import Signup from "../components/auth/Signup";
import ForgotPassword from "../components/auth/ForgotPassword";
import OTP from "../components/auth/Otp";


const AuthRoutes: React.FC = () => {
    return(
        <Routes>
            <Route path="/signin" element={<Signin/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp" element={<OTP />} />
        </Routes>
    )
}

export default AuthRoutes;