import { defineConfig } from 'vite';
import { resolve } from 'path';

const repoName = 'nolasco-constructor-llc';

const pages = ['index', 'services', 'about', 'work', 'contact', '404'].reduce((acc, name) => {
  acc[name] = resolve(__dirname, `${name}.html`);
  return acc;
}, {});

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    rollupOptions: {
      input: pages,
    },
  },
});
