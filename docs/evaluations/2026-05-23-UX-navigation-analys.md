# UX-inkorg-analys — Navigation, Gemini & Valv/Barnen (2026-05-23)

**Trigger:** `kör UX-inkorg-analys`  
**Master-inkorg:** [`2026-05-22-inkorg-ux-navigation.md`](./2026-05-22-inkorg-ux-navigation.md)  
**Regel:** Allt som redan är **låst** (FUNKTIONSLOCK F-01–F-08, inkorg F-V10–F-V14, F-B11–F-B12, bild+`KompisChat` par #23) **behålls och byggs ut** — inget avlägsnas, inget omklassas till “avvisat”.

---

## Sammanfattning

| Område | Verdict | Nästa byggsteg |
|--------|---------|----------------|
| Navigation L1 | **Behåll Variant C** | Finslipa mot extern Variant A (1 hub-dock, Fyren, ej 5-ikon Shield) |
| Gemini Dashboard F-01–F-08 | **Låst — runtime synkad** | Endast polish; se [`Gemini-Dashboard-FUNKTIONSLOCK.md`](../specs/incoming/Gemini-Dashboard-FUNKTIONSLOCK.md) |
| F-V10 Frågekort + känslokompass | **Lås placering Lager 1** | `/mabra` (+ valfri ingång reflektion) — **ej** Valv bevis |
| F-B11 Barnfrågor + WORM | **Bygg ut** `ChildSubLogPanel` | Frågepool + chips (utöka enum) + dynamisk sparaknapp |
| F-B12 Barnfokus | **DELVIS → utöka** | F-04 PASS; koppla observationer till `children_logs` senare |
| F-V11 Orkestern | **Lås → G19–G21** | Ny Valv-flik `orkestern` — backend delvis PASS |
| F-V12 BIFF Valv | **Lås → delad callable** | Ny Valv-flik `biff`; **behåll** `/hamn` |
| F-V13 Valv-chatt UX | **Lås → UI-tråd** | `KompisChat`-artifact → `ValvChatPanel`; backend PASS |
| F-V14 Verklighetsvalvet mock | **Lås → flikstruktur** | Sammanfläta i `VaultPage`; WORM PASS |

---

## 1. Navigation & ikonografi (källor #1–#4, #3 RTF)

### Beslut (låst av analys, ej implementation)

| Extern/Gemini | Repo | Beslut |
|---------------|------|--------|
| Variant A (5-ikon dock + Shield) | Variant C — 1 kompass-hub + Modulhub 2×2 | **Behåll C** |
| Shield som L1-ikon | Fyren 3s på Hjärtat | **Behåll Fyren** — `ModuleHubPanel.tsx:68-81` |
| Orbit (Variant B) | — | **Avvisat** (oförändrat) |
| Kontextuell ström (Variant C extern) | — | **Ej L1** — kan inspirera kort på `/`, inte ersätta dock |

**PASS (runtime):**

| Krav | Bevis |
|------|-------|
| Fyren 3s + WebAuthn gate | `useLongPress.ts:9`, `ModuleHubPanel.tsx:68-78`, `sessionService` gate |
| Modulhub 2×2 | `ModuleHubPanel.tsx`, `moduleHubConfig.ts` |
| L2 TabBar Hjärtat | `navigation-master.md` — `reflektion` \| `bevis` \| `speglar` |
| En FloatingDock-hub | `FloatingDock.tsx:91-96` — kompass, inte 5 ikoner |

**GAP (från inkorg P0, behåll som backlog):**

| Post | Label | Notering |
|------|-------|----------|
| JADE L3 i Hamn textarea | **GAP** | `JadeGuardBanner` finns i dagbok/speglar (`ReflectionStep.tsx:69`) — **inte** i `SafeHarborPage.tsx` |
| BIFF “Visa brus” progressive disclosure | **DELVIS** | `biff-triage-bait` blur alltid (`index.css:686-690`) — saknar mockens *Visa*-toggle |
| Global Safe Mode header (4-4-5) | **DELVIS** | `CognitiveLoadBar` + safe mode — Måbra har 4-7-8, inte identisk Vagus 4-4-5 global |

**Namnkrock:** Vid implementation i `navigation-master.md` — skriv **“repo Variant C = extern Variant A-intent”** (tabell i master-inkorg § Namnkrock).

---

## 2. Gemini Dashboard — F-01 till F-08 (redan låst)

**Kanon:** [`Gemini-Dashboard-FUNKTIONSLOCK.md`](../specs/incoming/Gemini-Dashboard-FUNKTIONSLOCK.md) — **ändras inte**, endast utökas av nya Valv/Barn-ID:n nedan.

| ID | Analys | Åtgärd |
|----|--------|--------|
| F-01–F-08 | PASS/DELVIS enligt FUNKTIONSLOCK | Ingen borttagning; ev. F-09 (eget svar) fortfarande **GAP** om ej i lock-fil |

**Koppling F-B12:** F-04 Barnprofilkort = **PASS** — `ChildProfileCards.tsx`, `BarnfokusBanner.tsx`, `FamiljenPage.tsx:44-45`. Mock `gemini-child-focus-ChildFocus.tsx` = **referens**, inte ersättning.

---

## 3. Låsta inkorg-funktioner — PASS/GAP per ID

### F-V10 — Dagens frågekort + Känslokompassen (bild 17–18)

**Låst intent:** Behåll flip-kort, refresh, känslokompass 3-val, kognitiva lekar — **bygg ut**.

| Krav | Runtime | Label |
|------|---------|-------|
| F-V10.1–F-V10.3 Frågekort + flip + refresh | Ingen dedikerad komponent | **GAP** |
| F-V10.4 Känslokompassen | Humör/checkin annorlunda UI | **GAP** (ny komponent) |
| F-V10.5 Grounding 5-4-3-2-1 | `GroundingExercise.tsx:9` | **PASS** |
| Frågepool | `buildAdaptiveMemoryCards` delvis | **DELVIS** — annat syfte (minneskort) |

**Placering (låst av denna analys):**

| Plats | Motivering |
|-------|------------|
| **Primär: `/mabra`** | Lager 1 — yttre lugnet, helande, kravlöst ( [`ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md`](../specs/ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md) ) |
| Sekundär: länk från `/dagbok?tab=reflektion` | Samma session, ej Valv |
| **Ej:** `/dagbok?tab=bevis` | Forensik — blandar inte med frågekort-copy |

**Design:** Mock-lila → **Obsidian Calm** vid implementation (färger ej låsta).

**Artefakter:** behåll `17-18-fragekort-*.png` + [`2026-05-23-inkorg-fragekort-valvet.md`](./2026-05-23-inkorg-fragekort-valvet.md).

---

### F-B11 — Barnen slumpfrågor → `children_logs` (bild 19)

**Låst intent:** Slumpfråga, svar, **Spara till [barn]s logg**, WORM — **bygg ut**, **MUST NOT** Kunskapsvalvet-RAG.

| Krav | Runtime | Label |
|------|---------|-------|
| F-B11.2 Barnval Arvid/Kasper | `CHILD_ALIASES`, `BarnensPage.tsx:49` | **PASS** |
| F-B11.5 WORM save | `saveChildrenLog`, `firestore.rules:49-52` | **PASS** |
| F-B11.1 Frågekort + slump | — | **GAP** |
| F-B11.3 Chips Vitals/Citat/Milstolpe/Lek | `LIVSLOGG_CATEGORIES` annan uppsättning (`constants.ts:13-18`) | **GAP** — utöka enum + labels, **ta inte bort** befintliga |
| F-B11.4 Svar under fråga | `ChildSubLogPanel` fri observation | **DELVIS** |
| Dynamisk sparaknapp | Generisk “Spara” | **GAP** |

**Datamodell:** Behåll `children_logs` — ev. fält `promptId` / `promptLabel` vid save (append-only).

**Artefakt:** `19-barnen-livsloggar-fragekort.png` — **behåll**.

---

### F-B12 — Barnfokus profilkort (kod + dashboard-04)

**Låst intent:** Banner + två kort — **bygg ut** datakoppling, inte ny route.

| Krav | Runtime | Label |
|------|---------|-------|
| F-B12.1–F-B12.3 UI copy | F-04 + `ChildProfileCards` | **PASS** |
| F-B12.4 Observationer från loggar | Statisk seed `childProfiles.ts` | **DELVIS** → P1: aggregera senaste `children_logs` |
| Mock `ChildFocus.tsx` | Ej i `src/` | **GAP** (referens) |

**Placering:** `/familjen?tab=barnfokus` — **behåll** (`familjenTabs.tsx`).

---

### F-V11 — Orkestern / Analys-hub (bild 20)

**Låst intent:** Endast bakom Fyren, tre agenter, dokumentlista, mönstersökning — **bygg ut** via **G19–G21** (öppna i [`Arkiv-GAP-REGISTER.md`](../specs/modules/Arkiv-GAP-REGISTER.md)).

| Krav | Runtime | Label |
|------|---------|-------|
| F-V11.1 Gate | `hasVaultGate`, `VaultPage.tsx:72` | **PASS** |
| Vävaren backend | `functions/src/agents/weaverAgent.ts:1-16` | **PASS** |
| WORM create-only | `firestore.rules:43-46` | **PASS** |
| F-V11.2–F-V11.4 UI + CTA | — | **GAP** → **G19**, **G20**, **G21** |
| Placering ej `/vardagen?tab=kunskap` | Kunskap = annan silo | **Låst** — korrekt i inkorg |

**Implementationsskiss (behåller alla mock-element):**

- Ny `VaultTab`: `orkestern`
- Panel: status Vävaren / Spejaren / Säkraren + lista “Registrerade dokument” + CTA → G21

**Artefakt:** `20-orkestern-analys-hub-valvet.png` — **behåll**.

---

### F-V12 — BIFF-Detektor i Valv (bild 21–22 + kod)

**Låst intent:** Egen modul **i Valvet** efter Fyren — **bygg ut**; **ta inte bort** Hamn.

| Krav | Runtime | Label |
|------|---------|-------|
| F-V12.2 Triage 10/90 | `BiffTriagePanel.tsx:12-44` | **PASS** |
| F-V12.5 Tre BIFF-svar + kopiera | `greyRockVariants.ts:8-38`, `GreyRockVariants.tsx` | **PASS** |
| F-V12.1 API | `analyzeBiffMessage` — `biffService.ts:32` | **PASS** |
| Brus maskerat default | `index.css:686-690` blur | **DELVIS** — lägg *Visa* (mock) utan att ta bort blur |
| F-V12.8 Valv egen flik | Endast `/hamn` | **GAP** |
| JADE i Valv-BIFF | Ej i Hamn-form | **GAP** — återanvänd `JadeGuardBanner` |
| Mock `BiffDetector.tsx` | Artifact | **Referens** → delad `BiffFlowPanel` |

**Beslut Hamn vs Valv:**

| Ingång | Roll |
|--------|------|
| `/hamn` | Yttre snabb ingång (F-03 TabBar) — **behåll** |
| Valv-flik `biff` | Samma flöde, gate + Zero Footprint — **ny** |

**Callable:** En — `analyzeBiffMessage` (ingen `runBiffTriage` i prod).

---

### F-V13 — Valv-chatt UX (bild 23 + `KompisChat.tsx`)

**Låst intent:** Chattbubblor, klistra in, svar från arkiv — **bygg ut UI**; backend **behåll**.

| Krav | Runtime | Label |
|------|---------|-------|
| F-V13.3 `valvChatQuery` | `valvChatService.ts:15-19` | **PASS** |
| F-V13.4 Citations | `ValvChatPanel.tsx:52-76` | **PASS** |
| F-V13.7 Zero Footprint | `useValvChatSession.ts:20-24` | **PASS** |
| F-V13.5 Chatt-UI | Textarea + “Sök” `ValvChatPanel.tsx:20-32` | **GAP** |
| Flermeddelande-tråd | En fråga → ett svar | **GAP** |
| Mock “Kompis”-header | Produktcopy valfri i Valv | **Design GAP** — Obsidian Calm |

**Implementation:** Porta layout från [`gemini-kompis-chat-KompisChat.tsx`](./artifacts/gemini-kompis-chat-KompisChat.tsx) till `ValvChatPanel` — **behåll** `valvChatQuery`; ev. utöka callable för “inklistad text”-triage (F-V13.2) = separat `kör [GAP]` om DCAP kräver ny payload.

**Artefakter låsta par:** bild 23 + TSX — **raderas inte**.

---

### F-V14 — Verklighetsvalvet mock (`RealityVault.tsx`)

**Låst intent:** Lista, nytt bevis, Svart på Vitt, WORM — **bygg ut** flikstruktur, inte ny monolit-fil.

| Krav | Runtime | Label |
|------|---------|-------|
| F-V14.6 WORM | `firestore.rules:43-46`, `saveVaultLog` | **PASS** |
| F-V14.5 two_column | `VaultEntryForm.tsx:88-96` | **PASS** |
| F-V14.3 Lista + sök | `VaultLogList`, flik `logga` | **DELVIS** |
| Enhetlig mock-UX | `VaultPage` 5 flikar (Logga/Lön/Korsref/Sök/Dossier) | **DELVIS** |
| `RealityVault.tsx` i src | Artifact only | **GAP** — migrera mönster, inte filnamn 1:1 |

**Samordning Valv-flikar (alla låsta, inget tas bort):**

```
logga | korsref | sok (F-V13 UI) | biff (F-V12) | orkestern (F-V11) | dossier | lon
```

Befintliga flikar **kvar**; nya **adderas**.

---

## 4. Gemini-prototyp & skärmdumpar (batch #6)

| Mock-funktion | Repo | Rekommendation |
|---------------|------|----------------|
| BIFF blur | CSS blur PASS | Lägg *Visa* toggle (F-V12) |
| Vagus 4-4-5 global | Måbra 4-7-8 | **DELVIS** — dokumentera skillnad, ej tvinga byte |
| Mock WORM checkbox | Riktig WORM | **PASS** — behåll riktig path |
| Korsreferens enhet | `VaultCrossReference` | **DELVIS** — F-07/F-V14 |

16 skärmdumpar: index i [`2026-05-23-inkorg-skarmdumpar.md`](./2026-05-23-inkorg-skarmdumpar.md) — **alla behålls** som referens.

---

## 5. Prioriterad byggordning (ett steg i taget för implementation)

**P0 — Låsta UX med mest användarvärde**

1. **F-V13** — Chatt-UI i `ValvChatPanel` (backend redan PASS)  
2. **F-V12** — Valv-flik BIFF (delad komponent med Hamn)  
3. **F-B11** — Frågepool + chips + dynamisk spara i Barnen  

**P1 — Valv fördjupning**

4. **F-V11 / G19** — Orkestern-flik (minst Vävaren-status + lista)  
5. **F-V14** — Flik/copy-align `VaultPage` mot mock (utan monolit)  
6. **F-V10** — Frågekort på `/mabra`  

**P2 — GAP-register backend**

7. **G20** — Batch SMS/orosanmälan  
8. **G21** — Mönstersökning-knapp  
9. **F-B12.4** — Profilkort ← `children_logs`  

**P0 navigation (inkorg legacy)**

- JADE i `SafeHarborPage`  
- Eventuell *Visa brus*-toggle  

---

## 6. Vad som explicit **inte** ska göras

| Förslag | Varför |
|---------|--------|
| Ta bort `/hamn` för Valv-BIFF | Användaren låste **båda** — Hamn = yttre, Valv = inre |
| Ny `/kompis` L1-route | F-V13 = Valv-chatt, inte hem-Kompis |
| Ersätta Variant C med 5-ikon dock | Bryter `navigation-master.md` |
| Barnfrågor → `kb_docs` | Bryter tre silor |
| Orkestern på `/vardagen?tab=kunskap` | Låst NEJ i inkorg |
| Radera inkorg-artefakter eller skärmdumpar | Analys = utökning |

---

## 7. Uppdateringar efter denna analys

| Fil | Ändring |
|-----|---------|
| [`2026-05-22-inkorg-ux-navigation.md`](./2026-05-22-inkorg-ux-navigation.md) | Status → analyserad; analyskö fylld |
| Varje `2026-05-23-inkorg-*.md` | Sektion **Analys 2026-05-23** |
| [`Arkiv-GAP-REGISTER.md`](../specs/modules/Arkiv-GAP-REGISTER.md) | Korsreferens F-V11 ↔ G19–G21 (nedan) |
| Implementation | Väntar på `kör [GAP]` / explicit bygg-P0 |

### Korsreferens inkorg → GAP-register

| Inkorg-ID | GAP / SPEC |
|-----------|------------|
| F-V11 | G19, G20, G21 |
| F-V12 | Ny rad **G22** (föreslagen): Valv-flik BIFF + delad UI — eller underleverans i G19 |
| F-V13 | Under G19 Sök-flik eller egen **G23**: chatt-tråd-UI |
| F-V10 | Mabra-SPEC / ny **G24** frågekort-pool |
| F-B11 | Barnen-SPEC utökning |
| F-V14 | Verklighetsvalvet-SPEC § flikar |

*G22–G24 är förslag — lägg till i register först vid `kör [GAP]`.*

---

*Analys: Cursor Agent 2026-05-23. Alla PASS med `filepath:line` verifierade i denna session.*
