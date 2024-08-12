import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../../apiConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface PostEditModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  sectionTitle: string;
  sectionData: {
    description: string;
    images?: string[];
    carParkingSpace?: number;
    bikeParkingSpace?: number;
    seatingCapacity?: number;
    diningCapacity?: number;
  };
  onSave: (data: any) => void;
}

const PostEditModal: React.FC<PostEditModalProps> = ({
  isOpen,
  onRequestClose,
  sectionTitle,
  sectionData,
  onSave,
}) => {
  const organizerId = Cookies.get('OrganizerId');
  const [description, setDescription] = useState(sectionData.description);
  const [images, setImages] = useState<string[]>(sectionData.images || []);
  const [carParkingSpace, setCarParkingSpace] = useState(sectionData.carParkingSpace || 0);
  const [bikeParkingSpace, setBikeParkingSpace] = useState(sectionData.bikeParkingSpace || 0);
  const [seatingCapacity, setSeatingCapacity] = useState(sectionData.seatingCapacity || 0);
  const [diningCapacity, setDiningCapacity] = useState(sectionData.diningCapacity || 0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // This function fetches a presigned URL from the server
  const getPresignedUrl = async (fileName: string, fileType: string, operation: 'upload' | 'download') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/organizer/presigned-url`, {
        params: {
          fileName: encodeURIComponent(fileName),
          fileType: encodeURIComponent(fileType),
          operation,
        },
      });
      return response.data.url;
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      throw new Error('Could not get presigned URL');
    }
  };

  // This function uploads the file to S3 using the presigned URL
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

  const handleImageClick = (index: number) => {
    if (sectionTitle === 'Main' && images.length >= 1) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files) {
          const file = target.files[0];
          const newImage = URL.createObjectURL(file);
          const updatedImages = [...images];
          updatedImages[index] = newImage;
          setImages(updatedImages);
        }
      };
      fileInput.click();
    } else {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files) {
          const file = target.files[0];
          const newImage = URL.createObjectURL(file);
          const updatedImages = [...images];
          updatedImages[index] = newImage;
          setImages(updatedImages);
        }
      };
      fileInput.click();
    }
  };


  const handleRemoveImage = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    } else {
      alert(`You must keep at least one image for ${sectionTitle}`);
    }
  };

  // Handles image upload, including getting the presigned URL and uploading the file
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      if (sectionTitle === 'Main' && files.length > 1) {
        setUploadError(`You can only upload one image for ${sectionTitle}`);
        return;
      } else if (files.length + images.length > (sectionTitle === 'Main' ? 1 : 4)) {
        setUploadError(`You can only upload up to ${sectionTitle === 'Main' ? 1 : 4} images for ${sectionTitle}`);
        return;
      }

      setUploadError(null); // Clear any previous error
      setIsSubmitting(true);

      try {
        const uploadedImageUrls: string[] = [];
        for (const file of files) {
          const presignedUrl = await getPresignedUrl(file.name, file.type, 'upload');
          await uploadFileToS3(file, presignedUrl);
          uploadedImageUrls.push(presignedUrl.split('?')[0]); // Store the S3 URL without the query string
        }

        setImages([...images, ...uploadedImageUrls]); // Update the state with new image URLs
      } catch (error) {
        setUploadError('Error uploading images');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handles saving the updated data
  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await onSave({ description, images, carParkingSpace, bikeParkingSpace, seatingCapacity, diningCapacity });
      toast.success('Post updated successfully');
      onRequestClose();
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={`Edit ${sectionTitle}`}>
      <h2>Edit {sectionTitle}</h2>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="w-full border rounded p-2"
      />

      {uploadError && <p className="text-red-500">{uploadError}</p>}

      {images.length > 0 && (
        <div className="flex flex-wrap mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative mr-2 mb-2">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-24 h-24 object-cover cursor-pointer"
                onClick={() => handleImageClick(index)}
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white px-1 py-0.5 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        multiple={sectionTitle !== 'Main'}
        onChange={handleImageUpload}
        className="w-full border rounded p-2 mt-2"
        disabled={isSubmitting} // Disable during upload
      />

      {carParkingSpace !== undefined && sectionData.carParkingSpace !== undefined && (
        <div className='mt-1'>
          <p>Car parking space</p>
          <input
            type="number"
            value={carParkingSpace}
            onChange={(e) => setCarParkingSpace(Number(e.target.value))}
            className="w-full border rounded p-2 mt-2"
            placeholder="Car Parking Space"
          />
        </div>
      )}
      {bikeParkingSpace !== undefined && sectionData.bikeParkingSpace !== undefined && (
        <div className='mt-1'>
          <p>Bike parking space</p>
          <input
            type="number"
            value={bikeParkingSpace}
            onChange={(e) => setBikeParkingSpace(Number(e.target.value))}
            className="w-full border rounded p-2 mt-2"
            placeholder="Bike Parking Space"
          />
        </div>
      )}
      {seatingCapacity !== undefined && sectionData.seatingCapacity !== undefined && (
        <div className='mt-1'>
          <p>Seating capacity</p>
          <input
            type="number"
            value={seatingCapacity}
            onChange={(e) => setSeatingCapacity(Number(e.target.value))}
            className="w-full border rounded p-2 mt-2"
            placeholder="Seating Capacity"
          />
        </div>
      )}
      {diningCapacity !== undefined && sectionData.diningCapacity !== undefined && (
        <div className='mt-1'>
          <p>Dining Capacity</p>
          <input
            type="number"
            value={diningCapacity}
            onChange={(e) => setDiningCapacity(Number(e.target.value))}
            className="w-full border rounded p-2 mt-2"
            placeholder="Dining Capacity"
          />
        </div>
      )}

      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Save
      </button>
      <button onClick={onRequestClose} className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2">
        Cancel
      </button>
    </Modal>
  );
};

export default PostEditModal;
