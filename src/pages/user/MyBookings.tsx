import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInterceptor';
import { format } from 'date-fns';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../../apiConfig';
import { toast } from 'react-toastify';

import { CalendarIcon, ClockIcon, MapPinIcon, MailIcon, PhoneIcon, UserIcon } from 'lucide-react';
import Header from '../../components/user/Header';
import BookingDetailModal from './BookingDetailModal';
import CancellationModal from './CancellationModal';


const userId = Cookies.get('userId');

interface Venue {
  name: string;
  location: {
    buildingFloor: string;
    city: string;
    pincode: string;
    district: string;
  }
  email: string;
  phoneNumber: string;
  rulesAndRestrictions?: string;
  paymentPolicy?: string;
}

interface Booking {
  _id: string;
  eventName: string;
  bookingDate: string;
  bookingTime: 'day' | 'night' | 'full';
  status: 'pending' | 'confirmed' | 'canceled';
  isPaymentPaid: boolean;
  venue: Venue;
  userName: string;
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserBookings();
  }, []);

  useEffect(() => {
    console.log("Current Bookings:", bookings);
  }, [bookings]);

  const fetchUserBookings = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/users/mybookings/${userId}`);
      // console.log(response.data, 'response')


      const transformedBookings: Booking[] = response.data.map((data: any) => ({
        ...data,
        venue: {
          name: data.organizerDetails.name,
          email: data.organizerDetails.email,
          phoneNumber: data.organizerDetails.phoneNumber,
          rulesAndRestrictions: data.organizerDetails.rulesAndRestrictions,
          paymentPolicy: data.organizerDetails.paymentPolicy,
          location: {
            buildingFloor: data.organizerDetails.buildingFloor,
            city: data.organizerDetails.city,
            district: data.organizerDetails.district,
            pincode: data.organizerDetails.pincode,
          },
        },
      }));
      setBookings(transformedBookings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };


  const openModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
    setModalTitle('');
  };
  //cancellation modal
  const handleCancelBooking = (bookingId: string) => {
    setSelectedBookingId(bookingId); 
    setIsCancellationModalOpen(true); 
  };

  //close cancellation modal
  const handleCloseCancellationModal = () => {
    setIsCancellationModalOpen(false);
    setSelectedBookingId(null);
  };
  // confirm cancellation booking
  const handleConfirmCancellation = async ( cancellationReason: string) => {
    if (selectedBookingId) {
      try {
        const response = await axiosInstance.post(
          `${API_BASE_URL}/users/bookings/${selectedBookingId}/cancel`,
          { cancellationReason }
        );
   
        if (response.status === 200) {
          setBookings(prevBookings =>
            prevBookings.filter(booking => booking._id !== selectedBookingId)
          );
  
          setIsCancellationModalOpen(false);
          setSelectedBookingId(null);
  
          toast.success('Booking canceled successfully!', {
            position: 'top-right',
            autoClose: 3000,
          });

        } else {
          throw new Error('Failed to cancel booking');
        }
      } catch (error) {
        console.error('Error canceling booking:', error);
        toast.error('Failed to cancel booking. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };
  
  

  const handleBookAgain = (venue: any) => {
    navigate(`/venue/${venue._id}`);
  };

  const handleReview = (booking: Booking) => {
    navigate(`/review/${booking._id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'canceled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-4 pt-16">
        <h1 className="text-2xl font-bold mb-6 text-center">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="flex flex-col justify-center items-center bg-gray-100 p-8 rounded-lg min-h-[50vh]">
            <h2 className="text-xl mb-4">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6 text-center">
              Explore amazing venues and create unforgettable events with Venue Vista!
            </p>
            <button
              onClick={() => navigate('/user/home')}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Browse Venues
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="border rounded-lg p-4 shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{booking.eventName}</h2>
                  <span
                    className={`font-medium ${getStatusColor(booking.status)}`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 text-gray-500" size={20} />
                    <span>{format(new Date(booking.bookingDate), 'PPP')}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="mr-2 text-gray-500" size={20} />
                    <span>{booking.bookingTime.charAt(0).toUpperCase() + booking.bookingTime.slice(1)} Session</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center">
                  <MapPinIcon className="mr-3 text-gray-500" size={20} />
                  <div>
                    <p className="font-medium">Location</p>
                    <p>{booking.venue.location?.buildingFloor}</p>
                    <p>{booking.venue.location?.city}, {booking.venue.location?.district}</p>
                    <p>{booking.venue.location?.pincode}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Contact Details */}

                  <div className="flex items-center">
                    <PhoneIcon className="mr-3 text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Contact Number</p>
                      <p>{booking.venue.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MailIcon className="mr-3 text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Email</p>
                      <p>{booking.venue.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="mr-3 text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Booked By</p>
                      <p>{booking.userName}</p>
                    </div>
                  </div>
                </div>

                {/* Buttons for Modal */}
                <button
                  onClick={() => openModal('Rules & Restrictions', booking.venue.rulesAndRestrictions || 'N/A')}
                  className="text-blue-600 mt-4 underline"
                >
                  View Rules & Restrictions
                </button>
                <button
                  onClick={() => openModal('Cancellation Policy', booking.venue.paymentPolicy || 'N/A')}
                  className="text-blue-600 mt-4 underline ml-4"
                >
                  View Cancellation Policy
                </button>

                 {/* Conditional Rendering for Cancel Button */}
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => 
                    handleCancelBooking(booking._id)}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 mt-4 w-full"
                >
                  Cancel Booking
                </button>
              )}

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleBookAgain(booking.venue)}
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100"
                  >
                    Book Again
                  </button>
                  <button
                    onClick={() => handleReview(booking)}
                    className="bg-green-50 text-green-600 px-4 py-2 rounded-md hover:bg-green-100"
                  >
                    Write Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Detail Modal */}
        <BookingDetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalTitle}
          content={modalContent}
        />
        {/* Cancellation Modal */}
      <CancellationModal
        isOpen={isCancellationModalOpen}
        onClose={handleCloseCancellationModal}
        onConfirm={handleConfirmCancellation}
      />
      </div>
    </div>

  );
};

export default MyBookings;