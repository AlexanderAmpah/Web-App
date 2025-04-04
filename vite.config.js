import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: '/index.html', // Auto-opens in browser
  },
  base: '/', // Ensures relative asset paths in production build
  build: {
    outDir: 'dist', // Default, but can be customized
    assetsDir: 'assets', // Default
    emptyOutDir: true,
  },
})
