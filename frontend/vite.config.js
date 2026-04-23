import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // No proxy needed — HF Space is a public external URL
    // Set VITE_API_URL in .env.local for local dev pointing to local FastAPI
  }
})
