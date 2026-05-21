# De-3-Kompasserna-SPEC

**Källa:** Notebook #1–#5 (extern AI) + kodgranskning 2026-05-21.  
**Konsoliderad till:** [`.context/modules/kompasser.md`](../../.context/modules/kompasser.md)  
**Design:** [`docs/specs/design-master.md`](../design-master.md)

---

## Låsta beslut (notebook #1–#5)

| # | Beslut |
|---|--------|
| 1 | **Paralys-Brytaren:** manuell start (*"Hjälp mig börja"*). Låg energi får **föreslå** mikrosteg — ingen auto-övertagning av skärmen. |
| 2 | **Notiser:** MVP = **in-app** tids-default vid öppning. Fas 2 = **lokala ljudlösa** push max 2–3/dag. **Inte** FCM i första bygget. |
| 3 | **Crazymaking:** **bro/knapp only** till Valv/Speglar. **Ingen** auto-skriv till `reality_vault`. |
| 4 | **`checkins`:** **WORM** vid spara (append-only). Felskrivning = ny post — ingen edit. |
| 5 | **Missad morgon:** default **Dag** efter ~12:00. Morgon valfri. **Ingen** hard reset, **ingen** skuld/streak. |
| 6 | **Silo:** Kompass (Silo 1) skriver **aldrig** auto till `reality_vault` (Lager 2). |
| 7 | **Tidsvy:** default-flik efter klockan; **fri** navigering mellan kompasser. |
| 8 | **Dagskompass:** **egen vy** i `/vardagen` — inte flytande overlay över andra moduler. |
| 9 | **Paralys-session:** *"Ge mig 3 till"* tillåtet i samma session; Zero Footprint vid **Klar** / navigera bort. |
| 10 | **Sanningens Ankare (morgon):** MVP = Silo 1 (intention). **Ej** auto-dump från `reality_vault`. |

---

## 1. Syfte och användarbehov

Kognitivt avlastande dygnsrytm för ADHD/GAD under hypervigilans och allostatisk belastning. **Ett mikrosteg i taget** — aldrig hela dagen på en skärm.

| Kompass | Syfte |
|---------|--------|
| **Morgonkompassen** (Sacred Feature) | Intention och riktning — *Sanningens Ankare* (kuraterad, lågaffektiv) innan externt brus |
| **Dagskompassen / Pulskompassen** | Nödbroms vid akut stress — people-pleasing, vagus/landning |
| **Kvällskompassen** | KASAM (Begriplighet, Hanterbarhet, Meningsfullhet) — stäng dagen, filtrera crazymaking |

**UX-princip:** Obsidian Calm, ingen skuld vid missad kompass, inga streaks/RSD-triggers.

---

## 2. Route och ingång

| Punkt | Beslut |
|-------|--------|
| **Primär route** | `/vardagen` (kluster Vardagen, tab kompasser) |
| **Redirect** | `/kompasser` → `/vardagen` (tom `?tab` = kompasser) |
| **Komponent** | `DashboardPage` (embedded i `VardagenPage`) |
| **AuthGate** | **done** på `/vardagen` |
| **Ingång** | FloatingDock Sprout, HomePage bento |
| **Notiser (fas 2)** | Deep-link till rätt tidskompass, max 2–3/dag |

Sub-rutter `/morgon`, `/dag`, `/kvall` — **post-MVP** (idag: flikar + tids-default).

---

## 3. UX-flöde (Progressive disclosure)

### Målbild

1. **Inträde:** Default kompass efter lokal tid (morgon ~05–11, dag ~11–17, kväll ~17–05) — användaren kan byta flik fritt.
2. **Morgon (Sacred):** Energi/intention (planerat: sliders). Ingen att-göra-lista. Valfritt förslag vid låg energi — inte auto-Paralys.
3. **Dag:** Check-in + manuell **Paralys-Brytaren** (`breakDownResponse`) — max 3 mikrosteg i taget; *"Ge mig 3 till"* i samma session.
4. **Kväll:** KASAM tre steg (planerat). Vid crazymaking-flagga: diskret bro till `/dagbok?tab=speglar` eller `/dagbok?tab=bevis` — **ingen** auto-WORM.
5. **Klar:** Spara → WORM `checkins` → validering → Zero Footprint (rensa state vid unmount / Klar / kill switch).

### Idag (kod)

[`DashboardPage.tsx`](../../../src/modules/kompasser/components/DashboardPage.tsx): flikar Morgon/Dag/Kväll, KASAM kväll, Paralys, tids-default, `saveCheckIn`. **MVP done**.

---

## 4. Visuell design (Obsidian Calm)

| Element | Token |
|---------|--------|
| Bakgrund | `#020617` |
| Yta | `#0f172a` + glass blur |
| Morgon / aktivt val | Guld `#FDE68A` |
| Fortsätt / AI | Indigo `#818CF8` |
| Spara / Klar | Emerald `#2DD4BF` |
| Typografi | Outfit + Inter |

**Förbjudet:** lila (utöver indigo), turkos, regnbåge, naturteman, count-up/streaks, röda "missad dag"-markeringar.

Paralys-läge: dimma irrelevant UI (~20% opacitet); ett mikrosteg-kort i fokus.

---

## 5. Datamodell (Firestore, WORM)

**Collection:** `checkins` — append-only (`update`/`delete`: false i [`firestore.rules`](../../../firestore.rules)).

### Idag (klient `saveCheckIn`)

| Fält | Typ | Notering |
|------|-----|----------|
| `userId` / `ownerId` | string | Auth UID |
| `questionId` | string | `compass_morning` \| `compass_day` \| `compass_evening` |
| `questionText` | string? | Frågetext |
| `optionSelected` | string | Vald pill |
| `taskCategory` | string? | `morning` \| `day` \| `evening` |
| `createdAt` | serverTimestamp | WORM |

Klient: [`firestore.ts`](../../../src/modules/core/firebase/firestore.ts).

### Planerat (utökning — bakåtkompatibel)

| Fält | Typ | Notering |
|------|-----|----------|
| `energyLevel` | number 1–5 | Morgon/dag |
| `stressLevel` | number 1–10 | Valfritt |
| `kasamData` | map | `comprehensible`, `manageable`, `meaningful` — kväll |
| `paralysisTriggered` | boolean | Paralys-session |
| `microStepsCompleted` | number | Räknare i session |

**Ej planerat:** redigering av sparad post. **Ej planerat:** auto-skriv till `reality_vault`.

---

## 6. Backend och agenter

| Del | Implementation | Status |
|-----|----------------|--------|
| **Spara check-in** | Klient `saveCheckIn` | **done** |
| **Paralys-Brytaren** | Callable `breakDownResponse` + `ParalysPanel` | **done** |
| **Speglings-Coachen** | `speglingsMirror` | **done** (bro kväll) |
| **compassFilter** | Zustand + `getDefaultCompassByTime` vid öppning | **done** |
| **Crazymaking-detektion** | Bro-UI efter KASAM | **done** — ingen auto-valv-write |
| **Minne-ingest** | Auto från `checkins` | **planned** (Kunskap-SPEC; ej MVP) |

Prompter: [`functions/src/sharedRules.ts`](../../../functions/src/sharedRules.ts).

---

## 7. Säkerhet

| Invariant | Status |
|-----------|--------|
| **Silo 1 → Lager 2** | Kompass skriver **inte** auto till `reality_vault` |
| **WORM checkins** | **done** (rules) |
| **AuthGate** | **done** (`/vardagen`) |
| **Zero Footprint** | Form state rensas vid Klar/unmount; morgon-session reset vid ny dag/logout — **partial** |
| **Kill Switch** | Global `useShakeToKill` → `/` — **done**; kompass-specifik reset **planned** |
| **CMEK** | GCP drift |
| **Notis-tak** | Max 2–3/dag — **planned** (lokal) |

Valv-bevis: behåll **Fyren 3s + PIN** (Sacred) — separat från Vardagen-inloggning.

---

## 8. Status idag vs planerat

| Område | Status |
|--------|--------|
| `DashboardPage` Morgon/Dag/Kväll | **done** |
| `saveCheckIn` → `checkins` | **done** |
| `compassFilter` synkad med flik | **done** |
| `/kompasser` → `/vardagen` redirect | **done** |
| WORM Firestore rules | **done** |
| Strikt ett steg i taget (UI) | **done** (KASAM + Paralys) |
| Tids-default flik (klocka) | **done** |
| AuthGate `/vardagen` | **done** |
| Paralys-Brytaren UI + `breakDownResponse` | **done** |
| KASAM kväll (3 steg) | **done** |
| Crazymaking-bro (ej auto-valv) | **done** |
| Notiser in-app → lokal push | **planned** fas 2 |
| Kväll → Måbra / Barnen | **done** |
| `checkins` → `kampspar` | **planned** |
| Sanningens Ankare (morgon, read-only preview) | **planned** |

---

## 9. Acceptanskriterier

| # | Kriterium | Kod |
|---|-----------|-----|
| 1 | Max en primär fråga/interaktion synlig (mikrosteg ett i taget vid Paralys) | **done** |
| 2 | Paralys returnerar mikrosteg; *"Ge mig 3 till"* fungerar i session | **done** |
| 3 | Crazymaking = **knapp** till Valv/Speglar — ingen auto-WORM | **done** |
| 4 | `saveCheckIn` WORM — ingen frontend-edit efter spara | **done** |
| 5 | Zero Footprint vid Klar / unmount från kompass | **done** |
| 6 | Default flik efter tid; missad morgon utan skuld | **done** |
| 7 | ≤3 notiser per kalenderdygn (fas 2) | **planned** |
| 8 | Kompass isolerad från `reality_vault` utan explicit användarval | **done** (ingen auto-write) |

---

## 10. Kopplingar till andra moduler

| Modul | Koppling |
|-------|----------|
| **Verklighetsvalvet** | Crazymaking-bro — användaren sparar bevis **explicit** |
| **Speglar** | Alternativ bro vid känsla vs fakta |
| **Måbra** | Låg energi dag/kväll — valfri länk efter kväll |
| **Barnen** | Kväll — valfri påminnelse om livslogg (ej tvång) |
| **Kunskap / Minne** | Historiska `checkins` → RAG (planerat, ej MVP) |
| **Dossier** | `checkins` kan ingå i framtida export — ej MVP |

---

## 11. Navigation

- **Kluster:** Vardagen (`ClusterGrid`)
- **Dock:** Sprout → `/vardagen`
- **Redirect:** `/kompasser` → `/vardagen`
- **Planerat:** dölj synliga flikar; tidsstyrd en-vy; notis deep-links

Se [`docs/specs/navigation-master.md`](../navigation-master.md).

---

## 12. Tidigare diskussioner att bevara

- Morgonkompassen sätter riktning **innan** ex-bruset — Sacred, kravlös.
- **Future discounting:** inga rigida scheman; dynamisk dagsform (PDA-vänligt).
- Morgon **inga** aggressiva notiser vid uppvaknande.
- Paralys = externt arbetsminne, inte livscoach/JADE.
- Vagus/fysiologiska mikrosteg vid paralys (vatten, 4-7-8) före kognitiva listor.

---

## 13. Avvisade idéer

| Idé | Varför avvisad |
|-----|----------------|
| Streaks / count-up / röda "broken chain" | RSD, prestationsångest |
| Strikta klockslag (morgon stängd kl 10) | Straffar oregelbunden dygnsrytm |
| Auto Paralys vid stress >8 | Hypervigilans, falska larm |
| Hard reset morgon kl 12 | Skuld |
| Auto-kopiera kompass-text till `reality_vault` | Bryter Silo + WORM + explicit trigger |
| Flytande dagskompass över hela appen | Kognitivt brus |
| FCM-notiser i MVP | Integritet/komplexitet — lokal först |
| `checkins` redigerbar samma dag | Bryter WORM-invariant |
| Turkos/regnbåge UI | Bryter design-master |
| Stjärnbilder / gamification | Kladd §G — avvisat |
| Paralys auto vid lågt humör | Kladd §I.1 — **avvisat**; manuell knapp |
| Livs-Coachen i Ekonomi | Kladd routing — avvisat |

## 14. Kladd-synk (2026-05-21)

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](./Kladd-2026-05-21-PERSONAL-MASTER.md) §F, §I.

| Kladd | Kod |
|-------|-----|
| Morgon/dag/kväll + checkins | **done** |
| Paralys UI | **done** |
| KASAM kväll | **done** |
| Crazymaking-bro (ej auto-valv) | **done** |

---

## Implementera ("kör kompasser")

**MVP done** (2026-05-21). Smoke: `npm run smoke:compass`.

**Nästa fas:**

1. Notiser (lokal push max 2–3/dag)
2. Sanningens Ankare från valv (read-only preview)
3. `checkins` → `kampspar` (Kunskap, ej MVP)
