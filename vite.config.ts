import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = path.resolve(__dirname, './src')

// Mirrors tsconfig.json / tsconfig.app.json `paths` (order: specific before `@`).
// https://vite.dev/config/shared-options.html#resolve-alias
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/firebase')) return 'vendor-firebase';
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion';
        },
      },
    },
  },
  resolve: {
    alias: [
      { find: '@/core', replacement: path.join(root, 'modules/core') },
      { find: '@/shared', replacement: path.join(root, 'modules/shared') },
      { find: '@/features', replacement: path.join(root, 'modules/features') },
      { find: '@/types', replacement: path.join(root, 'types') },
      { find: '@', replacement: root },
    ],
  },
})
