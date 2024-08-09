import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaBell, FaEnvelope, FaBars } from 'react-icons/fa';
import { useSignOut } from '../../contexts/UserSignOut';
import Cookies from 'js-cookie';
import axios from 'axios';
import { API_BASE_URL } from '../../apiConfig';

const Header: React.FC = () => {
  const userId = Cookies.get('userId');

  const signOut = useSignOut();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/profile/${userId}`);
        const profile = response.data;
        // console.log(profile, 'profile')

        if (profile.address && profile.city && profile.pin && profile.district && profile.mobileNumber) {
          setIsProfileComplete(true);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfile();
  }, [userId]);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="p-2">
      <header className="fixed top-0 left-4 right-4 flex justify-between items-center p-3 shadow-xl bg-white bg-opacity-60 backdrop-blur-md rounded-md z-50">
        <div className="flex items-center">
          <a
            href="/"
            className="font-architects-daughter text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600"
          >
            Venue-Vista
          </a>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
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
                <Link to={isProfileComplete ? "/user/profile" : "/user/create-profile"}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  {isProfileComplete ? "Profile" : "Create Profile"}</Link>
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
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex items-center" onClick={toggleMobileMenu}>
          <FaBars className="w-6 h-6" />
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg rounded-md py-2 z-10">
            <Link to="/user/home" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Home</Link>
            <Link to="/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notifications</Link>
            <Link to="/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Messages</Link>
            <Link to={isProfileComplete ? "/user/profile" : "/user/complete-profile"}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              {isProfileComplete ? "Profile" : "Complete Profile"}</Link>
            <Link to="/my-bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Bookings</Link>
            <Link to="/payments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Payments</Link>
            <button
              onClick={signOut}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
