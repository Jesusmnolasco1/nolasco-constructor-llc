import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        services: resolve(import.meta.dirname, 'services.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        work: resolve(import.meta.dirname, 'work.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
});
