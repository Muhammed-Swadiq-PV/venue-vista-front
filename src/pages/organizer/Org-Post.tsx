import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import ImageUploader from '../../components/imageUploader/ImageUploader';
import axios from 'axios';
import { API_BASE_URL } from '../../apiConfig';
import Header from '../../components/organizer/Header';
import Footer from '../../components/organizer/Footer';
import { useHandleSignOut } from '../../components/organizer/SignOut';
import ErrorBoundary from '../../components/ErrorBoundary';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';

// Define the type for form values
interface VenueSection {
  images: File[];
  description: string;
}

interface VenuePost {
  main: VenueSection;
  parking: VenueSection;
  indoor: VenueSection;
  stage: VenueSection;
  dining: VenueSection;
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
  }),
  indoor: Yup.object().shape({
    images: Yup.array()
      .min(1, 'At least one image is required for the indoor area')
      .max(4, 'Maximum 4 images allowed for indoor area')
      .nullable(),
    description: Yup.string().required('Indoor area description is required'),
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
  }),
});

// Initial values
const initialValues: VenuePost = {
  main: { images: [], description: '' },
  parking: { images: [], description: '' },
  indoor: { images: [], description: '' },
  stage: { images: [], description: '' },
  dining: { images: [], description: '' },
};

// Component
const OrgPostForm: React.FC = () => {
  const handleSignOut = useHandleSignOut();
  const navigate = useNavigate();

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

    const maxFileSize = 5 * 1024 * 1024; // 5 MB example
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
      const response = await axios.get(`${API_BASE_URL}/organizer/presigned-url`, {
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
    console.log('Form submitted:', values);
  
    const sections: (keyof VenuePost)[] = ['main', 'parking', 'indoor', 'stage', 'dining'];
    const imageUrls: { [key: string]: string[] } = {};
  
    try {
      for (const section of sections) {
        imageUrls[section] = [];
        console.log(`Processing section: ${section}`);
        console.log(`Files in section:`, values[section].images);
        
        for (const file of values[section].images) {
          if (file instanceof File) {
            console.log(`Processing file: ${file.name}, type: ${file.type}`);
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
  
      const token = localStorage.getItem('token'); 
  
      const response = await axios.post(`${API_BASE_URL}/organizer/create-post`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      toast.success('Post created successfully!', { position: "top-center" });
      navigate('/organizer/posts');
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.', { position: "top-center" });
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header onSignOut={handleSignOut} />
      <ErrorBoundary>
        <div className="border border-gray-300 p-4 rounded-lg shadow-md max-w-4xl mx-auto">
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
                <Form className="p-4">
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
                            id={`${sectionKey}.description`}
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                          <ErrorMessage name={`${sectionKey}.description`} component="div" className="text-red-500" />
                        </div>
                      </div>
                    );
                  })}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
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
