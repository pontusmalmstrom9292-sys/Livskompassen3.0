# kompasser — module plan

## Overview

Daily compass UI: Morgonkompassen (intention), Dagskompassen (pulse/brake), Kvällskompassen (KASAM). Dashboard shows three focus bento cards as entry point.

## Files

| Path | Role |
|------|------|
| `components/DashboardPage.tsx` | Dagens Fokus, Välmående, Ekonomi summary cards |

## Status

| Area | Status |
|------|--------|
| Dashboard bento grid | **works** — static placeholder copy |
| Compass time filter | **partial** — `useStore.compassFilter` defined, unused |
| Morgon/Dag/Kväll flows | **missing** |

## Dependencies

- `core/ui/BentoCard`
- `core/store` (compassFilter — future)

## Next steps

1. Wire FloatingDock Sprout/Map icons to compass modes.
2. Implement one micro-step picker for Morgonkompassen.
3. Filter dashboard content by `compassFilter` (morning/day/evening).

## Security notes

- Check-in data (`CheckIn` type in core) is user-scoped — enforce Firestore rules per uid.
