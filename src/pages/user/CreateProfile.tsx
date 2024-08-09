import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../apiConfig';
import Cookies from 'js-cookie';
import Header from '../../components/auth/Header';
import Footer from '../../components/auth/Footer';

interface ProfileFormValues {
    address: string;
    city: string;
    pin: string;
    district: string;
    mobileNumber: string;
}

const ProfileSchema = Yup.object().shape({
    address: Yup.string()
        .required('Address is required'),
    city: Yup.string()
        .required('City is required'),
    pin: Yup.string()
        .matches(/^\d{6}$/, 'Pin must be exactly 6 digits')
        .required('Pin is required'),
    district: Yup.string()
        .required('District is required'),
    mobileNumber: Yup.string()
        .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
        .required('Mobile number is required'),
});

const CreateProfile: React.FC = () => {
    const navigate = useNavigate();
    const userId = Cookies.get('userId');

    const initialValues: ProfileFormValues = {
        address: '',
        city: '',
        pin: '',
        district: '',
        mobileNumber: '',
    };

    const handleSubmit = async (values: ProfileFormValues) => {
        try {
            await axios.post(`${API_BASE_URL}/users/profile/${userId}`, values);
            navigate('/user/home'); // Redirect to the home page after successful profile creation
        } catch (error) {
            console.error('Error creating profile:', error);
        }
    };

    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <div className="flex-grow flex items-center justify-center mt-16 mb-4">
                <div className="w-full max-w-lg p-6 bg-white shadow-md rounded-md mx-4 sm:mx-6 md:mx-8 lg:mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-center">Create Your Profile</h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={ProfileSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="mb-4">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                    <Field
                                        name="address"
                                        type="text"
                                        placeholder= 'please provide your address here'
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pl-4 py-2"
                                    />
                                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                    <Field
                                        name="city"
                                        type="text"
                                        placeholder='please provide your city here'
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pl-4 py-2"
                                    />
                                    <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="pin" className=" block text-sm font-medium text-gray-700">Pin</label>
                                    <Field
                                        name="pin"
                                        type="text"
                                        placeholder='please provide your pin number 6 digits'
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pl-4 py-2"
                                    />
                                    <ErrorMessage name="pin" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
                                    <Field
                                        name="district"
                                        placeholder='please provide your district'
                                        type="text"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pl-4 py-2"
                                    />
                                    <ErrorMessage name="district" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                    <Field
                                        name="mobileNumber"
                                        type="text"
                                        placeholder='please provide your mobile number should be 10 digits'
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pl-4 py-2"
                                    />
                                    <ErrorMessage name="mobileNumber" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 "
                                >
                                    {isSubmitting ? 'Submitting...' : 'Create Profile'}
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

export default CreateProfile;
