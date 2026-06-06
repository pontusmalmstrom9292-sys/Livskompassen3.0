# De 3 Kompasserna (Kompasser)

**Kanonisk kod:** `src/modules/features/dailyLife/wellbeing/compasses/`  
**Route:** `/vardagen?tab=kompasser` · **Legacy:** `/kompasser` → `/vardagen` · **AuthGate:** ja  
**Spec:** [`docs/specs/modules/De-3-Kompasserna-SPEC.md`](../../docs/specs/modules/De-3-Kompasserna-SPEC.md)  
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

- **Aktiv:** `/vardagen?tab=kompasser` → `DashboardPage` (AuthGate)
- **Redirect:** `/kompasser`, `/liv` → `/vardagen`

## 3. UX (MVP done)

- Tids-default vid öppning Kompasser-flik (`getDefaultCompassByTime`)
- Morgon/dag/kväll-flikar, fri navigering
- Paralys manuell + *Ge mig 3 till* + Klar
- KASAM kväll 3 steg
- Crazymaking-broar (Speglar, Valv, MåBra, Barnen)

## 4. Backend

| Komponent | Status |
|-----------|--------|
| `saveCheckIn` | **done** |
| `breakDownResponse` | **done** |
| Paralys UI | **done** |
| KASAM UI | **done** |

## 5. Status

| Area | Status |
|------|--------|
| MVP *kör kompasser* | **done** |
| Notiser push | **planned** fas 2 |
| Sanningens Ankare från valv | **planned** |

Kod: `src/modules/features/dailyLife/wellbeing/compasses/` · Smoke: `npm run smoke:compass`
