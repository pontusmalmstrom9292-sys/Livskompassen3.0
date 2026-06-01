import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/core': path.resolve(__dirname, './src/modules/core'),
      '@/shared': path.resolve(__dirname, './src/modules/shared'),
      '@/features': path.resolve(__dirname, './src/modules/features'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})
