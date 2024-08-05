import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaBell, FaEnvelope } from 'react-icons/fa';
import { useSignOut } from '../../contexts/UserSignOut';

const Header: React.FC= () => {
  const signOut = useSignOut();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);


  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <div className="p-2">
      <header className="fixed top-0 left-4 right-4 flex justify-between items-center p-3 shadow-xl bg-white bg-opacity-60 backdrop-blur-md rounded-md">
        <div className="flex items-center">
          <a
            href="/"
            className="font-architects-daughter text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600"
          >
            Venue-Vista
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/user/home" className="text-gray-600 hover:text-gray-800">
            <FaHome size={24} />
          </Link>
          <Link to="/notifications" className="text-gray-600 hover:text-gray-800">
            <FaBell size={24} />
          </Link>
          <Link to="/messages" className="text-gray-600 hover:text-gray-800">
            <FaEnvelope size={24} />
          </Link>
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
            >
              <FaUser size={24} />
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                <Link to="/my-bookings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">My Bookings</Link>
                <Link to="/payments" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Payments</Link>
                <button
                  onClick={signOut}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

      </header>
    </div>
  );
};

export default Header;
