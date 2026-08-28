import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';

// Use import.meta.env.VITE_APP_NAME for qiankun
export default defineConfig({
  plugins: [
    react(),
    qiankun({
      useDevMode: true,
    }),
  ],
  server: {
    port: 8001,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    cors: true,
  },
  build: {
    target: 'esnext',
    lib: {
      entry: 'src/main.tsx',
      formats: ['es'],
      fileName: 'uc',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router-dom', 'zustand'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM',
          zustand: 'Zustand',
        },
      },
    },
  },
});
