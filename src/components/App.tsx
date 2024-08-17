// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
// import About from '../pages/About';
import AuthRoutes from '../routes/authRoutes';
import OrganizerRoutes from '../routes/organizerRoutes';
import AdminRoutes from '../routes/adminRoutes';
import { SignOutProvider } from '../contexts/AdminSignOut';
import { UserSignOutProvider } from '../contexts/UserSignOut';
import { RedirectProvider } from '../contexts/RedirectContext';
import RedirectHandler from './RedirectHandler';
import Modal from 'react-modal';
import { OrganizerSignOutProvider } from '../contexts/OrganizerSignOut';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


Modal.setAppElement('#root');

const App: React.FC = () => {
    return (
        < div className='bg-red-50'>
            <Router>
                <RedirectProvider>
                    <RedirectHandler />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/user/*" element={
                            <UserSignOutProvider>
                                <AuthRoutes />
                            </UserSignOutProvider>
                        } />
                        <Route path="/organizer/*" element={
                            <OrganizerSignOutProvider>
                                <OrganizerRoutes />
                            </OrganizerSignOutProvider>
                        } />
                        <Route path="/admin/*" element={
                            <SignOutProvider>
                                <AdminRoutes />
                            </SignOutProvider>
                        } />
                    </Routes>
                </RedirectProvider>
            </Router>
            <ToastContainer />
        </div>
    );
};

export default App;
