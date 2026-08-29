import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sub-app dev server block kept byte-identical with apps/flow: wujie
// fetches sub-app resources from the host origin, CORS is required.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8001,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  },
});
