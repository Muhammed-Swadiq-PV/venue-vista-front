import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../../components/admin/Header';
import Footer from '../../components/admin/Footer';
import SideMenu from '../../components/admin/SideMenu';

const OrganizerManagement: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-grow">
                <SideMenu />
            </div>
            <Footer />
        </div>
    );
};

export default OrganizerManagement;
