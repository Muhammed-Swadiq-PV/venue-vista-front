import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/auth/Header';
import Footer from '../../components/auth/Footer';
import { useHandleSignOut } from '../../components/auth/SignOut';
import ErrorBoundary from '../../components/ErrorBoundary';
import { API_BASE_URL } from '../../apiConfig';
import Spinner from '../../components/Spinner';
import axiosInstance from '../../axios/axiosInterceptor';
import defaultImage from '../../assets/organizer-assets/k-hills 1.png';
import Cookies from 'js-cookie';

interface EventHall {
  _id: string;
  organizerId: string;
  main: {
    images: string[];
    description: string;
  };
  dining: {
    images: string[];
    description: string;
  };
  indoor: {
    images: string[];
    description: string;
  };
  parking: {
    images: string[];
    description: string;
  };
  stage: {
    images: string[];
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Organizer {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  district: string;
  city: string;
  buildingFloor: string;
}

interface ResponseData {
  eventHalls: EventHall[];
  organizers: Organizer[];
}

const getToken = () => {
  // return localStorage.getItem('userToken');
  Cookies.get('userAccessToken');
};

const UHome: React.FC = () => {
  const handleSignOut = useHandleSignOut();
  const [data, setData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestPost = useCallback(async () => {
    const token = getToken();

    try {
      const response = await axiosInstance.get<ResponseData>(`${API_BASE_URL}/users/posts/latest`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response?.data?.eventHalls[0].main.images, 'getting complete details');

      setData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching latest post:', err);
      setError('Failed to load the latest post. Please try again later.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestPost();
  }, [fetchLatestPost]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSignOut={handleSignOut} />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <ErrorBoundary>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner text="Loading..." />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : data && data.eventHalls.length > 0 && data.organizers.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              {data.eventHalls.map((eventHall) => {
                const organizer = data.organizers.find(org => org._id === eventHall.organizerId);
                return (
                  <div key={eventHall._id} className="mb-8 lg:flex lg:items-center">
                    <div className="lg:w-1/2 lg:pr-4">
                      <h1 className="text-2xl font-bold mb-4">{organizer?.name}</h1>
                      {eventHall.main.images.length > 0 ? (
                        <img
                          src={encodeURI(eventHall.main.images[0])}
                          alt="Main Venue"
                          className="w-full h-64 object-cover rounded-lg mb-4"
                          onError={(e) => {
                            console.error("Error loading image:", e);
                            e.currentTarget.src = defaultImage; // Use the correct fallback image
                          }}
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                          No Image Available
                        </div>
                      )}
                    </div>
                    <div className="lg:w-1/2 lg:pl-4">
                      <p className="text-gray-700 mb-2">{eventHall.main.description}</p>
                      <p className="text-gray-500">City: {organizer?.city}</p>
                      <p className="text-gray-500">District: {organizer?.district}</p>
                      <p className="text-gray-500">Phone Number: {organizer?.phoneNumber}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center">No posts available.</div>
          )}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default React.memo(UHome);
