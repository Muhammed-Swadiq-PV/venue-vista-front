import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import { API_BASE_URL } from '../../apiConfig';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const CreateProfile: React.FC = () => {
  const navigate = useNavigate();

  const initialValues = {
    eventHallName: '',
    phoneNumber: '',
    state: '',
    district: '',
    city: '',
    buildingFloor: '',
    pincode: '',
    ownerIdCard: null,
    eventHallLicense: null,
  };

  const validationSchema = Yup.object().shape({
    eventHallName: Yup.string().required('Event Hall Name is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    state: Yup.string().required('State is required'),
    district: Yup.string().required('District is required'),
    city: Yup.string().required('City is required'),
    buildingFloor: Yup.string().required('Building/Floor is required'),
    pincode: Yup.string().required('Pincode is required'),
    ownerIdCard: Yup.mixed().required('Owner ID Card is required'),
    eventHallLicense: Yup.mixed().required('Event Hall License is required'),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    const formData = new FormData();
    Object.keys(values).forEach((key: string) => {
      formData.append(key, (values as any)[key]);
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/organizer/create-profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Profile created successfully!');
      setSubmitting(false);
      navigate('/organizer/profile');
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white mt-20">
      <ToastContainer />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-teal-900">
          Venue-Vista
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create Event Hall Profile
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="space-y-4 md:space-y-6">
                  <div>
                    <label htmlFor="eventHallName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event Hall Name</label>
                    <Field
                      type="text"
                      name="eventHallName"
                      id="eventHallName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Event Hall Name"
                    />
                    <ErrorMessage name="eventHallName" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                    <Field
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Phone Number"
                    />
                    <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <div>
                      <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State</label>
                      <Field
                        type="text"
                        name="state"
                        id="state"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="State"
                      />
                      <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                    </div> */}
                    <div>
                      <label htmlFor="district" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">District</label>
                      <Field
                        type="text"
                        name="district"
                        id="district"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="District"
                      />
                      <ErrorMessage name="district" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                      <Field
                        type="text"
                        name="city"
                        id="city"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="City"
                      />
                      <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="buildingFloor" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Building/Floor</label>
                    <Field
                      type="text"
                      name="buildingFloor"
                      id="buildingFloor"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Building/Floor"
                    />
                    <ErrorMessage name="buildingFloor" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pincode</label>
                    <Field
                      type="text"
                      name="pincode"
                      id="pincode"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Pincode"
                    />
                    <ErrorMessage name="pincode" component="div" className="text-red-500 text-sm" />
                  </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ownerIdCard" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Owner ID Card</label>
                    <input
                      type="file"
                      name="ownerIdCard"
                      id="ownerIdCard"
                      onChange={(event) => {
                        setFieldValue('ownerIdCard', event.currentTarget.files ? event.currentTarget.files[0] : null);
                      }}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ErrorMessage name="ownerIdCard" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="eventHallLicense" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event Hall License</label>
                    <input
                      type="file"
                      name="eventHallLicense"
                      id="eventHallLicense"
                      onChange={(event) => {
                        setFieldValue('eventHallLicense', event.currentTarget.files ? event.currentTarget.files[0] : null);
                      }}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ErrorMessage name="eventHallLicense" component="div" className="text-red-500 text-sm" />
                  </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateProfile;
