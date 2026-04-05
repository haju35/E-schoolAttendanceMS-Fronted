import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],                    // Enable Vue support
  resolve: {
    alias: {
      '@': '/src',                     // @ alias for src directory
    },
  },
  server: {
    port: 3000,                        // Development server port
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Proxy API requests to Laravel
        changeOrigin: true,
      },
    },
  },
})