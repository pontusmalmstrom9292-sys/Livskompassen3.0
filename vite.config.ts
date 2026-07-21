import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const root = path.resolve(__dirname, './src')

// Mirrors tsconfig.json / tsconfig.app.json `paths` (order: specific before `@`).
// https://vite.dev/config/shared-options.html#resolve-alias
function stripAppCheckDebugTokenInProduction(mode: string) {
  return {
    name: 'livskompassen-strip-appcheck-debug-token',
    config() {
      if (mode === 'production') {
        // Highest priority for Vite env resolution — empty wins over .env file.
        process.env.VITE_APP_CHECK_DEBUG_TOKEN = ''
      }
    },
    generateBundle(_options: unknown, bundle: Record<string, { type: string; code?: string }>) {
      if (mode !== 'production') return
      const leak = /VITE_APP_CHECK_DEBUG_TOKEN\s*:\s*[`'"]([^`'"]+)[`'"]/
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'chunk' || !chunk.code) continue
        const match = chunk.code.match(leak)
        if (match?.[1]?.trim()) {
          throw new Error(
            `[vite] App Check debug token leaked into ${fileName}. Refusing production build.`,
          )
        }
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  if (mode === 'production') {
    process.env.VITE_APP_CHECK_DEBUG_TOKEN = ''
  }

  return {
    // Prod Hosting/APK-web: never embed App Check debug token (even if present in .env).
    // Debug-APK uses BuildConfig + AppCheckDebugBootstrap instead.
    define:
      mode === 'production'
        ? { 'import.meta.env.VITE_APP_CHECK_DEBUG_TOKEN': JSON.stringify('') }
        : undefined,
    plugins: [
      stripAppCheckDebugTokenInProduction(mode),
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        workbox: {
          navigateFallbackDenylist: [/^\/__\/auth\//],
        },
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
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/firebase')) return 'vendor-firebase'
            if (id.includes('node_modules/framer-motion')) return 'vendor-motion'
            if (id.includes('node_modules/react-dom')) return 'vendor-react'
            if (id.includes('node_modules/lucide-react')) return 'vendor-icons'
            if (id.includes('node_modules/date-fns')) return 'vendor-dates'
            if (id.includes('node_modules/zustand')) return 'vendor-state'
            if (id.includes('node_modules/@radix-ui')) return 'vendor-radix'
            // Route-split wave: deterministic zone entry chunks (Familjen + Valv + Vardagen + Hjärtat).
            if (
              id.includes('/modules/core/pages/ValvetRoutePage.tsx') ||
              id.includes('/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx')
            ) {
              return 'zone-valv'
            }
            if (id.includes('/modules/core/pages/FamiljenPage.tsx')) return 'zone-familjen'
            if (id.includes('/modules/core/pages/VardagenRoutePage.tsx')) return 'zone-vardagen'
            if (id.includes('/modules/core/pages/HjartatRoutePage.tsx')) return 'zone-hjartat'
            // Admin + Oracle — separate from zone hubs (lazy-routes-admin-oracle)
            if (id.includes('/modules/features/admin/planning/')) return 'zone-planering'
            if (id.includes('/modules/features/admin/projects/')) return 'zone-projects'
            if (id.includes('/modules/oracle/')) return 'zone-oracle'
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
  }
})
