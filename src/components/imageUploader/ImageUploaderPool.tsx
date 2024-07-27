// import React, { useState, useEffect } from 'react';
// import { DynamicThreadPool } from 'poolifier';
// import imageCompression from 'browser-image-compression';

// // Define the worker function
// const workerFunction = async ({ file, options }) => {
//   const compressedFile = await imageCompression(file, options);
//   return compressedFile;
// };

// // Create a thread pool
// const pool = new DynamicThreadPool(4, 8, workerFunction);

// interface ImageUploadProps {
//   onUpload: (files: File[]) => void;
//   maxImages: number;
// }

// const ImageUploader: React.FC<ImageUploadProps> = ({ onUpload, maxImages }) => {
//   const [previews, setPreviews] = useState<string[]>([]);
//   const [compressedFiles, setCompressedFiles] = useState<File[]>([]);

//   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const imageFiles = Array.from(event.target.files || []);
//     if (imageFiles.length === 0) return;

//     const compressionTasks = imageFiles.map(file => 
//       pool.execute({ 
//         file, 
//         options: {
//           maxSizeMB: 1,
//           maxWidthOrHeight: 1920,
//           useWebWorker: true,
//         }
//       })
//     );

//     try {
//       const compressedResults = await Promise.all(compressionTasks);
      
//       const newPreviews = compressedResults.map(file => URL.createObjectURL(file));
//       setPreviews(prev => [...prev, ...newPreviews].slice(0, maxImages));
      
//       setCompressedFiles(prev => [...prev, ...compressedResults].slice(0, maxImages));
//       onUpload(compressedFiles);
//     } catch (error) {
//       console.error('Error occurred while compressing images:', error);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       previews.forEach(URL.revokeObjectURL);
//     };
//   }, [previews]);

//   return (
//     <div>
//       <input 
//         type="file" 
//         accept="image/*" 
//         onChange={handleImageUpload} 
//         multiple 
//       />
//       <div className="image-previews">
//         {previews.map((preview, index) => (
//           <img key={index} src={preview} alt={`Preview ${index + 1}`} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageUploader;

// src/components/ImageUploader/ImageUploader.tsx
// import React, { useState } from 'react';
// import imageCompression from 'browser-image-compression';

// const ImageUploader: React.FC<{ onUpload: (file: File) => void }> = ({ onUpload }) => {
//   const [preview, setPreview] = useState<string>('');

//   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const imageFile = event.target.files?.[0];
//     if (!imageFile) {
//       return;
//     }

//     try {
//       const options = {
//         maxSizeMB: 1,
//         maxWidthOrHeight: 1920,
//         useWebWorker: true,
//       };

//       const compressedFile = await imageCompression(imageFile, options);

//       // Convert the compressed file to a blob URL for preview
//       const blobUrl = URL.createObjectURL(compressedFile);
//       setPreview(blobUrl);

//       // Call the onUpload callback with the compressed file
//       onUpload(compressedFile);
//     } catch (error) {
//       console.error('Error occurred while compressing image:', error);
//     }
//   };

//   return (
//     <div>
//       <input type="file" accept="image/*" onChange={handleImageUpload} />
//       {preview && <img src={preview} alt="Preview" />}
//     </div>
//   );
// };

// export default ImageUploader;
