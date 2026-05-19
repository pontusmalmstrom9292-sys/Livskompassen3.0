# core — module plan

## Overview

Shared shell: layout chrome, design-system UI, global Zustand store, Firebase client init, and cross-cutting Firestore type definitions.

## Files

| Path | Role |
|------|------|
| `layout/MainLayout.tsx` | App shell — header, main area, floating Kompis |
| `layout/FloatingDock.tsx` | Bottom navigation dock |
| `layout/SubSynapticBackground.tsx` | Animated background (not yet wired into layout) |
| `ui/BentoCard.tsx` | Bento grid card primitive |
| `store/index.ts` | Global UI/auth/system state |
| `firebase/init.ts` | Firebase app + Functions (europe-west1) |
| `types/firestore.ts` | Shared collection schemas |

## Status

| Area | Status |
|------|--------|
| MainLayout + FloatingDock | **works** — renders on home |
| SubSynapticBackground | **partial** — built, unused in MainLayout |
| BentoCard | **works** — used by all feature modules |
| Store | **partial** — defined; not yet consumed by pages |
| Firebase init | **works** — env vars with fallbacks |

## Dependencies

- `kompis` (MainLayout imports KompisAvatar)
- `firebase`, `zustand`, `framer-motion`, `lucide-react`

## Next steps

1. Wire `SubSynapticBackground` into `MainLayout`.
2. Connect `useStore` compass filter + vault unlock to Verklighetsvalvet and FloatingDock.
3. Add auth listener and Zero Footprint `resetState` on sign-out.

## Security notes

- Firebase config uses `import.meta.env` — never commit `.env` with real keys.
- Store holds `isVaultUnlocked`; must clear on session end (Zero Footprint).
