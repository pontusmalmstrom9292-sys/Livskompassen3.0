# De 3 Kompasserna (Kompasser)

**Route:** `/vardagen` (kompasser-tab) · **Redirect:** `/kompasser` → `/vardagen`  
**AuthGate:** **done** på `/vardagen` · **Dock:** Sprout  
**Spec:** [`docs/specs/incoming/De-3-Kompasserna-SPEC.md`](../../docs/specs/incoming/De-3-Kompasserna-SPEC.md) (notebook #1–#5, beslut låsta 2026-05-21)  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md)

---

## Låsta beslut (sammanfattning)

Paralys **manuell**. Notiser **in-app först**, lokal push max 2–3/dag. Crazymaking **bro only** — ingen auto-`reality_vault`. `checkins` **WORM**. Missad morgon **ingen skuld**. Silo 1 skriver **inte** auto till Valv.

---

## 1. Syfte

Dygnsrytm (morgon/dag/kväll) — ett mikrosteg i taget för ADHD/GAD.

| Kompass | Roll |
|---------|------|
| **Morgon** (Sacred) | Intention — Sanningens Ankare (Silo 1 MVP) |
| **Dag** | Pulskompass + Paralys-Brytaren |
| **Kväll** | KASAM 3 steg + crazymaking-bro |

## 2. Route

- **Aktiv:** `/vardagen` → `DashboardPage` (AuthGate)
- **Redirect:** `/kompasser` → `/vardagen`
- **Planerat:** Notiser fas 2 (lokal push)

## 3. UX (MVP done)

- Tids-default vid öppning Kompasser-flik (`getDefaultCompassByTime`)
- Morgon/dag/kväll-flikar, fri navigering
- Paralys manuell + *Ge mig 3 till* + Klar
- KASAM kväll 3 steg
- Crazymaking-broar (Speglar, Bevis, Måbra, Barnen)
- Morgon låg energi: *Vill du ha ett mikrosteg?* (diskret, ej auto)

## 4. Design

Obsidian Calm — guld / indigo / emerald. Inga streaks, turkos, regnbåge.

## 5. Data

`checkins` WORM — `taskNote` för KASAM JSON på kväll.

## 6. Backend

| Komponent | Status |
|-----------|--------|
| `saveCheckIn` | **done** |
| `breakDownResponse` | **done** |
| Paralys UI | **done** |
| KASAM UI | **done** |

## 7. Säkerhet

Silo, WORM, Zero Footprint (session clear), kill switch global.

## 8. Status

| Area | Status |
|------|--------|
| MVP *kör kompasser* | **done** |
| Notiser push | **planned** fas 2 |
| Sanningens Ankare från valv | **planned** |

Kod: `src/modules/kompasser/`. Smoke: `npm run smoke:compass`.
