import React, { Suspense , useEffect} from 'react';
import Header from '../../components/organizer/Header';
import Footer from '../../components/organizer/Footer';
import { useHandleSignOut } from '../../components/organizer/SignOut';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ImageOne from '../../assets/organizer-assets/warm-welcoming-atmosphere-as-guests-arrive-party-venue.jpg';
import ImageTwo from '../../assets/organizer-assets/13134.jpg';

const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img src={src} alt={alt} loading="lazy" className="object-cover h-full w-full rounded-lg" />
);

const Home: React.FC = () => {
  const handleSignOut = useHandleSignOut();

  const navigate = useNavigate();

  const formData = useSelector((state: RootState) => state.form);


  useEffect(() => {
    const isFormDataComplete = formData.eventHallName && formData.phoneNumber && formData.district && formData.city && formData.buildingFloor && formData.pincode && formData.ownerIdCardUrl && formData.eventHallLicenseUrl;

    if (!isFormDataComplete) {
        navigate('/organizer/create-profile');
    }
}, [formData, navigate]);

  const handleButtonClick = () => {
    navigate('/organizer/post');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSignOut={handleSignOut} />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-8">
          {/* First row */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <ErrorBoundary>
                <Suspense fallback={<div>Loading...</div>}>
                  <LazyImage src={ImageOne} alt="Welcoming atmosphere" />
                </Suspense>
              </ErrorBoundary>
            </div>
            <div className="w-full md:w-1/3 flex flex-col justify-center p-4">
              <ErrorBoundary>
                <div className="space-y-4">
                  <h1 className="text-2xl text-center font-bold">Welcome to Venue-Vista</h1>
                  <p>
                    Welcome to Venue-Vista, the ultimate platform for discovering and booking event venues! As an organizer on Venue-Vista, you have the unique opportunity to showcase and manage event halls, helping individuals and businesses find the perfect spaces for their special occasions.
                    you can post images of your hall here.
                  </p>
                  <div className='flex justify-center'>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 "
                  onClick={handleButtonClick}>
                     Your event hall
                  </button>
                  </div>
                </div>
              </ErrorBoundary>
            </div>
          </div>

          {/* Second row */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 flex flex-col justify-center p-4">
              <ErrorBoundary>
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-center">Elevate Your Event Spaces</h2>
                  <p>
                    With Venue-Vista, you can showcase your event halls to a wide audience of potential clients. Our platform allows you to highlight the unique features of your venues, manage bookings efficiently, and grow your business.
                  </p>
                  <ul className="list-disc list-inside">
                    <li>Easy venue listing and management</li>
                    <li>Reach a broader audience of event planners</li>
                    <li>Streamline your booking process</li>
                    <li>Showcase high-quality images and virtual tours</li>
                  </ul>
                  <div className='flex justify-center'>
                  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                    Learn More
                  </button>
                  </div>
                </div>
              </ErrorBoundary>
            </div>
            <div className="w-full md:w-1/2">
              <ErrorBoundary>
                <Suspense fallback={<div>Loading...</div>}>
                  <LazyImage src={ImageTwo} alt="Event venue" />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;