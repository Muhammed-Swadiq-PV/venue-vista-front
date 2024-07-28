import React from 'react';
import { compressImage } from './ImageCompressionWorker';

const ImageUploader: React.FC<{ onUpload: (files: File[]) => void; maxImages: number }> = ({ onUpload, maxImages }) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const selectedFiles = files.slice(0, maxImages);
      const compressedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const compressedBlob = await compressImage(file, 1920, 1080, 0.7);
          return new File([compressedBlob], file.name, { type: 'image/jpeg' });
        })
      );
      onUpload(compressedFiles);
    }
  };

  return (
    <input
      type="file"
      onChange={handleFileChange}
      accept="image/*"
      multiple={maxImages > 1}
    />
  );
};

export default ImageUploader;