self.onmessage = async (event) => {
    console.log('Received message:', event.data);
  
    const { imageData } = event.data;
  
    try {
      console.log('Processing image data...');
      const blob = new Blob([imageData]);
  
      const imageBitmap = await createImageBitmap(blob);
      console.log('ImageBitmap created.');
  
      const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
      const ctx = canvas.getContext('2d');
  
      if (!ctx) {
        throw new Error('Failed to get OffscreenCanvasRenderingContext2D');
      }
  
      ctx.drawImage(imageBitmap, 0, 0);
      console.log('Image drawn on canvas.');
  
      const compressedImageBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.7 });
      console.log('Image compressed.');
  
      self.postMessage({ compressedImageBlob });
  
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };
  