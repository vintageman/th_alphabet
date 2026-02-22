import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/th_alphabet/',
  plugins: [react()]
});
