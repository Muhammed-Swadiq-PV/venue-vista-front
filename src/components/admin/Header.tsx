import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInterceptor';

const Header: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<number>(0);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axiosInstance.get('/admin/pending-requests'); 
        setPendingRequests(response.data.pendingRequests);
      } catch (error) {
        console.error('Failed to fetch pending requests', error);
      }
    };

    fetchPendingRequests();
  }, []);

  return (
    <div className='px-2 pt'>
      <header className="flex justify-between items-center p-3 shadow-xl bg-white rounded-md">
        <div className="flex items-center">
          <a href="/" className="font-architects-daughter text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600">
            Venue-Vista
          </a>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/admin/user-management">User Management</Link>
          <Link to="/admin/organizer-management">Organizer Management</Link>
          <Link to="/admin/notifications">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
              </svg>
              {pendingRequests > 0 && (
                <span className="absolute top-0 right-0 inline-block w-2.5 h-2.5 bg-red-600 rounded-full"></span>
              )}
            </div>
          </Link>
        </nav>
        <div>
          <a
            href="/"
            className="text-white bg-gradient-to-r from-slate-300 to-slate-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-slate-300 dark:focus:ring-slate-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-colors ease-in-out duration-150"
          >
            Signout
          </a>
        </div>
      </header>
    </div>
  );
};

export default Header;
