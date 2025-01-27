//routes/userRoutes.tsx

import React from "react";
import { Routes, Route } from 'react-router-dom';
import Signin from "../pages/user/Signin";
import Signup from "../pages/user/Signup";
import ForgotPassword from "../components/user/ForgotPassword";
import OTP from "../pages/user/Otp";
import UHome from "../pages/user/U-Home";
import PrivateRoute from "../components/user/PrivateRoute";
import PublicRoute from "../components/user/PublicRoutes";
import EventHallDetails from "../pages/user/EventHallDetails";
import CreateProfile from "../pages/user/CreateProfile";
import { OrganizerProvider } from "../contexts/useNearestOrganizer";
import { SearchProvider } from "../contexts/SearchContext";
import BookingCalendar from "../pages/user/DateTimeSelect";
import BookingDetails from "../pages/user/BookingDetails";
import MyBookings from "../pages/user/MyBookings";


const AuthRoutes: React.FC = () => {
    return (
        <OrganizerProvider>
            <SearchProvider>
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
                        <Route path="/book-event-hall/date-time/:id" element={<BookingCalendar/>}/>
                        <Route path="/booking-details/:organizerId/:id" element={<BookingDetails/>}/>
                        <Route path="/my-bookings" element={<MyBookings/>}/>
                    </Route>
                </Routes>
            </SearchProvider>
        </OrganizerProvider>
    )
}

export default AuthRoutes;