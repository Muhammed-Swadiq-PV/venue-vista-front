// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
// import About from '../pages/About';
import AuthRoutes from '../routes/authRoutes' ;
// import OrganizerRoutes from '../routes/organizerRoutes';
// import AdminRoutes from '../routes/adminRoutes';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/about" element={<About />} /> */}
                <Route path="/auth/*" element={<AuthRoutes />} />
                {/* <Route path="/organizer/*" element={<OrganizerRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} /> */}
            </Routes>
        </Router>
    );
};

export default App;
