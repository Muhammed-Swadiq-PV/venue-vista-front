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
import RulesAndRestrictions from "../components/user/RulesRestrictions";
import CancellationPolicy from "../components/user/CancellationPolicy";
import HandleDates from "../pages/organizer/HandleDates";



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
                    <Route path="/rules-restrictions" element={<RulesAndRestrictions />} />
                    <Route path="/cancellation-policy" element={<CancellationPolicy />} />
                    <Route path="/handle-dates" element={<HandleDates />} />
                </Route>
            </Routes>
        </ErrorBoundary>
    )
}

export default OrganizerRoutes;