# De 3 Kompasserna (Kompasser)

**Route:** `/vardagen` (kompasser-tab) · **Redirect:** `/kompasser` → `/vardagen`  
**AuthGate:** planerad (Vardagen öppen idag) · **Dock:** Sprout  
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
| **Dag** | Pulskompass / nödbroms + Paralys-Brytaren |
| **Kväll** | KASAM + crazymaking-bro |

## 2. Route

- **Aktiv:** `/vardagen` → `DashboardPage`
- **Redirect:** `/kompasser` → `/vardagen`
- **Planerat:** AuthGate, tids-default flik, notiser

## 3. UX

**Idag:** flikar, en fråga, pills synliga, spara.  
**Planerat:** ett steg i taget, Paralys-UI, KASAM 3 steg, crazymaking-knapp.

## 4. Design

Obsidian Calm — guld / indigo / emerald. Inga streaks, turkos, regnbåge.

## 5. Data

`checkins` WORM — se SPEC för planerade fält (`energyLevel`, `kasamData`, …).

## 6. Backend

- **done:** `saveCheckIn`, `compassFilter`, `breakDownResponse` (callable)
- **planned:** UI-koppling Paralys, Speglar kväll, crazymaking-bro

## 7. Säkerhet

Silo, WORM, Zero Footprint partial, kill switch global.

## 8. Status

| done | partial | planned |
|------|---------|---------|
| UI + save + redirect + AuthGate | progressive disclosure (morgon pills) | Notiser fas 2, Sanningens Ankare pin |
| Paralys UI + KASAM kväll + broar | | |

## Kladd 2026-05-21

- **Kladd:** Morgon/dag/kväll, KASAM, Paralys vid överväldigande — **manuell** (låst §I.1).
- **Gap:** `breakDownResponse` backend utan UI; crazymaking-bro utan auto-valv.
- **Ej här:** Ex-sms (Hamn), VIVIR (Speglar), vinst-knapp (Ekonomi).

## 9–11. AC, kopplingar, navigation

Se full SPEC §9–11.

## Kod

`src/modules/kompasser/` · [`module_plan.md`](../../src/modules/kompasser/module_plan.md)

## Nästa kod ("kör kompasser")

1. AuthGate `/vardagen`  
2. Tids-default flik  
3. Paralys UI  
4. KASAM kväll  
5. Crazymaking-bro  
6. Notiser
