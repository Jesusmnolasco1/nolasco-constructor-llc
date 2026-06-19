import { defineConfig } from 'vite';
import { resolve } from 'path';

// GitHub Pages project site — replace with the actual repository name.
// For a custom domain, change to base: '/'
const repoName = 'nolasco-constructor-llc';

const pages = ['index', 'services', 'about', 'work', 'contact', '404'].reduce((acc, name) => {
  acc[name] = resolve(__dirname, `${name}.html`);
  return acc;
}, {});

export default defineConfig({
  base: `/${repoName}/`,
  build: {
    rollupOptions: {
      input: pages,
    },
  },
});
