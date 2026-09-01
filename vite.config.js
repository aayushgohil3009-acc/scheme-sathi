import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Let Vite split the lazy Spline import into its own on-demand chunk.
      }
    },
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    reportCompressedSize: false,
    sourcemap: false,
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  }
})
