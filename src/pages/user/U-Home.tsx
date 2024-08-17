import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Header from '../../components/auth/Header';
import Footer from '../../components/auth/Footer';
import ErrorBoundary from '../../components/ErrorBoundary';
import { API_BASE_URL } from '../../apiConfig';
import Spinner from '../../components/Spinner';
import { useAxiosInterceptor } from '../../axios/useAxiosInterceptor';
import useAuthRedirect from '../../axios/useAuthRedirect';
import defaultImage from '../../assets/organizer-assets/k-hills 1.png';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import { useOrganizerContext } from '../../hooks/useNearestOrganizer';

//Lazy image component for images
const LazyImage = lazy(() => import('../../components/auth/LazyImage'));


const ITEMS_PER_PAGE = 5;

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
  totalPages: number;
}

interface ApiResponse {
  details: {
    eventHalls: EventHall[];
    organizers: Organizer[];
  };
  totalPages: number;
}

const getToken = () => Cookies.get('userAccessToken');

const UHome: React.FC = () => {
  useAuthRedirect();

  const navigate = useNavigate();
  const axiosInstance = useAxiosInterceptor();
  
  const [data, setData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { detailedOrganizers, viewingNearby } = useOrganizerContext();

  const fetchLatestPost = useCallback(async (page: number) => {
    try {
      const response = await axiosInstance.get<ApiResponse>(`${API_BASE_URL}/users/posts/latest`, {
        params: {
          page,
          limit: ITEMS_PER_PAGE,
        },
      });

      const eventHalls = response.data.details.eventHalls || [];
      const organizers = response.data.details.organizers || [];

      setData({
        eventHalls,
        organizers,
        totalPages: response.data.totalPages
      });
    } catch (err) {
      console.error('Error fetching latest post:', err);
      setError('Failed to load the latest post. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchLatestPost(currentPage);
  }, [fetchLatestPost, currentPage]);

  const handleViewDetails = (hallId: string) => {
    navigate(`/user/event-hall/${hallId}`);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoading(true);
  };

  

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8 mt-8">
        <ErrorBoundary>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner text="Loading..." />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ):  viewingNearby ? (
            // Render nearby halls
            <div className="max-w-4xl mx-auto">
              {detailedOrganizers.map((detailedOrganizer, index) => {
                const eventHall = detailedOrganizer.eventHalls[0];
                const organizer = detailedOrganizer.organizers[0];
                const isEven = index % 2 === 0;
          
                return (
                  <div key={eventHall._id} className="mb-8 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                    onClick={() => handleViewDetails(eventHall._id)}>
                    <h1 className="text-2xl font-bold mb-4 p-4">{organizer.name}</h1>
                    <div className={`flex flex-col md:flex-row ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <div className="w-full md:w-1/2">
                        {eventHall.main.images[0] && (
                          <Suspense fallback={<div className="p-2 h-64 flex items-center justify-center">Loading image...</div>}>
                            <LazyImage
                              src={encodeURI(eventHall.main.images[0])}
                              alt={`Main Image for ${organizer.name}`}
                              className="p-2 h-64 object-cover rounded-lg mb-6 ml-4"
                              fallbackSrc={defaultImage}
                            />
                          </Suspense>
                        )}
                      </div>
                      <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
                        <p className="text-gray-700 mb-6 ml-6">{eventHall.main.description}</p>
                        <div className="text-sm text-gray-500 space-y-2 ml-5">
                          <p>City: {organizer.city}</p>
                          <p>District: {organizer.district}</p>
                          <p>Phone Number: {organizer.phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) :  data && data.eventHalls.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              {data.eventHalls.map((eventHall, hallIndex) => {
                const organizer = data.organizers.find(org => org._id === eventHall.organizerId);
                const isEven = hallIndex % 2 === 0;

                return (
                  <div key={eventHall._id} className="mb-8 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                    onClick={() => handleViewDetails(eventHall._id)}>
                    <h1 className="text-2xl font-bold mb-4 p-4">{organizer?.name}</h1>
                    <div className={`flex flex-col md:flex-row ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <div className="w-full md:w-1/2">
                      {eventHall.main.images[0] && (
                          <Suspense fallback={<div className="p-2 h-64 flex items-center justify-center">Loading image...</div>}>
                            <LazyImage
                              src={encodeURI(eventHall.main.images[0])}
                              alt={`Main Image for ${organizer?.name}`}
                              className="p-2 h-64 object-cover rounded-lg mb-6 ml-4"
                              fallbackSrc={defaultImage}
                            />
                          </Suspense>
                        )}
                      </div>
                      <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
                        <p className="text-gray-700 mb-6 ml-6">{eventHall.main.description}</p>
                        <div className="text-sm text-gray-500 space-y-2 ml-5">
                          <p>City: {organizer?.city}</p>
                          <p>District: {organizer?.district}</p>
                          <p>Phone Number: {organizer?.phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          ) : (
            <div className="text-center">No event halls available.</div>
          )}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default React.memo(UHome);
