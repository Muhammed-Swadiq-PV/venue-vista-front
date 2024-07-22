import React from "react";
import { Routes, Route } from 'react-router-dom';
import Signin from "../pages/admin/Adm-Signin";

const AdminRouters: React.FC = () =>{
    return(
        <Routes>
            <Route path="/signin" element={<Signin />}/>
        </Routes>
    )
}

export default AdminRouters;