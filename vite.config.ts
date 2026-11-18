import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from https://lseper.github.io/signet-arts/ on GitHub Pages.
export default defineConfig({
  base: '/signet-arts/',
  plugins: [react()],
});
