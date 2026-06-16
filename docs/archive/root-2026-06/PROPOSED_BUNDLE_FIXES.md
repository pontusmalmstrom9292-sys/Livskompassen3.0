# Proposed bundle fixes (read-only proposals)

Generated after **PHASE 6** build (`npm run build:web`, 2026-06-01).  
**Inga ändringar här är implementerade** — kräver explicit godkännande.

## Summary (measured)

| Asset | Bytes | Minified | Gzip | Over 500 KB? |
|-------|------:|---------:|-----:|:------------:|
| `dist/assets/index-DXnJoxmA.js` | 1 643 410 | **1 604.9 KB** | 448.5 KB | **Yes** |
| `dist/assets/index-DZW1DBZY.css` | 201 680 | 197.0 KB | 28.4 KB | No |
| `dist/assets/web-DLj5dhoA.js` | 12 550 | 12.3 KB | 2.8 KB | No |
| `dist/index.html` | 1 280 | 1.3 KB | 0.6 KB | No |

Vite emits a **single main JS chunk** (no route-level splits). Dependency families (inferred from `package.json` + entry graph):

1. `firebase` (+ `@tanstack-query-firebase/react`)
2. `react` + `react-dom` + `react-router-dom`
3. `lucide-react`
4. `framer-motion`
5. `date-fns`, `clsx`, `tailwind-merge`
6. `@capacitor/*` (web chunk `web-*.js`)

---

## PR-ready patch A — lazy routes (recommended first)

**Goal:** Split ~400–800 KB from main chunk without changing product behavior.

```diff
--- a/src/modules/core/routing/AppRoutes.tsx
+++ b/src/modules/core/routing/AppRoutes.tsx
@@ -1,6 +1,7 @@
-import { Routes, Route, Navigate } from 'react-router-dom';
+import { lazy, Suspense } from 'react';
+import { Routes, Route, Navigate } from 'react-router-dom';
 // …existing imports for light shells only…

+const VaultPage = lazy(() =>
+  import('@/features/lifeJournal/evidence/vault').then((m) => ({ default: m.VaultPage })),
+);
+const ProjektHubPage = lazy(() =>
+  import('@/features/admin/projects').then((m) => ({ default: m.ProjektHubPage })),
+);
+// Repeat for DossierPage, BarnportenPage, PlaneringPage as needed.

 export function AppRoutes() {
   return (
+    <Suspense fallback={<div className="p-6 text-text-dim">Laddar…</div>}>
     <Routes>
       {/* wrap heavy <Route element={…} /> with lazy components */}
     </Routes>
+    </Suspense>
   );
 }
```

**Acceptance:** `npm run build:web` → multiple `dist/assets/*.js` chunks; main `index-*.js` &lt; 1 200 KB.

---

## PR-ready patch B — `manualChunks` (caching, not smaller total)

**Goal:** Long-term cache for vendors; repeat visits faster.

```diff
--- a/vite.config.ts
+++ b/vite.config.ts
@@ export default defineConfig({
   plugins: [react()],
+  build: {
+    rollupOptions: {
+      output: {
+        manualChunks(id) {
+          if (id.includes('node_modules/firebase')) return 'vendor-firebase';
+          if (id.includes('node_modules/react-dom')) return 'vendor-react';
+          if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
+          if (id.includes('node_modules/framer-motion')) return 'vendor-motion';
+        },
+      },
+    },
+  },
 });
```

**Acceptance:** `dist/assets/vendor-firebase-*.js`, `vendor-react-*.js` present; warning may remain on largest chunk until patch A.

---

## PR-ready patch C — Capacitor tree-shake (web builds)

```diff
--- a/src/modules/core/auth/nativeGoogleAuth.ts
+++ b/src/modules/core/auth/nativeGoogleAuth.ts
@@
-import { … } from '@capacitor/…';
+// dynamic import inside `if (Capacitor.isNativePlatform())` only
```

**Acceptance:** `web-*.js` shrinks or merges away on pure hosting build.

---

## Warning — CSS `index-*.css` (197 KB)

- Audit Tailwind `content` globs include `src/modules/features/**`.
- Defer `/dev/*` theme lab CSS if safelist bloat is found.

---

## Optional tooling

After approval: `npx vite-bundle-visualizer` or `rollup-plugin-visualizer` to replace inferred list with treemap.
