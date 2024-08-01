import React, { ChangeEvent } from 'react';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  maxImages: number;
  fieldName: string;
  setFieldValue: (field: string, value: any) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, maxImages, fieldName, setFieldValue }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      if (files.length > maxImages) {
        alert(`You can only upload up to ${maxImages} images.`);
        return;
      }
      onUpload(files);
      setFieldValue(fieldName, files);
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleChange}
      className="border p-2"
    />
  );
};

export default ImageUploader;
