import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Prevents "process is not defined" error in browser and injects the API key
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Polyfill process.env to empty object for safety if other libs access it
      'process.env': {} 
    }
  };
});