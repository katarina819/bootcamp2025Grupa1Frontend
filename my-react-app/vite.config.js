import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log('Loaded env:', env)

  return {
    plugins: [react()],
    server: {
      port: 5172,
      proxy: {
  '/api': {
    target: env.VITE_API_URL,
    changeOrigin: true,
    secure: false,
  }
}
    }
  }
})
