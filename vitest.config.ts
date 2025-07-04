/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/frontend/setup.ts'],
    globals: true,
    css: true,
    include: ['tests/frontend/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['server/**/*', 'tests/backend/**/*'],
  },
});