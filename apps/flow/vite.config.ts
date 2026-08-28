import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';

export default defineConfig({
  plugins: [
    react(),
    qiankun({
      useDevMode: true,
    }),
  ],
  server: {
    port: 8002,
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
      fileName: 'flow',
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
