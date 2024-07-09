// src/components/ImageUploader/ImageUploader.tsx
import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

const ImageUploader: React.FC<{ onUpload: (file: File) => void }> = ({ onUpload }) => {
  const [preview, setPreview] = useState<string>('');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];
    if (!imageFile) {
      return;
    }

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(imageFile, options);

      // Convert the compressed file to a blob URL for preview
      const blobUrl = URL.createObjectURL(compressedFile);
      setPreview(blobUrl);

      // Call the onUpload callback with the compressed file
      onUpload(compressedFile);
    } catch (error) {
      console.error('Error occurred while compressing image:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {preview && <img src={preview} alt="Preview" />}
    </div>
  );
};

export default ImageUploader;
