import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../apiConfig';
import SignupSchema from '../../components/organizer/validations/SignupSchema';

const Signup: React.FC = () => {
  const initialValues = {
    ownerName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    eventHallName: '',
    state: '',
    district: '',
    city: '',
    buildingFloor: '',
    pincode: '',
    ownerIdCard: '',
    eventHallLicence: ''
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/organizer/signup`, values);
      toast.success('Form submitted successfully');
      console.log('Form submitted successfully:', response.data);
    } catch (error) {
      toast.error('Error submitting form');
      console.error('Error submitting form:', error);
    }
  };

  return (
    <section className="bg-white min-h-screen flex flex-col items-center justify-center">
      <a href="/" className="mb-6 text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-teal-900">
        Venue-Vista
      </a>

      <div className="flex flex-col items-center justify-center h-80vh w-full">
      <div className=" w-[95%] xl:w-[50%] bg-white rounded-lg shadow dark:border xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={SignupSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 md:space-y-6">
                  <div>
                    <label htmlFor="ownerName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Owner name</label>
                    <Field
                      type="text"
                      name="ownerName"
                      id="ownerName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="John Doe"
                    />
                    <ErrorMessage name="ownerName" component="div" className="text-red-600 text-sm" />
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
                    <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                    <Field
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="123-456-7890"
                    />
                    <ErrorMessage name="phoneNumber" component="div" className="text-red-600 text-sm" />
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
                    <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
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
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="eventHallName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event hall name</label>
                    <Field
                      type="text"
                      name="eventHallName"
                      id="eventHallName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Event hall name"
                    />
                    <ErrorMessage name="eventHallName" component="div" className="text-red-600 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State</label>
                      <Field
                        type="text"
                        name="state"
                        id="state"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="State"
                      />
                      <ErrorMessage name="state" component="div" className="text-red-600 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="district" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">District</label>
                      <Field
                        type="text"
                        name="district"
                        id="district"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="District"
                      />
                      <ErrorMessage name="district" component="div" className="text-red-600 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                      <Field
                        type="text"
                        name="city"
                        id="city"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="City"
                      />
                      <ErrorMessage name="city" component="div" className="text-red-600 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="buildingFloor" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Building/Floor</label>
                      <Field
                        type="text"
                        name="buildingFloor"
                        id="buildingFloor"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Building/Floor"
                      />
                      <ErrorMessage name="buildingFloor" component="div" className="text-red-600 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pincode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pincode</label>
                      <Field
                        type="text"
                        name="pincode"
                        id="pincode"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Pincode"
                      />
                      <ErrorMessage name="pincode" component="div" className="text-red-600 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="ownerIdCard" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Owner ID Card</label>
                      <Field
                        type="text"
                        name="ownerIdCard"
                        id="ownerIdCard"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Owner ID Card"
                      />
                      <ErrorMessage name="ownerIdCard" component="div" className="text-red-600 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="eventHallLicence" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event Hall Licence</label>
                    <Field
                      type="text"
                      name="eventHallLicence"
                      id="eventHallLicence"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Event Hall Licence"
                    />
                    <ErrorMessage name="eventHallLicence" component="div" className="text-red-600 text-sm" />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Create an account
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <ToastContainer />
    </section>
  );
};

export default Signup;
