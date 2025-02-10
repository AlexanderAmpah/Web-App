import { defineConfig } from 'vite';

export default defineConfig({
  // root: 'static', // Serve files from the 'static' folder
  server: {
    open: '/static/index.html', // Open this page on startup
  },
});
