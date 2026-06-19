import { defineConfig } from 'vite';
import { resolve } from 'path';

const pages = ['index', 'services', 'about', 'work', 'contact', '404'].reduce((acc, name) => {
  acc[name] = resolve(__dirname, `${name}.html`);
  return acc;
}, {});

export default defineConfig({
  build: {
    rollupOptions: {
      input: pages,
    },
  },
});
