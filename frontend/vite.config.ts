import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    //host: true,
    //port: 5173,
    /*proxy: {
      '/api': 'http://xxx.xxx.x.xx:8080'
    }*/
    proxy: {
      '/api': 'http://localhost:8080',
    }
  }
})