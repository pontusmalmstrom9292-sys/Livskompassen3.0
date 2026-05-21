# kompasser — module plan

## Overview

De 3 Kompasserna — Morgonkompassen (Sacred), Dagskompassen, Kvällskompassen. Mikro-check-ins → Firestore `checkins`.

**Route:** `/vardagen` (tab kompasser) · **Redirect:** `/kompasser` → `/vardagen`  
**Canonical:** `.context/modules/kompasser.md` · **Spec:** `docs/specs/incoming/De-3-Kompasserna-SPEC.md` (notebook #1–#5 konsoliderad, beslut låsta 2026-05-21)

## Låsta beslut (implementationsreferens)

| Beslut | Val |
|--------|-----|
| Paralys | Manuell; *"Ge mig 3 till"* i session |
| Notiser | In-app default → lokal push max 2–3/dag |
| Crazymaking | Knapp till Valv/Speglar — **ingen** auto-WORM |
| checkins | WORM append-only |
| Missad morgon | Default dag, ingen skuld |
| Silo | Ingen auto-write `reality_vault` |

## Files

| Path | Role |
|------|------|
| `components/VardagenPage.tsx` | Tab kompasser / ekonomi / kunskap |
| `components/DashboardPage.tsx` | Flikar Morgon/Dag/Kväll, fråga, pills, saveCheckIn |
| `../core/store/index.ts` | `compassFilter` — synkas med aktiv flik |
| `../core/routing/AppRoutes.tsx` | `/kompasser` redirect |
| `../core/firebase/firestore.ts` | `saveCheckIn` → `checkins` |

## Flows (DashboardPage)

| id | Label | questionId | Syfte |
|----|-------|------------|-------|
| `morning` | Morgon | `compass_morning` | Sacred — intention |
| `day` | Dag | `compass_day` | Puls / Paralys |
| `evening` | Kväll | `compass_evening` | KASAM (planerat 3 steg) |

## Status

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| Morgon/Dag/Kväll + checkins | Dygnsrytm ADHD | Ja | **done** |
| Paralys auto vid lågt humör | **Nej** — manuell | Nej | **avvisat** |
| Paralys-Brytaren UI | Master §G | Backend only | **planned** |
| KASAM kväll 3 steg | Kladd | Nej | **planned** |
| Crazymaking-bro | Ej auto-WORM | Nej | **planned** |
| AuthGate + tids-default | Kladd | Nej | **planned** |
| Notiser 2–3/dag | In-app först | Nej | **planned** |
| Bro Måbra/Barnen kväll | Kladd | Nej | **planned** |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/specs/incoming/Kladd-2026-05-21-PERSONAL-MASTER.md)

## Dependencies

- `core/ui/BentoCard`, chip-stilar
- `functions:breakDownResponse`, `speglingsMirror` (UI ej kopplad)

## Security notes

- Check-in uid-scoped — Firestore `isOwnerCreate`
- AuthGate på Vardagen — **planned**
- Ingen auto-skriv till `reality_vault`

## Nästa fas (när användaren säger *kör kompasser*)

1. AuthGate på `/vardagen`  
2. Tids-default kompass + valfritt dolda flikar  
3. Paralys-Brytaren UI + *Ge mig 3 till*  
4. KASAM kväll  
5. Crazymaking-bro  
6. Notiser (in-app → lokal push)
