import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configuration for local development proxy
  server: {
    // This setting ensures that requests to the frontend server's 
    // /api path are redirected to your running Node.js backend.
    // E.g., a fetch to /api/brands in the browser goes to http://localhost:3001/api/brands
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false, // Set to true if your backend were using HTTPS
      },
    },
  },
});