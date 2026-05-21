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

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| Obsidian Calm tokens | Ej natur/grön | Ja | **done** |
| Fyren 3s + WebAuthn hook | Valv-ingång | Ja | **done** |
| Shake-to-Kill 15 m/s² | Kill Switch | Ja | **done** |
| Gamification UI | **Avvisat** | Nej | **avvisat** |
| Zero Footprint sign-out | Kladd | Partial | **planned** |
| BodySignalChip (valv) | Text-chips idag | Nej | **planned** |
| Dold nödknapp shake | iOS PWA test | Nej | **planned** |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/specs/incoming/Kladd-2026-05-21-PERSONAL-MASTER.md)

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
