import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import ImageUploader from '../../components/imageUploader/ImageUploader';
import { API_BASE_URL } from '../../apiConfig';
import Header from '../../components/organizer/Header';
import Footer from '../../components/organizer/Footer';
import ErrorBoundary from '../../components/ErrorBoundary';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import Cookies from 'js-cookie';
import { useAxiosInterceptor } from '../../axios/useAxiosInterceptor';
import useAuthRedirect from '../../axios/useAuthRedirect';

// Define the type for form values
interface VenueSection {
  images: File[];
  description: string;
}

interface ParkingSection extends VenueSection {
  carParkingSpace: number;
  bikeParkingSpace: number;
}

interface IndoorSection extends VenueSection {
  seatingCapacity: number;
}

interface DiningSection extends VenueSection {
  diningCapacity: number;
}

interface VenuePost {
  main: VenueSection;
  parking: ParkingSection;
  indoor: IndoorSection;
  stage: VenueSection;
  dining: DiningSection;
}


// Validation schema
const validationSchema = Yup.object().shape({
  main: Yup.object().shape({
    images: Yup.array()
      .min(1, 'Main image is required')
      .max(1, 'Only one main image allowed')
      .required('Main image is required'),
    description: Yup.string().required('Main description is required'),
  }),
  parking: Yup.object().shape({
    images: Yup.array()
      .min(1, 'At least one image is required for the parking area')
      .max(4, 'Maximum 4 images allowed for parking area')
      .nullable(),
    description: Yup.string().required('Parking area description is required'),
    carParkingSpace: Yup.number().required('Car parking space is required').min(0, 'car parking must be a number'),
    bikeParkingSpace: Yup.number().required('Bike parking space is required').min(0, 'bike parking must be a number'),
  }),
  indoor: Yup.object().shape({
    images: Yup.array()
      .min(1, 'At least one image is required for the indoor area')
      .max(4, 'Maximum 4 images allowed for indoor area')
      .nullable(),
    description: Yup.string().required('Indoor area description is required'),
    seatingCapacity: Yup.number().required('Seating capacity in indoor is required').min(0, 'seat capacity must be a number'),
  }),
  stage: Yup.object().shape({
    images: Yup.array()
      .min(1, 'At least one image is required for the stage area')
      .max(4, 'Maximum 4 images allowed for stage area')
      .nullable(),
    description: Yup.string().required('Stage area description is required'),
  }),
  dining: Yup.object().shape({
    images: Yup.array()
      .min(1, 'At least one image is required for the dining area')
      .max(4, 'Maximum 4 images allowed for dining area')
      .nullable(),
    description: Yup.string().required('Dining area description is required'),
    diningCapacity: Yup.number().required('Dining capacity is required').min(0, 'dining capacity must be a number'),
  }),
});

// Initial values
const initialValues: VenuePost = {
  main: { images: [], description: '' },
  parking: { images: [], description: '', carParkingSpace: 0, bikeParkingSpace: 0 },
  indoor: { images: [], description: '', seatingCapacity: 0 },
  stage: { images: [], description: '' },
  dining: { images: [], description: '', diningCapacity: 0 },
};


// Component
const OrgPostForm: React.FC = () => {
  useAuthRedirect()
  // const handleSignOut = useHandleSignOut();
  const navigate = useNavigate();
  const axiosInstance = useAxiosInterceptor();

  const [imageURLs, setImageURLs] = useState<{ [key: string]: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Cleanup URLs on unmount or when images change
    return () => {
      Object.values(imageURLs).flat().forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageURLs]);

  const handleImageUpload = (files: File[], section: keyof VenuePost, arrayHelpers: any) => {
    console.log(`Uploading files for section: ${section}`);

    const maxFileSize = 5 * 1024 * 1024; // 5 MB maximum
    const validFiles = files.filter(file => file.size <= maxFileSize);
    const invalidFiles = files.filter(file => file.size > maxFileSize);

    if (invalidFiles.length) {
      toast.error('Some files exceed the maximum size allowed (5 MB).');
    }

    validFiles.forEach(file => {
      arrayHelpers.push(file);
      const url = URL.createObjectURL(file);
      setImageURLs(prev => ({
        ...prev,
        [section]: [...(prev[section] || []), url]
      }));
    });
  };

  const getPresignedUrl = async (fileName: string, fileType: string, operation: 'upload' | 'download', expiresIn: number = 3600) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/organizer/presigned-url`, {
        params: {
          fileName: encodeURIComponent(fileName),
          fileType: encodeURIComponent(fileType),
          operation,
          expiresIn
        }
      });
      return response.data.url;
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      throw new Error('Could not get presigned URL');
    }
  };

  const uploadFileToS3 = async (file: File, url: string) => {
    try {
      await axios.put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('Could not upload file');
    }
  };

  const handleSubmit = async (values: VenuePost, { setSubmitting }: any) => {
    setIsSubmitting(true);
    // console.log('Form submitted:', values);
  
    const sections: (keyof VenuePost)[] = ['main', 'parking', 'indoor', 'stage', 'dining'];
    const imageUrls: { [key: string]: string[] } = {};
  
    try {
      for (const section of sections) {
        imageUrls[section] = [];
        for (const file of values[section].images) {
          if (file instanceof File) {
            const presignedUrl = await getPresignedUrl(file.name, file.type, 'upload');
            await uploadFileToS3(file, presignedUrl);
            imageUrls[section].push(presignedUrl.split('?')[0]);
          } else {
            console.error('Invalid file object:', file);
          }
        }
      }
  
      const postData = {
        ...values,
        main: {
          ...values.main,
          images: imageUrls.main,
        },
        parking: {
          ...values.parking,
          images: imageUrls.parking,
        },
        indoor: {
          ...values.indoor,
          images: imageUrls.indoor,
        },
        stage: {
          ...values.stage,
          images: imageUrls.stage,
        },
        dining: {
          ...values.dining,
          images: imageUrls.dining,
        },
      };
  
      const organizerToken = Cookies.get('OrganizerAccessToken');
  
      const response = await axiosInstance.post(`${API_BASE_URL}/organizer/create-post`, postData, {
        headers: {
          'Authorization': `Bearer ${organizerToken}`,
        },
      });
  
      toast.success('Post created successfully!', { position: "top-center" });
      navigate('/organizer/view-post');
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.', { position: "top-center" });
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className='pt-20 '>
      <Header />
      <ErrorBoundary>
        <div className=" border border-gray-300 bg-white p-4 rounded-lg shadow-md max-w-2xl lg:max-w-3xl mx-auto ">
          {isSubmitting ? (
            <div className="flex justify-center items-center h-64">
              <Spinner text="Submitting..." />
            </div>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}

            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form className="p-4 ">
                  {Object.entries(values).map(([section, data]) => {
                    const sectionKey = section as keyof VenuePost;

                    return (
                      <div key={sectionKey} className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 capitalize">{sectionKey} Area</h2>
                        <FieldArray
                          name={`${sectionKey}.images`}
                          render={arrayHelpers => (
                            <div className="mb-4">
                              <ImageUploader
                                onUpload={(files) => {
                                  handleImageUpload(files, sectionKey, arrayHelpers);
                                }}
                                maxImages={sectionKey === 'main' ? 1 : 4}
                                fieldName={`${sectionKey}.images`}
                                setFieldValue={setFieldValue}
                              />
                              <ErrorMessage name={`${sectionKey}.images`} component="div" className="text-red-500" />
                              <div className="flex flex-wrap gap-4 mt-4">
                                {(imageURLs[sectionKey] || []).length ? (
                                  imageURLs[sectionKey].map((url, index) => (
                                    <div key={index} className="w-32 h-32 relative">
                                      <img src={url} alt={`Preview ${sectionKey}-${index}`} className="object-cover w-full h-full" />
                                    </div>
                                  ))
                                ) : (
                                  <p>No images uploaded</p>
                                )}
                              </div>
                            </div>
                          )}
                        />
                        <div className="mb-4">
                          <label htmlFor={`${sectionKey}.description`} className="block text-gray-700">Description</label>
                          <Field
                            as="textarea"
                            name={`${sectionKey}.description`}
                            placeholder = 'You can add your details about your event hall this data can view by user'
                            id={`${sectionKey}.description`}
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                          <ErrorMessage name={`${sectionKey}.description`} component="div" className="text-red-500" />
                        </div>
                        {sectionKey === 'parking' && (
                          <>
                            <div className="flex flex-wrap gap-4 mb-4">
                              <div className='flex1'>
                              <label htmlFor={`${sectionKey}.carParkingSpace`} className="block text-gray-700">Car Parking Space</label>
                              <Field
                                type="number"
                                id={`${sectionKey}.carParkingSpace`}
                                placeholder='add number of the car parking capacity'
                                name={`${sectionKey}.carParkingSpace`}
                                className="w-full p-2 border border-gray-300 rounded"
                              />
                              <ErrorMessage name={`${sectionKey}.carParkingSpace`} component="div" className="text-red-500" />
                            </div>
                            <div className="mb-4">
                              <label htmlFor={`${sectionKey}.bikeParkingSpace`} className="block text-gray-700">Bike Parking Space</label>
                              <Field
                                type="number"
                                id={`${sectionKey}.bikeParkingSpace`}
                                placeholder='add number of bike parking capacity'
                                name={`${sectionKey}.bikeParkingSpace`}
                                className="w-full p-2 border border-gray-300 rounded"
                              />
                              <ErrorMessage name={`${sectionKey}.bikeParkingSpace`} component="div" className="text-red-500" />
                            </div>
                            </div>
                          </>
                        )}
                        {sectionKey === 'indoor' && (
                          <div className=" mb-4">
                            <label htmlFor={`${sectionKey}.seatingCapacity`} className="block text-gray-700 font-medium mb-1">Seating Capacity</label>
                            <Field
                              type="number"
                              id={`${sectionKey}.seatingCapacity`}
                              placeholder='add number of the capacity'
                              name={`${sectionKey}.seatingCapacity`}
                              className="w-full p-2 border border-gray-300 rounded"
                            />
                            <ErrorMessage name={`${sectionKey}.seatingCapacity`} component="div" className="text-red-500" />
                          </div>
                        )}
                        {sectionKey === 'dining' && (
                          <div className="mb-4">
                            <label htmlFor={`${sectionKey}.diningCapacity`} className="block text-gray-700">Dining Capacity</label>
                            <Field
                              type="number"
                              id={`${sectionKey}.diningCapacity`}
                              placeholder='add number of the dining capacity'
                              name={`${sectionKey}.diningCapacity`}
                              className="w-full p-2 border border-gray-300 rounded"
                            />
                            <ErrorMessage name={`${sectionKey}.diningCapacity`} component="div" className="text-red-500" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className='items-center text-center'>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-500 text-white px-4 py-2 rounded transition-colors duration-300 ease-in-out hover:bg-green-600 hover:shadow-lg"
                    >
                      Submit
                    </button>

                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </ErrorBoundary>
      <Footer />
    </div>
  );
};

export default OrgPostForm;
