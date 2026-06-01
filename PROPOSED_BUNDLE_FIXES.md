# Proposed bundle fixes (read-only proposals)

Generated after path-alias PHASE 4 build (`npm run build:web`, 2026-06-01).  
**Inga ändringar här är implementerade** — kräver explicit godkännande.

## Summary

| Chunk | Size (minified) | Over 500 KB? |
|-------|-----------------|--------------|
| `dist/assets/index-DXnJoxmA.js` | ~1 604 KB | Yes |
| `dist/assets/index-DZW1DBZY.css` | ~197 KB | No |
| `dist/assets/web-DLj5dhoA.js` | ~12 KB | No |

Vite emits a **single main JS chunk** (no route-level splits today). Top bundled dependency families (inferred from `package.json` + app entry graph):

1. `firebase` (+ `@tanstack-query-firebase/react`, auth/firestore call sites)
2. `react` + `react-dom` + `react-router-dom`
3. `lucide-react` (icon barrel imports across modules)
4. `framer-motion` (animations)
5. `date-fns`, `clsx`, `tailwind-merge`
6. `@capacitor/*` (web build still resolves some Capacitor entry points)

---

## Warning 1 — `dist/assets/index-*.js` (~1 604 KB)

**Contains (likely):** Firebase SDK, React tree, all hub pages (Valv, Familjen, Liv, Dagbok, …) eagerly imported from `AppRoutes` / `MainLayout`.

**Proposed actions:**

- Add `React.lazy` + `Suspense` per heavy route in `src/modules/core/routing/AppRoutes.tsx` (Vault, Dossier, Projekt, Barnporten, shell pages).
- Split `manualChunks` in `vite.config.ts`: `vendor-firebase`, `vendor-react`, `vendor-ui` to improve caching (does not reduce total bytes, helps repeat visits).
- Audit `firebase` imports — use modular SDK entry points only (`firebase/auth`, `firebase/firestore`) and avoid `firebase/compat`.

---

## Warning 2 — CSS bundle `index-*.css` (~197 KB)

**Contains:** Tailwind + app design tokens (Obsidian Calm).

**Proposed actions:**

- Enable Tailwind content purge audit if any safelist bloat exists.
- Defer non-critical theme CSS on `/dev/*` routes only (low priority).

---

## Warning 3 — Capacitor chunk `web-*.js` (~12 KB)

**Contains:** Capacitor web runtime fragments.

**Proposed actions:**

- Dynamic-import Capacitor plugins only inside `src/modules/core/auth/nativeGoogleAuth.ts` (Android path) so web-only builds tree-shake more aggressively.

---

## Next step (optional tooling)

Run `rollup-plugin-visualizer` or `vite-bundle-visualizer` once approved to replace inferred dependency list with exact module treemap.
