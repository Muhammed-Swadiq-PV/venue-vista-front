import React, { useState, useEffect } from 'react';

import ImageOne from '../assets/events-assets/230721-224809-TML23-PZA02708-Enhanced-NR-HR-JT_PKZ-min.jpg';
import ImageTwo from '../assets/events-assets/230722-005512-TML23-DN201210-Enhanced-NR-DN-min.jpg';
import ImageThree from '../assets/events-assets/20230721-+224532-+TML2023+-+_DSC2440-MT-min.jpg';

const images = [ImageOne, ImageTwo, ImageThree];

const Home: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds (5000 milliseconds)

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gray-100">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-900">
            Venue-Vista
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/auth/signin" className="text-gray-600 hover:text-gray-900">For User</a>
          <a href="/organizer/signin" className="text-gray-600 hover:text-gray-900">For Organizer</a>
        </nav>

        {/* Login Button */}
        <div>
          <a
            href="/"
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Know more about us
          </a>
        </div>
      </header>

      {/* Main Content */}
      <section className="relative h-screen overflow-hidden">
        {/* Image Slider */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={images[currentImageIndex]}
            alt={`Event Image ${currentImageIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.5)' }} // Apply a slight shadow with reduced brightness
          />
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center text-white text-center p-4">
          {/* Left Side Content (for Users) */}
          <div className="w-full md:w-1/2 p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Connecting You to Perfect Venues</h1>
            <p className="text-base md:text-lg">
              Discover the ultimate event spaces tailored to your needs. From intimate gatherings to grand celebrations, our platform curates a selection of venues that promise to make your special occasion unforgettable. Explore unique locations, compare prices, and book effortlessly, all in one place.
            </p>
            <a
              href="/auth/signin"
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-8 md:mt-12 inline-block"
            >
              Sign In as User
            </a>
          </div>

          {/* Right Side Content (for Organizers) */}
          <div className="w-full md:w-1/2 p-8 mt-8 md:mt-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Maximize Your Event's Potential with Our Platform</h1>
            <p className="text-base md:text-lg">
              Unlock the full potential of your event management business with our easy-to-use platform. Showcase your venues to a vast audience, receive bookings directly, and manage your calendar efficiently. Let us connect you with potential clients, transforming your business into a thriving success story.
            </p>
            <a
              href="/organizer/signin"
              className="text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-8 md:mt-4 inline-block"
            >
              Sign In as Organizer
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
