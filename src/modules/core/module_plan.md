# core — module plan

## Overview

Shared shell: layout chrome, design-system UI, global Zustand store, Firebase client init, and cross-cutting Firestore type definitions.

## Files

| Path | Role |
|------|------|
| `layout/MainLayout.tsx` | App shell — header, main area, floating Kompis |
| `layout/FloatingDock.tsx` | Bottom navigation dock |
| `layout/AmbientBackground.tsx` | Obsidian gradient + blur blobs |
| `layout/SubSynapticBackground.tsx` | Re-export AmbientBackground (deprecated alias) |
| `ui/index.ts` | Design system barrel export |
| `ui/BentoCard.tsx` | Glass card primitive |
| `ui/StepIndicator.tsx` | Wizard steg-rad (guld/emerald) |
| `ui/PinGate.tsx` | PIN unlock/setup |
| `ui/TimelineEntry.tsx` | Tidslinje-rad |
| `ui/TabBar.tsx` | Tab-växlare |
| `ui/MetricTile.tsx` / `SaldoHero.tsx` | Siffror utan grafer |
| `ui/EmptyState.tsx` | Tom lista |
| `ui/AlertBanner.tsx` / `StatusBadge.tsx` | Varning + WORM/locked/AI |
| `ui/tokens.ts` | DESIGN + BUTTON_VARIANTS |
| `utils/truncateText.ts` | Delad text-trunkering |
| `store/index.ts` | Global UI/auth/system state |
| `firebase/init.ts` | Firebase app + Functions (europe-west1) |
| `types/firestore.ts` | Shared collection schemas |

## Status

| Area | Status |
|------|--------|
| MainLayout + FloatingDock + AmbientBackground | **done** |
| Design system (core/ui) | **done** — audit 2026-05 |
| BentoCard + knapp-hierarki | **done** |
| Store | **partial** — defined; consumed by auth/vault |
| Firebase init | **works** — env vars with fallbacks |

## Dependencies

- `kompis` (MainLayout imports KompisAvatar)
- `firebase`, `zustand`, `framer-motion`, `lucide-react`

## Next steps

1. `BodySignalChip` för Valv magkänsel (planerat)
2. SubSynapticBackground WebGL när performance kräver det
3. Zero Footprint `resetState` audit on sign-out

## Security notes

- Firebase config uses `import.meta.env` — never commit `.env` with real keys.
- Store holds `isVaultUnlocked`; must clear on session end (Zero Footprint).
