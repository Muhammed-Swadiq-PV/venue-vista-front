import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <div className='px-2 pt'>

      <header className="flex justify-between items-center p-3 shadow-xl bg-white rounded-md" >
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="font-architects-daughter text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600">
            Venue-Vista
          </a>

        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/admin/user-management" className="">User Management</Link>
          <Link to="/admin/organizer-management" className="hover:">Organizer Management</Link>

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
