import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: '/index.html', // Auto-opens in browser
  },
  base: './', // Ensures relative asset paths in production build
  build: {
    outDir: 'dist', // Default, but can be customized
    assetsDir: 'assets', // Default
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Increase warning limit from the default 500 KB
        chunkFileNames: 'assets/index-HdLe7Cw2.js',
        manualChunks: undefined,
      },
    },
    chunkSizeWarningLimit: 1500, // in KB (e.g. 1500 KB = 1.5 MB)
    },
})
