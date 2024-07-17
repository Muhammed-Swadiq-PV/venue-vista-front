import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../apiConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import SigninSchema from '../../components/auth/validations/SigninSchema';

const Signin: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values: { email: string; password: string }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/signin`, values);
            console.log('Form submitted successfully:', response.data);
            toast.success('Sign-in successful!');
            setTimeout(() => {
                navigate('/auth/home');
            }, 1000);
        } catch (error: any) {
            console.error('Error submitting form:', error);
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to sign in. Please try again.');
            }
        }
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: SigninSchema,
        onSubmit: handleSubmit,
    });

    return (
        <section className="bg-white">
            <ToastContainer />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-teal-900">
                    Venue-Vista
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign In to Your Account
                        </h1>
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={SigninSchema}
                            onSubmit={handleSubmit} // Pass handleSubmit directly
                        >
                            <Form className="space-y-4 md:space-y-6">
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <Field
                                        type="email"
                                        name="email"
                                        id="email"
                                        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                                        placeholder="name@company.com"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <Field
                                        type="password"
                                        name="password"
                                        id="password"
                                        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                                        placeholder="••••••••"
                                    />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                        disabled={formik.isSubmitting}
                                    >
                                        {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
                                    </button>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <a href="/auth/forgot-password" className="text-sm font-light text-gray-500 dark:text-gray-400">Forgot Password?</a>
                                </div>
                                <div>
                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                        Don't have an account? <a href="/auth/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up here</a>
                                    </p>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signin;
