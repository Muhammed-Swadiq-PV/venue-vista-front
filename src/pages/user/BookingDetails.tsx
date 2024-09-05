import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInterceptor';
import { API_BASE_URL } from '../../apiConfig';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import Cookies from 'js-cookie';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingDetails: React.FC = () => {
    const { organizerId } = useParams<{ organizerId: string }>();
    const location = useLocation();
    const selectedDate = location.state?.selectedDate;
    const [bookingDetails, setBookingDetails] = useState<any[]>([]);
    const [eventHallName, setEventHallName] = useState<string>('');
    const [rulesAndRestrictions, setRulesAndRestrictions] = useState<string>('');
    const [PaymentCancellation, setPaymentCancellation] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const userId = Cookies.get('userId');

    useEffect(() => {
        const fetchEventHallName = async () => {
            try {
                const response = await axiosInstance.get(`${API_BASE_URL}/users/orgname/${organizerId}`);
                setEventHallName(response.data.organizerName);
                setRulesAndRestrictions(response.data.rulesAndRestrictions);
                setPaymentCancellation(response.data.PaymentPolicy);
                setPhoneNumber(response.data.phoneNumber);
                // console.log(response.data.phoneNumber, 'organizer rules')
            } catch (error) {
                console.error('Error fetching event hall name:', error);
            }
        };

        fetchEventHallName();
    }, [organizerId]);

    const handleBookingSubmit = async (values: any, { resetForm }: any) => {
        try {
            const response = await axiosInstance.post(
                `${API_BASE_URL}/users/bookings`,
                {
                    organizerId,
                    userId,
                    ...values,
                    date: selectedDate,
                }
            );
            if (response.status === 200) {
                setBookingDetails([...bookingDetails, response.data]);
                toast.success('Booking successful!');
                resetForm();
            }
        } catch (error) {
            console.error('Error making booking:', error);
            toast.error('Booking failed. Please try again.');
        }
    };

    const validationSchema = Yup.object().shape({
        eventName: Yup.string().required('Event Name is required'),
        userName: Yup.string().required('Your Name is required'),
        contactNumber: Yup.string().required('Contact Number is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        eventType: Yup.string().required('Event Type is required'),
    });

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow p-4 max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mt-10 mb-6 text-center">
                    {eventHallName || 'Event Hall'}
                </h1>
                <h1 className="text-lg font-bold mt-10 mb-4 text-center">
                    Booking the Hall for {new Date(selectedDate).toLocaleDateString()}
                </h1>
                <div className="mt-8 p-4 border rounded-lg shadow-lg bg-white">
                    <h2 className="text-lg font-semibold mb-4">Make a Booking</h2>
                    <ToastContainer />
                    <Formik
                        initialValues={{
                            eventName: '',
                            userName: '',
                            contactNumber: '',
                            email: '',
                            eventType: 'day',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleBookingSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="col-span-2">
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
                                    <div className="col-span-2">
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
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="eventType" className="block text-gray-700 mb-2">
                                        Event Type
                                    </label>
                                    <Field
                                        as="select"
                                        id="eventType"
                                        name="eventType"
                                        className="w-full p-3 border rounded"
                                    >
                                        <option value="day">Day</option>
                                        <option value="night">Night</option>
                                        <option value="full">Full Day</option>
                                    </Field>
                                    <ErrorMessage
                                        name="eventType"
                                        component="div"
                                        className="text-red-500 mt-1"
                                    />
                                </div>

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
            <Footer />
        </div>
    );
};

export default BookingDetails;
