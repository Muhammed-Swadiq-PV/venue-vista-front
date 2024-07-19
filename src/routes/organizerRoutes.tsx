import React from "react";
import { Routes, Route } from 'react-router-dom';
import Signin from "../pages/organizer/Org-Signin";
import Signup from "../pages/organizer/Org-Signup"
import ForgotPassword from "../pages/organizer/Org-ForgotPassword";
import OTP from "../pages/organizer/Org-Otp";
import CreateProfile from "../pages/organizer/Org-CreateProfile";

const OrganizerRoutes: React.FC = () =>{
    return(
        <Routes>
             <Route path="/signin" element={<Signin/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OTP />} />
            <Route path="/create-profile" element={<CreateProfile />} />
        </Routes>
    )
}

export default OrganizerRoutes ;