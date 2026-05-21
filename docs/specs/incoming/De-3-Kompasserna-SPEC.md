# De-3-Kompasserna-SPEC

Källa: extern planerings-AI. Konsoliderad till `.context/modules/kompasser.md`.

## 1. Syfte och användarbehov

Kognitiva stödhjul över dygnet — motverka stress och manipulativa loopar. Ett mikrosteg i taget (ADHD-anpassat).

| Kompass | Syfte |
|---------|--------|
| **Morgonkompassen** (Sacred Feature) | Intention och riktning — Sanningens Ankare innan externt brus |
| **Dagskompassen** | Nödbroms vid akut konflikt — bryter people-pleasing |
| **Kvällskompassen** | Nedvarvning och KASAM — filtrera crazymaking, stäng dagen |

## 2. Route och ingång

- **Route:** `/kompasser` (AuthGate **planerad** — route är öppen idag)
- **Sub-rutter planerade:** `/morgon`, `/dag`, `/kvall` — **ej implementerade**; flikar på `/kompasser` idag
- **Ingång idag:** FloatingDock Sprout, HomePage bento
- **Planerat:** schemalagda push-notiser (max 2–3/dag)

## 3. UX-flöde (Progressive Disclosure)

**Spec (målbild):**

- Endast **en** fråga/interaktion i taget
- Stor "JA"/Fortsätt för nästa mikrosteg — inga checklistor
- Linjärt flöde utan sidomeny eller tillbaka under pågående inmatning

**Idag (kod):** [`DashboardPage.tsx`](../../../src/modules/kompasser/components/DashboardPage.tsx) — flikar Morgon/Dag/Kväll, en fråga + pill-alternativ, spara check-in. Alla alternativ synliga samtidigt (delvis progressive). Flikbyte tillåtet (avviker från spec).

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md)

- Bakgrund `#020617`, yta `#0f172a` + glass blur
- Guld `#FDE68A` — aktivt val
- Indigo `#818CF8` — Fortsätt (polish: spara-knapp använder `btn-pill--success` idag)
- Emerald `#2DD4BF` — spara/klar
- Outfit + Inter
- Förbjudet: lila, turkos, regnbåge, naturteman, count-up

## 5. Datamodell (Firestore, WORM)

Collection `checkins`: append-only via Security Rules.

Fält vid save: `questionId` (`compass_morning|day|evening`), `questionText`, `optionSelected`, `taskCategory`, `userId`, `ownerId`, `createdAt`.

Klient: `saveCheckIn` i [`firestore.ts`](../../../src/modules/core/firebase/firestore.ts).

**Planerat:** kritiska manipulationsobservationer → `reality_vault` (valv/dossier).

## 6. Backend och agenter

| Agent | Koppling | Status |
|-------|----------|--------|
| **Paralys-Brytaren** | Dagskompassen — 30s mikrosteg via `breakDownResponse` | **planned** |
| **Speglings-Coachen** | Kvällskompassen — ACT vid ångest | **planned** |

Prompter i `functions/src/sharedRules.ts`; UI-koppling saknas.

## 7. Säkerhet

- AuthGate på route — **planned**
- Zero Footprint / kill switch — global `useShakeToKill` → `/`; kompass-specifik session reset **planned**
- CMEK (drift)
- App Check — **planned** (spec nämnde; ej verifierad i repo)

## 8. Status idag vs planerat

**Idag:** Morgon/Dag/Kväll-flöden, `saveCheckIn`, `compassFilter` i store synkad med aktiv flik.

**Planerat:** sub-rutter, strikt en-interaktion-i-taget, push-notiser, agent-kopplingar, AuthGate, kväll→barnen, valv-export vid crazymaking.

*(Extern spec sa "endast koncept i sharedRules" — **fel**; UI och checkins finns.)*

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | Notiser max 3/dag | **planned** |
| 2 | Max en interaktion på skärmen | **partial** — en fråga, flera pills synliga |
| 3 | Shake raderar osparad data | **partial** — global kill switch, ej kompass-specifik |
| 4 | checkins WORM (ingen edit/delete) | **done** |

## 10. Kopplingar

- **Verklighetsvalvet / Dossier** — crazymaking-noteringar från dagskompassen (planerad)
- **Barnens livsloggar** — kvällskompassen matar Balansmätare (planerad)
- **Paralys-Brytaren / Speglings-Coachen** — backend finns, UI-koppling planerad

## 11. Navigation

- **Variant A (aktiv):** Sprout i dock, en route `/kompasser` med flikar
- **Planerat:** sub-rutter + notis-deep-links; linjärt flöde utan tillbaka under inmatning
