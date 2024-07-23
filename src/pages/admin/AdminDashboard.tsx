import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../../components/admin/Header';
import Footer from '../../components/admin/Footer';
import SideMenu from '../../components/admin/SideMenu';
import ErrorBoundary from '../../components/ErrorBoundary';

const UserManagement = lazy(() => import('./UserManagement'));
const OrganizerManagement = lazy(() => import('./OrganizerManagement'));

const AdminDashboard: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-grow">
                <SideMenu />
                <main className="flex-grow p-4">
                    <Suspense fallback={<div>Loading...</div>}>
                        <ErrorBoundary>
                            <Routes>
                                <Route path="/admin/user-management" element={<UserManagement />} />
                                <Route path="/admin/organizer-management" element={<OrganizerManagement />} />
                            </Routes>
                        </ErrorBoundary>
                    </Suspense>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
