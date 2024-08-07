  import React, { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { useSignOut } from '../../contexts/OrganizerSignOut';
  import { HiBell, HiChat, HiUser, HiHome } from 'react-icons/hi';


  const Header: React.FC = () => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const signOut = useSignOut();



    const toggleProfileDropdown = () => {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    return (
      <div className='px-2 pt-2'>
        <header className="fixed top-0 left-4 right-4 flex justify-between items-center p-3 shadow-xl bg-white bg-opacity-60 backdrop-blur-md rounded-md">
          <div className="flex items-center">
            <a href="/organizer/home" className="font-architects-daughter text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600">
              Venue-Vista
            </a>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/organizer/home">
            <HiHome className='size-6'/>
            </Link>
            <Link to="/organizer/notification">
             <HiBell className='size-6'/>
            </Link>
            <Link to="/organizer/messages">
              <HiChat className='size-6'/>
            </Link>
            <div className="relative">
              <button onClick={toggleProfileDropdown}>
                <HiUser className='size-6'/>
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link to="/organizer/create-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                  <Link to="/posts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Posts</Link>
                  <Link to="/manage-posts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Posts</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                  <button onClick={signOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
                </div>
              )}
            </div>
          </nav>
        </header>
      </div>
    );
  };

  export default Header;