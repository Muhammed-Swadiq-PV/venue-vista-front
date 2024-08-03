// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
// import About from '../pages/About';
import AuthRoutes from '../routes/authRoutes';
import OrganizerRoutes from '../routes/organizerRoutes';
import AdminRoutes from '../routes/adminRoutes';
import { SignOutProvider } from '../contexts/AdminSignOut';
import Modal from 'react-modal';


Modal.setAppElement('#root');

const App: React.FC = () => {
    return (
        < div className='bg-red-50'>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/user/*" element={<AuthRoutes />} />
                    <Route path="/organizer/*" element={<OrganizerRoutes />} />
                    <Route path="/admin/*" element={
                        <SignOutProvider>
                            <AdminRoutes />
                        </SignOutProvider>
                    } />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
