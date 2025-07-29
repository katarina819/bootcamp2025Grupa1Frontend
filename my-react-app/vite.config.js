import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'


dotenv.config()

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5172,
    proxy: {
      '/api': {
        target: 'https://bootcamp2025grupa1.onrender.com',  // bez /api na kraju
        changeOrigin: true,
        secure: false,
      }
    }
  }
})