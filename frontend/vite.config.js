import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // <--- 2. Set the alias
    },
  },
  server: {
    proxy: {
      // Proxy requests starting with '/api'
      '/api': {
        // Target your backend server running on port 5000
        target: 'http://127.0.0.1:5000', 
        // Important: Rewrite the host header to the target's URL
        changeOrigin: true, 
        // Optional: pathRewrite: { '^/api': '' } - only needed if your backend doesn't expect '/api'
      }
    }
  }
})
