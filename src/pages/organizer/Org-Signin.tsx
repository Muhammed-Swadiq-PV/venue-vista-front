import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import { API_BASE_URL } from '../../apiConfig';
import SigninSchema from '../../components/auth/validations/SigninSchema';
import { useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

interface DecodedToken {
  email?: string;
  name?: string;
}

const Signin: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    try {
      if (!response.credential) {
        throw new Error('Google OAuth token not received');
      }

      console.log('Google Credential:', response.credential);

      // Decode the JWT token received from Google
      const decodedToken: DecodedToken = jwtDecode(response.credential);

      // Extract email and name from the decoded token
      const { email } = decodedToken;

      if (!email) {
        throw new Error('Email not signed with google');
      }

      const res = await axios.post(`${API_BASE_URL}/organizer/signin-google`, { email });

      const { accessToken, refreshToken, organizerId } = res.data;
      Cookies.set('OrganizerAccessToken', accessToken, { expires: 7, path: '/organizer' });
      Cookies.set('OrganizerRefreshToken', refreshToken, { expires: 7, path: '/organizer' });
      Cookies.set('OrganizerId', organizerId, { expires: 7, path: '/organizer' });

      toast.success('Signed in successfully with Google!');
      navigate('/organizer/home');
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to sign in. Please try again.');
      }
    }
  };

  const handleGoogleFailure = () => {
    toast.error('Google sign-in was unsuccessful. Please try again.');
  };

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/organizer/signin`, values);

      const { accessToken, refreshToken, organizerId } = response.data;

      // storing token in cookies

      Cookies.set('OrganizerAccessToken', accessToken, { expires: 7, path: '/organizer' });
      Cookies.set('OrganizerRefreshToken', refreshToken, { expires: 7, path: '/organizer' });
      Cookies.set('OrganizerId', organizerId, { expires: 7, path: '/organizer' });

      console.log('Form submitted successfully:', response.data);
      toast.success('Sign-in successful!');
      setTimeout(() => {
        navigate('/organizer/home');
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
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 md:space-y-6">
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="••••••••"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don't have an account? <a href="/organizer/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up here</a>
                  </p>
                </Form>
              )}
            </Formik>
            <div className="flex justify-center mt-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
