import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FaHome, FaUser, FaBell, FaEnvelope, FaBars } from 'react-icons/fa';
import { useSignOut } from '../../contexts/UserSignOut';
import Cookies from 'js-cookie';
import axios from 'axios';
import { debounce } from 'lodash'
import { API_BASE_URL } from '../../apiConfig';
import { toast } from 'react-toastify';
import { useOrganizerContext } from '../../contexts/useNearestOrganizer';

const Header: React.FC = () => {
  const location = useLocation();
  const userId = Cookies.get('userId');
  const { id } = useParams<{ id: string }>();

  const signOut = useSignOut();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);



  const { setViewingNearby, setDetailedOrganizers } = useOrganizerContext();

  // const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const lastFetchedLocation = useRef({ latitude: 0, longitude: 0 });
  const organizersRef = useRef<any[]>([]);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/profile/${userId}`);
        const profile = response.data;

        if (profile.address && profile.city && profile.pin && profile.district && profile.mobileNumber) {
          setIsProfileComplete(true);
        }
        setProfile(profile);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfile();
  }, [userId]);



  const fetchOrganizers = useCallback(async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/organizers?lat=${latitude}&lon=${longitude}`);
      setOrganizers(response.data);
      console.log(response, 'organizers near to ')
      // console.log( typeof(response.data[0]._id), 'type of id')
      organizersRef.current = response.data;
      lastFetchedLocation.current = { latitude, longitude };
    } catch (error) {
      console.error('Error fetching organizers:', error);
    }
  }, []);

  const fetchOrganizerDetailsByIds = async (organizers: any[]) => {
    try {
      const organizerIds = organizers.map(organizer => organizer._id);
      const response = await axios.post(`${API_BASE_URL}/users/organizers/details`, { ids: organizerIds });
      console.log(response, 'response when click button')
      const detailedOrganizers = response.data;
      setDetailedOrganizers(detailedOrganizers);
      setViewingNearby(true);
    } catch (error) {
      console.error('Error fetching organizer details:', error);
    }
  }

  const debouncedFetchOrganizers = useCallback(
    debounce((latitude: number, longitude: number) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        lastFetchedLocation.current.latitude,
        lastFetchedLocation.current.longitude
      );
      if (distance > 0.1 || organizersRef.current.length === 0) {  // 0.1 km threshold
        fetchOrganizers(latitude, longitude);
      }
    }, 1000),
    [fetchOrganizers]
  );


  useEffect(() => {
    if (location.pathname === '/user/home') {
      const fetchUserLocation = () => {
        if (navigator.geolocation) {
          navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') {
              navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
                debouncedFetchOrganizers(latitude, longitude);

              });
            } else if (result.state === 'prompt' || result.state === 'denied') {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  setUserLocation({ latitude, longitude });
                  debouncedFetchOrganizers(latitude, longitude);

                },
                (error) => {
                  console.error('Error getting location:', error);

                }
              );
            } else if (result.state === 'denied') {
              console.log('Location access denied.');

            }
          });
        } else {
          console.log('Geolocation is not supported by this browser.');

        }
      };
      fetchUserLocation();
    }

    return () => {
      debouncedFetchOrganizers.cancel();
    };
  }, [location.pathname, debouncedFetchOrganizers]);

  // Helper function to calculate distance between two points
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }


  const handleLocationButtonClick = () => {
    if (isLocationEnabled && organizers.length > 0) {
      fetchOrganizerDetailsByIds(organizers);
    } else {
      // Enable location
      if (navigator.geolocation) {
        navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            // Permission already granted, get location
            getCurrentPosition();
          } else if (permissionStatus.state === 'prompt') {
            // This will trigger the browser's permission prompt
            getCurrentPosition();
          } else if (permissionStatus.state === 'denied') {
            // Permission has been denied, I am using a toast info for inform user
            console.log('Location permission is denied. Please enable it in your browser settings you can adjust it in the top left side .');
            showLocationDeniedToast();

          }

          // Listen for changes to the permission state
          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted') {
              getCurrentPosition();
            }
          };
        });
      } else {
        console.log('Geolocation is not supported by this browser.');
        // Handle lack of support (e.g., show a message to the user)
      }
    }
  };

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        debouncedFetchOrganizers(latitude, longitude);
        setIsLocationEnabled(true);
      },
      (error) => {
        console.error('Error getting location:', error);
        // Handle error (e.g., show an error message to the user)
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  const openProfileModal = () => {
    setIsModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsModalOpen(false);
  };

  const showLocationDeniedToast = () => {
    toast.info(
      '⚠️ Location permission is denied. Please enable it in your browser settings. You can do this by clicking the "🔒" or "!" symbol near the URL bar, selecting "Site settings," and allowing location access.',
      {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
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

        {/* Search and Location Data (Only on Home Page) */}
        {location.pathname === '/user/home' && (
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLocationButtonClick}
              className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md mx-2 my-2 md:mx-4 md:my-0 w-full md:w-auto"
            >
              Nearby Halls
            </button>

          </div>
        )}

         {/* Show "Book Event Hall" button if on event hall details page */}
         {location.pathname.includes('/user/event-hall/') && id && (
                    <div className="flex items-center space-x-4">
                        <Link
                            to={`/user/book-event-hall/date-time/${id}`} 
                            className="px-4 py-2 text-sm bg-blue-500 hover:bg-green-600 text-white rounded-md mx-2 my-2 md:mx-4 md:my-0 w-full md:w-auto"
                        >
                            Book Event Hall
                        </Link>
                    </div>
                )}

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
                {isProfileComplete ? (
                  <button
                    onClick={openProfileModal}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                ) : (
                  <Link to="/user/create-profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Create Profile
                  </Link>
                )}
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
            {location.pathname === '/user/home' && (
              <button
                onClick={handleLocationButtonClick}
                className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md mx-2 my-2 md:mx-4 md:my-0 w-full md:w-auto"
              >
                Nearby Halls
              </button>

            )}
            <Link to="/user/home" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Home</Link>
            <Link to="/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notifications</Link>
            <Link to="/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Messages</Link>
            {isProfileComplete ? (
              <button
                onClick={openProfileModal}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>
            ) : (
              <Link to="/user/create-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Create Profile
              </Link>
            )}
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
      {/* Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg max-w-sm md:max-w-md w-full border-8 border-blue-200">
            <h2 className="text-2xl md:text-2xl font-bold mb-4">Your account details</h2>
            {profile ? (
              <div>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Address:</strong> {profile.address}</p>
                <p><strong>District:</strong> {profile.district}</p>
                <p><strong>Mobile Number:</strong> {profile.mobileNumber}</p>
                <p><strong>PIN:</strong> {profile.pin}</p>
              </div>
            ) : (
              <p>Loading profile...</p>
            )}
            <div className='mt-4 flex justify-center'>
              <button
                onClick={closeProfileModal}
                className="mt-4 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;  
