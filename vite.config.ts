import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // backend is running on port 3000
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
    target: 'esnext', // Ensures the build uses the latest JavaScript features
  },
  optimizeDeps: {
    // Ensure dependencies are properly optimized
    include: ['image-compression']
  }
});
