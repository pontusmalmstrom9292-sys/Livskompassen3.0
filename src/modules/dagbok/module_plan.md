# dagbok — module plan

## Overview

Personal diary / check-in journal. Referenced in Firestore types (`CheckIn`, `routines`) but no frontend module yet.

## Files

| Path | Role |
|------|------|
| _(none yet)_ | Planned: daily entries, mood, micro-wins |

## Status

| Area | Status |
|------|--------|
| UI | **missing** |
| Types | **partial** — `CheckIn`, `Routine` in `core/types/firestore.ts` |
| Firestore collections | **defined** — `checkins`, `routines` |

## Dependencies

- `core/types/firestore`
- `core/store`
- Future Firestore or Data Connect SDK

## Next steps

1. Create `components/DagbokPage.tsx` with single-entry form (progressive disclosure).
2. Persist check-ins to Firestore with server timestamps.
3. Link from FloatingDock Sprout or dedicated tab.

## Security notes

- Journal entries are highly sensitive — encrypt at rest (CMEK), strict uid rules.
- Zero Footprint: optional ephemeral draft mode before save.
