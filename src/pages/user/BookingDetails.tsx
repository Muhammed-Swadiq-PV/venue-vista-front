import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInterceptor';
import { API_BASE_URL } from '../../apiConfig';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import Cookies from 'js-cookie';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import StripePaymentModal from './StripePaymentModal';

import { BookingData } from '../../types/booking';

interface Price {
    dayPrice: number;
    nightPrice: number;
    fullDayPrice: number;
}


const stripePromise = loadStripe('pk_test_51Q2TbzP745G8Gz1MI5QBdy4mgx5Y6BtxErVIjwanYdZhCRUCTbqD920zhfKI8rNUs4R0RtCxfK7aP9Xj6P0vZkQ600DX203jC7');

const MAX_LENGTH = 100;

const BookingDetails: React.FC = () => {
    const { organizerId, id: postId } = useParams<{ organizerId: string; id: string }>();
    const location = useLocation();
    const selectedDate = location.state?.selectedDate;
    const [bookingDetails, setBookingDetails] = useState<BookingData[]>([]);

    const [eventHallName, setEventHallName] = useState<string>('');

    const [rulesAndRestrictions, setRulesAndRestrictions] = useState<string>('');
    const [PaymentCancellation, setPaymentCancellation] = useState<string>('');
    const [isExpandedRules, setIsExpandedRules] = useState(false);
    const [isExpandedPayment, setIsExpandedPayment] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [carParkingSpace, setCarParkingSpace] = useState<number>();
    const [bikeParkingSpace, setBikeParkingSpace] = useState<number>();
    const [indoorSeatingCapacity, setIndoorSeatingCapacity] = useState<number>();
    const [diningCapacity, setDiningCapacity] = useState<number>();
    const [price, setPrice] = useState<Price | null>(null);

    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    //for stripe payment modal
    const [showPayment, setShowPayment] = useState(false);


    const userId = Cookies.get('userId');

    const navigate = useNavigate();

    const toggleRules = () => setIsExpandedRules(!isExpandedRules);
    const togglePayment = () => setIsExpandedPayment(!isExpandedPayment);

    const latestBooking = bookingDetails[bookingDetails.length - 1];

    useEffect(() => {
        const fetchEventHallName = async () => {
            try {
                const response = await axiosInstance.get(`${API_BASE_URL}/users/orgname/${organizerId}`);
                setEventHallName(response.data.organizerName);
                setRulesAndRestrictions(response.data.rulesAndRestrictions);
                setPaymentCancellation(response.data.paymentPolicy);
                setPhoneNumber(response.data.phoneNumber);
            } catch (error) {
                console.error('Error fetching event hall name:', error);
            }
        };

        fetchEventHallName();
    }, [organizerId]);

    useEffect(() => {
        if (postId) {
            const fetchEventHallDetails = async () => {
                try {
                    const response = await axiosInstance.get(`${API_BASE_URL}/users/orgdetails/${postId}`);
                    setCarParkingSpace(response.data.carParkingSpace);
                    setBikeParkingSpace(response.data.bikeParkingSpace);
                    setIndoorSeatingCapacity(response.data.indoorSeatingCapacity);
                    setDiningCapacity(response.data.diningCapacity);
                } catch (error) {
                    console.error('Error fetching event hall details:', error);
                }
            };

            fetchEventHallDetails();
        }
    }, [postId]);

    useEffect(() => {
        if (organizerId && selectedDate) {
            const fetchPriceDetails = async () => {
                try {
                    const datePriceResponse = await axiosInstance.get(`${API_BASE_URL}/users/priceDetails/${organizerId}/${selectedDate}`);
                    if (datePriceResponse) {
                        setPrice(datePriceResponse.data);
                    }
                } catch (error) {
                    console.error('Error fetching price of the selected date', error);
                }
            }
            fetchPriceDetails();
        }
    }, [organizerId, selectedDate]);

    const handleBookingSubmit = async (values: any, { resetForm }: any) => {
        try {
            const bookedAt = new Date();
            const response = await axiosInstance.post(
                `${API_BASE_URL}/users/bookings`,
                {
                    organizerId,
                    userId,
                    ...values,
                    bookedAt,
                    bookingDate: selectedDate,
                }
            );
            if (response.status === 200) {

                console.log(response.data, 'response')
                const { bookingId, status } = response.data;

                setBookingDetails([...bookingDetails, { ...response.data, bookingId, status }

                ]);
                // toast.success('data stored in backend');

                setShowPayment(true);

                resetForm();
            }
        } catch (error) {
            console.error('Error making booking:', error);
            toast.error('Booking failed. Please try again.');
        }
    };

    const handlePaymentSuccess = () => {
        // Show a success message
        toast.success("Payment successful! Redirecting to your bookings...");

        // Redirect to "My Bookings" page after a short delay
        setTimeout(() => {
            navigate("/user/my-bookings");
        }, 3000); // 3 seconds delay for user to read the toast
    };


    const validationSchema = Yup.object().shape({
        eventName: Yup.string().required('Event Name is required'),
        userName: Yup.string().required('Your Name is required'),
        contactNumber: Yup.string().required('Contact Number is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        bookingTime: Yup.string().required('Booking Time is required'),
    });

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow p-4 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mt-10 mb-6 text-center">
                    {eventHallName || 'Event Hall'}
                </h1>
                <h1 className="text-lg font-bold mt-6 mb-4 text-center">
                    Booking the Hall for {new Date(selectedDate).toLocaleDateString()}
                </h1>
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Event Details Section */}
                    <div className="p-4 border rounded-lg shadow-lg bg-white">
                        <h2 className="text-2xl font-semibold mb-4">Event Hall Details</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">Rules and Restrictions:</h3>
                                {/* Conditionally render partial or full text */}
                                <p>
                                    {isExpandedRules
                                        ? rulesAndRestrictions
                                        : `${rulesAndRestrictions.slice(0, MAX_LENGTH)}...`}
                                </p>
                                <button
                                    className="text-blue-500 hover:underline"
                                    onClick={toggleRules}
                                >
                                    {isExpandedRules ? 'View Less' : 'View More'}
                                </button>
                            </div>
                            <div>
                                <h3 className="font-semibold">Payment and Cancellation Policy:</h3>
                                {/* Conditionally render partial or full text */}
                                <p>
                                    {isExpandedPayment
                                        ? PaymentCancellation
                                        : `${PaymentCancellation.slice(0, MAX_LENGTH)}...`}
                                </p>
                                <button
                                    className="text-blue-500 hover:underline"
                                    onClick={togglePayment}
                                >
                                    {isExpandedPayment ? 'View Less' : 'View More'}
                                </button>
                            </div>
                            <div>
                                <h3 className="font-semibold">Contact Number:</h3>
                                <p>{phoneNumber}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Parking Space:</h3>
                                <p>Cars: {carParkingSpace}, Bikes: {bikeParkingSpace}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Seating Capacity:</h3>
                                <p>Indoor: {indoorSeatingCapacity}, Dining: {diningCapacity}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Price Details:</h3>
                                <div>
                                    <p>Day Price: ₹{price?.dayPrice}</p>
                                    <p>Night Price: ₹{price?.nightPrice}</p>
                                    <p>Full Day Price: ₹{price?.fullDayPrice}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form Section */}
                    <div className="p-4 border rounded-lg shadow-lg bg-white">
                        <h2 className="text-2xl font-semibold mb-4">Make a Booking</h2>
                        <ToastContainer />
                        <Formik
                            initialValues={{
                                eventName: '',
                                userName: '',
                                contactNumber: '',
                                email: '',
                                bookingTime: 'day',
                                eventType: ''

                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleBookingSubmit}
                        >
                            {({ isSubmitting, values, setFieldValue }) => (
                                <Form className="space-y-4">
                                    <div>
                                        <label htmlFor="eventName" className="block text-gray-700 mb-2">
                                            Event Name
                                        </label>
                                        <Field
                                            type="text"
                                            id="eventName"
                                            name="eventName"
                                            className="w-full p-3 border rounded"
                                        />
                                        <ErrorMessage
                                            name="eventName"
                                            component="div"
                                            className="text-red-500 mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="userName" className="block text-gray-700 mb-2">
                                            Your Name
                                        </label>
                                        <Field
                                            type="text"
                                            id="userName"
                                            name="userName"
                                            className="w-full p-3 border rounded"
                                        />
                                        <ErrorMessage
                                            name="userName"
                                            component="div"
                                            className="text-red-500 mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="contactNumber" className="block text-gray-700 mb-2">
                                            Contact Number
                                        </label>
                                        <Field
                                            type="tel"
                                            id="contactNumber"
                                            name="contactNumber"
                                            className="w-full p-3 border rounded"
                                        />
                                        <ErrorMessage
                                            name="contactNumber"
                                            component="div"
                                            className="text-red-500 mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <Field
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="w-full p-3 border rounded"
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-red-500 mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="eventType" className="block text-gray-700 mb-2">
                                            Booking Time
                                        </label>
                                        <Field
                                            as="select"
                                            id="bookingTime"
                                            name="bookingTime"
                                            className="w-full p-3 border rounded"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                const bookingTime = e.target.value;
                                                setFieldValue('bookingTime', bookingTime);

                                                // Update selected price based on event type
                                                if (bookingTime === 'day') {
                                                    setSelectedPrice(price?.dayPrice ?? null);
                                                } else if (bookingTime === 'night') {
                                                    setSelectedPrice(price?.nightPrice ?? null);
                                                } else if (bookingTime === 'full') {
                                                    setSelectedPrice(price?.fullDayPrice ?? null);
                                                }
                                            }}
                                        >
                                            <option value="day">Day</option>
                                            <option value="night">Night</option>
                                            <option value="full">Full Day</option>
                                        </Field>
                                        <ErrorMessage
                                            name="bookingTime"
                                            component="div"
                                            className="text-red-500 mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="eventType" className="block text-gray-700 mb-2">
                                            Event Type (Optional)
                                        </label>
                                        <Field
                                            type="text"
                                            id="eventType"
                                            name="eventType"
                                            className="w-full p-3 border rounded"
                                        />
                                        <ErrorMessage
                                            name="eventType"
                                            component="div"
                                            className="text-red-500 mt-1"
                                        />
                                    </div>

                                    {/* Display the selected price */}
                                    {selectedPrice !== null && (
                                        <div className="text-lg font-bold text-green-500">
                                            Total amount to pay: ₹{selectedPrice}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
                                        disabled={isSubmitting}
                                    >
                                        Book Now
                                    </button>
                                </Form>
                            )}
                        </Formik>

                    </div>
                </div>
            </div>
            {showPayment && selectedPrice && latestBooking && (
                <Elements stripe={stripePromise}>
                    <StripePaymentModal
                        amount={selectedPrice || 0}
                        bookingId={latestBooking.bookingId} 
                        onSuccess={handlePaymentSuccess}
                        onClose={() => setShowPayment(false)}
                    />
                </Elements>
            )}

            <Footer />
        </div>
    );
};

export default BookingDetails;