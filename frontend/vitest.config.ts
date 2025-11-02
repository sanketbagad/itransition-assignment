/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    pool: 'forks',
    watch: false,
    maxConcurrency: 1,
    testTimeout: 10000,
    hookTimeout: 10000,
    fileParallelism: false,
    isolate: true,
  },
  optimizeDeps: {
    include: [
      '@mui/material',
      '@testing-library/react',
      '@testing-library/user-event',
    ],
    exclude: ['@mui/icons-material/esm'],
  },
  esbuild: {
    target: 'node14',
  },
  resolve: {
    alias: {
      '@mui/icons-material/esm': '@mui/icons-material',
    },
  },
});
