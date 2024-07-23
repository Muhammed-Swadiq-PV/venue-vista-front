import React from "react";
import { Routes, Route } from 'react-router-dom';
import Signin from "../pages/admin/Adm-Signin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import OrganizerManagement from "../pages/admin/OrganizerManagement";

const AdminRouters: React.FC = () =>{
    return(
        <Routes>
            <Route path="/signin" element={<Signin />}/>
            <Route path="/dashboard/*" element={<AdminDashboard />}/>
            <Route path="/user-management" element={<UserManagement />}/>
            <Route path="/organizer-management" element={<OrganizerManagement />}/>
        </Routes>
    )
}

export default AdminRouters;