import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const root = path.resolve(__dirname, './src')

// Mirrors tsconfig.json / tsconfig.app.json `paths` (order: specific before `@`).
// https://vite.dev/config/shared-options.html#resolve-alias
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Livskompassen',
        short_name: 'Kompassen',
        description: 'Din digitala livskompass för reflektion och insikt.',
        theme_color: '#050b14',
        background_color: '#050b14',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/firebase')) return 'vendor-firebase';
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion';
          if (id.includes('node_modules/react-dom')) return 'vendor-react';
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
          if (id.includes('node_modules/date-fns')) return 'vendor-dates';
          if (id.includes('node_modules/zustand')) return 'vendor-state';
          if (id.includes('node_modules/@radix-ui')) return 'vendor-radix';
        },
      },
    },
  },
  resolve: {
    alias: [
      {
        find: /^@economy\/(.+)/,
        replacement: `${path.resolve(__dirname, 'shared/economy')}/$1`,
      },
      { find: '@/core', replacement: path.join(root, 'modules/core') },
      { find: '@/shared', replacement: path.join(root, 'modules/shared') },
      { find: '@/features', replacement: path.join(root, 'modules/features') },
      { find: '@/types', replacement: path.join(root, 'types') },
      { find: '@', replacement: root },
    ],
  },
})
