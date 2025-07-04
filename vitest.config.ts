/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/frontend/setup.ts'],
    globals: true,
    css: true,
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['tests/backend/**/*'],
  },
});