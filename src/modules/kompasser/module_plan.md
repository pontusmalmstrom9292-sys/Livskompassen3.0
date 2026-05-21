# kompasser — module plan

## Overview

De 3 Kompasserna — Morgonkompassen (Sacred), Dagskompassen, Kvällskompassen. Mikro-check-ins → Firestore `checkins`.

Route: `/kompasser` · Canonical: `.context/modules/kompasser.md` · Spec: `docs/specs/incoming/De-3-Kompasserna-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/DashboardPage.tsx` | Flikar Morgon/Dag/Kväll, fråga, pills, saveCheckIn |
| `../core/store/index.ts` | `compassFilter` — synkas med aktiv flik |
| `../core/firebase/firestore.ts` | `saveCheckIn` → `checkins` |

## Flows (DashboardPage)

| id | Label | questionId | Syfte |
|----|-------|------------|-------|
| `morning` | Morgon | `compass_morning` | Mikrosteg lugn start |
| `day` | Dag | `compass_day` | Kropp/puls |
| `evening` | Kväll | `compass_evening` | Stäng dagen (KASAM) |

## Status

| Area | Status |
|------|--------|
| Morgon/Dag/Kväll flikar + spara | **done** |
| saveCheckIn → `checkins` | **done** |
| WORM Firestore rules | **done** |
| compassFilter i store | **done** — synkas vid flikbyte |
| AuthGate på route | **planned** |
| Sub-rutter `/morgon` `/dag` `/kvall` | **planned** |
| Strikt en-interaktion-i-taget | **partial** |
| Push-notiser 2–3/dag | **planned** |
| Paralys-Brytaren (`breakDownResponse`) | **planned** |
| Speglings-Coachen kväll | **planned** |
| Kväll → Barnen Balansmätare | **planned** |
| Crazymaking → reality_vault | **planned** |
| Fortsätt indigo (design-master) | **partial** — spara använder success-stil |

## Dependencies

- `core/ui/BentoCard`, chip-stilar
- Backend: `breakDownResponse`, `speglingsMirror` (ej kopplade i UI)

## Security notes

- Check-in data uid-scoped — Firestore rules `isOwnerCreate`
- Route saknar AuthGate idag — bör läggas till före prod

## Nästa fas (implementera när användaren säger kör)

1. AuthGate på `/kompasser`  
2. Wizard: ett pill i taget + indigo Fortsätt  
3. Koppla Paralys-Brytaren vid dagskompass  
4. Notiser (FCM eller lokal schema)  
