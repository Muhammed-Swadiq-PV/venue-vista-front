import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import { API_BASE_URL } from '../../apiConfig';
import SignupSchema from '../../components/auth/validations/SignupSchema';
import { useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

interface DecodedToken {
  email?: string; 
  name?: string; 
}


const Signup: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    try {
      if (!response.credential) {
        throw new Error('Google OAuth token not received');
      }
      
      // Decode the JWT token received from Google
      const decodedToken: DecodedToken = jwtDecode(response.credential);
      
      // Extract email and name from the decoded token
      const { email, name } = decodedToken;
      
      if (!email || !name) {
        throw new Error('Email or name not found in token');
      }

      const res = await axios.post(`${API_BASE_URL}/organizer/google-auth`, {
        email,
        name,
      });

      const { accessToken , refreshToken } = res.data;

      if(!accessToken){
        throw new Error('Token not received from server');
      }

      Cookies.set('OrganizerAccessToken' , accessToken, { expires: 7, path: '/organizer' });
      Cookies.set('OrganizerRefreshToken' , refreshToken, { expires: 7, path: '/organizer' });
      toast.success('Signed up successfully with Google!');
      
      navigate('/organizer/signin');
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      toast.error('Failed to sign up with Google. Please try again.');
    }
  };
  


  const handleGoogleFailure = () => {
    toast.error('Google sign-in was unsuccessful. Please try again.');
  };

  const handleSubmit = async (values: any) => {
    try {
      const otpResponse = await axios.post(`${API_BASE_URL}/organizer/signup`, values);
      toast.success('Please check your email for the OTP!');
      navigate(`/organizer/verify-otp?email=${values.email}`);
    } catch (error: any) {
      console.error('Error during signup:', error);
      if (error.response && error.response.data.error === 'Email already exists') {
        toast.error('Email already exists. Please sign in.');
      } else if (error.response && error.response.data.error === 'Organizer already exists but is not verified. OTP has been sent.') {
        navigate(`/organizer/verify-otp?email=${values.email}`);
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    }
  };

  const redirectToLogin = () => {
    navigate('/organizer/signin');
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
              Create an account
            </h1>
            <Formik
              initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={SignupSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 md:space-y-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="John Doe"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                  </div>
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
                  <div>
                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="••••••••"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    disabled={isSubmitting}
                  >
                    Create an account
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account? <button onClick={redirectToLogin} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</button>
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
      <ToastContainer />
    </section>
  );
};

export default Signup;
