import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import ImageUploader from '../../components/imageUploader/ImageUploader';
import axios from 'axios';
import { API_BASE_URL } from '../../apiConfig';
import { storage } from '../../firebaseConfig' ;
import { ref, uploadBytes , getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
    images: Yup.array().min(1, 'Main image is required').max(1, 'Only one main image allowed'),
    description: Yup.string().required('Main description is required'),
  }),
  parking: Yup.object().shape({
    images: Yup.array().max(4, 'Maximum 4 images allowed for parking area'),
    description: Yup.string().required('Parking area description is required'),
  }),
  indoor: Yup.object().shape({
    images: Yup.array().max(4, 'Maximum 4 images allowed for indoor area'),
    description: Yup.string().required('Indoor area description is required'),
  }),
  stage: Yup.object().shape({
    images: Yup.array().max(4, 'Maximum 4 images allowed for stage area'),
    description: Yup.string().required('Stage area description is required'),
  }),
  dining: Yup.object().shape({
    images: Yup.array().max(4, 'Maximum 4 images allowed for dining area'),
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
    const navigate = useNavigate();
  const [imageURLs, setImageURLs] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    // Cleanup URLs on unmount or when images change
    return () => {
      Object.values(imageURLs).flat().forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageURLs]);

  const handleImageUpload = (files: File[], section: keyof VenuePost, arrayHelpers: any) => {
    console.log(`Uploading files for section: ${section}`);
    
    // Log file details for debugging
    files.forEach(file => {
      console.log(`File name: ${file.name}, File size: ${file.size}, File type: ${file.type}`);
    });

    files.forEach(file => {
      arrayHelpers.push(file); // Push files one by one
      const url = URL.createObjectURL(file);
      console.log(`Created object URL: ${url}`);
      setImageURLs(prev => ({
        ...prev,
        [section]: [...(prev[section] || []), url]
      }));
    });
  };

  const handleSubmit = async (values: VenuePost, { setSubmitting }: any) => {
    console.log('Form submitted:', values);

    const uploadImageToFirebase = async (file: File, section: keyof VenuePost) => {
      const fileRef = ref(storage, `${section}/${file.name}`);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    };

    const sections: (keyof VenuePost)[] = ['main', 'parking', 'indoor', 'stage', 'dining'];
    const imageUrls: { [key: string]: string[] } = {};

    for (const section of sections) {
      imageUrls[section] = [];
      for (const file of values[section].images) {
        const url = await uploadImageToFirebase(file, section);
        imageUrls[section].push(url);
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

    try {
      const response = await axios.post(`${API_BASE_URL}/organizer/create-post`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      toast.success('Post created successfully!', { position: "top-center" });
      setSubmitting(false);
      navigate('/organizer/posts');
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.', { position: "top-center" });
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className="max-w-4xl mx-auto p-4">
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
                      />
                      <ErrorMessage name={`${sectionKey}.images`} component="div" className="text-red-500" />
                      <div className="flex flex-wrap gap-4 mt-4">
                        {(imageURLs[sectionKey] || []).length ? (
                          imageURLs[sectionKey].map((url, index) => (
                            <div key={index} className="w-24 h-24 overflow-hidden border border-gray-300 rounded">
                              <img src={url} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))
                        ) : (
                          <p>No images available</p>
                        )}
                      </div>
                    </div>
                  )}
                />
                <Field
                  as="textarea"
                  name={`${sectionKey}.description`}
                  placeholder={`${sectionKey} area description`}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
                <ErrorMessage name={`${sectionKey}.description`} component="div" className="text-red-500" />
              </div>
            );
          })}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default OrgPostForm;
