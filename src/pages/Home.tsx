import React from 'react';

const Home: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-100">
      {/* Logo */}
      <div className="flex items-center">
        <a href="/" className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-900">Venue-Vista</a>
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center space-x-4">
        <a href="/user" className="text-gray-600 hover:text-gray-900">For User</a>
        <a href="/organizer" className="text-gray-600 hover:text-gray-900">For Organizer</a>
      </nav>

      {/* Login Button */}
      <div>
        <a
          href="/signin"
          className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Login
        </a>
      </div>
    </header>
  );
};

export default Home;
