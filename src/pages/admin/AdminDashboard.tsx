import React from 'react';
import Header from '../../components/admin/Header';
import Footer from '../../components/admin/Footer';
import AdminGraph from './AdminGraph'; // Direct import, no need for Suspense/ErrorBoundary

const AdminDashboard: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-4">
                {/* Info Section with Graph or Metrics */}
                <section className="mb-8 justify-center items-center text-center">
                    <h2 className="text-xl font-semibold mb-4">Booking Insights</h2>
                    <p className="text-sm text-gray-700 mb-4">
                        Monthly and yearly booking trends help track performance effectively.
                    </p>
                </section>
                
                {/* Directly render the AdminGraph on the dashboard */}
                <AdminGraph />
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
