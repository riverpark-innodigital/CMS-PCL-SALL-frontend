import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: false, // Disable source maps
    rollupOptions: {
      output: {
        manualChunks: undefined, // Reduce code splitting if excessive
      },
    },
  },
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
        port: 5173,
        clientPort: 5173,
        host: 'localhost'
    }
  },
})
