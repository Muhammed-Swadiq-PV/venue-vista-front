import React from "react";
import { Routes, Route } from 'react-router-dom';
import Signin from "../pages/organizer/Org-Signin";
import Signup from "../pages/organizer/Org-Signup"
import ForgotPassword from "../pages/organizer/Org-ForgotPassword";
import OTP from "../pages/organizer/Org-Otp";
import CreateProfile from "../pages/organizer/Org-CreateProfile";
import PrivateRoute from "../components/organizer/PrivateRoute";
import Home from "../pages/organizer/Home";
import PublicRouteOrg from "../components/organizer/PublicRoutes";
import OrgPostForm from "../pages/organizer/Org-Post";
import ErrorBoundary from "../components/ErrorBoundary";
import ViewPost from "../pages/organizer/View-Post";
import ViewProfile from "../pages/organizer/ViewProfile";



const OrganizerRoutes: React.FC = () => {
    return (
        <ErrorBoundary>
            <Routes>
                <Route element={<PublicRouteOrg />}>
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-otp" element={<OTP />} />
                </Route>
                <Route element={< PrivateRoute />}>
                    <Route path="/create-profile" element={<CreateProfile />} />
                    <Route path="/home" element={<Home />} />
                    <Route path='/post' element={< OrgPostForm />} />
                    <Route path="/view-post" element={<ViewPost />} />
                    <Route path="/view-profile" element={<ViewProfile />} />
                </Route>
            </Routes>
        </ErrorBoundary>
    )
}

export default OrganizerRoutes;