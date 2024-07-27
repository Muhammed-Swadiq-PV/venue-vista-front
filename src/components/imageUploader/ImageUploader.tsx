import React, { useRef } from 'react';

const ImageUploader: React.FC<{ onUpload: (files: File[]) => void; maxImages: number }> = ({ onUpload, maxImages }) => {
  const workerRef = useRef<Worker | null>(null);

  React.useEffect(() => {
    if (typeof Worker !== 'undefined') {
      workerRef.current = new Worker(new URL('./imageCompressionWorker.ts', import.meta.url), { type: 'module' });
      workerRef.current.onmessage = (event) => {
        const { compressedImageBlob } = event.data;
        onUpload([compressedImageBlob as unknown as File]);
      };
    }
    return () => {
      workerRef.current?.terminate();
    };
  }, [onUpload]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const selectedFiles = files.slice(0, maxImages);
      selectedFiles.forEach((file) => {
        if (workerRef.current) {
          const reader = new FileReader();
          reader.onload = () => {
            const imageData = reader.result;
            if (typeof imageData === 'string' || imageData instanceof ArrayBuffer) {
              workerRef.current?.postMessage({ imageData });
            }
          };
          reader.readAsArrayBuffer(file);
        }
      });
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
