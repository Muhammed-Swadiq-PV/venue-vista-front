import React from "react";
import { Routes, Route } from 'react-router-dom';
import Signin from "../components/organizer/Org-Signin";
import Signup from "../components/organizer/Org-Signup";
import ForgotPassword from "../components/organizer/Org-ForgotPassword";
import OTP from "../components/organizer/Org-Otp";

const OrganizerRoutes: React.FC = () =>{
    return(
        <Routes>
             <Route path="/signin" element={<Signin/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp" element={<OTP />} />
        </Routes>
    )
}

export default OrganizerRoutes ;