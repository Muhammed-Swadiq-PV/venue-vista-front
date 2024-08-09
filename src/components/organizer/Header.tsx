import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignOut } from '../../contexts/OrganizerSignOut';
import { HiBell, HiChat, HiUser, HiHome, HiMenu } from 'react-icons/hi';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../../apiConfig';

const Header: React.FC = () => {

  const organizerId = Cookies.get('OrganizerId');

  // console.log(organizerId, 'organizer id')

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const navigate = useNavigate();
  const signOut = useSignOut();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/organizer/profile/${organizerId}`);
        const profile = response.data;

        if (profile.buildingFloor && profile.city && profile.district && profile.eventHallName && profile.ownerIdCardUrl && profile.eventHallLicenseUrl) {
          setIsProfileComplete(true);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfile();
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };



  return (
    <div className='px-2 pt-2'>
      <header className="fixed top-0 left-4 right-4 flex justify-between items-center p-3 shadow-xl bg-white bg-opacity-60 backdrop-blur-md rounded-md z-50">
        <div className="flex items-center">
          <a href="/organizer/home" className="font-architects-daughter text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600">
            Venue-Vista
          </a>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/organizer/home">
            <HiHome className='w-6 h-6' />
          </Link>
          <Link to="/organizer/notification">
            <HiBell className='w-6 h-6' />
          </Link>
          <Link to="/organizer/messages">
            <HiChat className='w-6 h-6' />
          </Link>
          <div className="relative">
            <button onClick={toggleProfileDropdown}>
              <HiUser className='w-6 h-6' />
            </button>
            {isProfileDropdownOpen && (

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link to={isProfileComplete ? "/organizer/view-profile" : "/organizer/create-profile"}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  {isProfileComplete ? "View Profile" : "Create Profile"}</Link>

                <Link to="/organizer/view-post" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Posts</Link>
                {/* <Link to="/manage-posts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Posts</Link> */}
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                <button onClick={signOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex items-center" onClick={toggleMobileMenu}>
          <HiMenu className='w-6 h-6' />
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg rounded-md py-2 z-10">
            <Link to="/organizer/home" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Home</Link>
            <Link to="/organizer/notification" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notifications</Link>
            <Link to="/organizer/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Messages</Link>
            <Link to="/organizer/create-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
            <Link to="/posts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Posts</Link>
            <Link to="/manage-posts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Posts</Link>
            <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
            <button onClick={signOut} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
