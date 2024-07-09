import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../apiConfig';

const OTPVerification: React.FC = () => {
    const [otp, setOTP] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOTP(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/verify-otp`, { otp });
            console.log('OTP verified successfully:', response.data);
            // Handle success (e.g., show a success message)
            // For example, navigate to a success page or redirect to the home page
            navigate('/success'); // Redirect to a success page
        } catch (error) {
            console.error('Error verifying OTP:', error);
            // Handle error (e.g., show an error message)
        }
    };

    const handleResendOTP = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/resend-otp`, { email: 'user@example.com' }); // Replace with actual email
            console.log('OTP resent successfully:', response.data);
            // Handle success (e.g., show a success message)
        } catch (error) {
            console.error('Error resending OTP:', error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <section className="bg-white">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="/" className="flex items-center mb-6 text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-teal-900">
                    Venue-Vista
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            OTP Verification
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter OTP</label>
                                <input
                                    type="text"
                                    name="otp"
                                    id="otp"
                                    value={otp}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter OTP"
                                />
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <button
                                    type="submit"
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Verify OTP
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    className="text-sm font-light text-gray-500 dark:text-gray-400 hover:underline focus:outline-none"
                                >
                                    Resend OTP
                                </button>
                            </div>
                            <div>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Did not receive OTP? Check your email or <a href="/forgot-password" className="font-medium text-primary-600 hover:underline dark:text-primary-500">resend OTP</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OTPVerification;
