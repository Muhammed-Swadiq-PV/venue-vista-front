// Header.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaUsers, FaBell, FaSignOutAlt } from 'react-icons/fa';
import axiosInstance from '../../axios/axiosInterceptor';
import { useSignOut } from '../../contexts/AdminSignOut';

const Header: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const signOut = useSignOut();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axiosInstance.get('/admin/pending-requests');
        setPendingRequests(response.data.length);
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
          <Link to="/admin">
            <div className="flex items-center space-x-2">
              <FaHome className="text-xl" />
              <span>Home</span>
            </div>
          </Link>
          <Link to="/admin/user-management">
            <div className="flex items-center space-x-2">
              <FaUser className="text-xl" />
              <span>User Management</span>
            </div>
          </Link>
          <Link to="/admin/organizer-management">
            <div className="flex items-center space-x-2">
              <FaUsers className="text-xl" />
              <span>Organizer Management</span>
            </div>
          </Link>
          <Link to="/admin/notifications">
            <div className="relative flex items-center space-x-2">
              <FaBell className="text-xl" />
              {pendingRequests > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {pendingRequests}
                </span>
              )}
              <span>Notifications</span>
            </div>
          </Link>
        </nav>
        <div>
          <button
            onClick={signOut}
            className="flex items-center text-white bg-gradient-to-r from-slate-300 to-slate-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-slate-300 dark:focus:ring-slate-800 font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 transition-colors ease-in-out duration-150"
          >
            <FaSignOutAlt className="mr-2 text-xl" />
            Signout
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
