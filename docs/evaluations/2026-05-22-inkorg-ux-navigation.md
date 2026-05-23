# Inkorg — UX/Navigation & Gemini designkoncept — 2026-05-22

**Status:** Inkorg (ej analyserad / ej låst)  
**Senast tillagt:** 2026-05-23  
**Trigger:** Extern AI-idéer (Gemini) + UI/UX-spec från chatt — ska utvärderas mot repo innan implementation.  
**Nästa steg:** Specialist-analys → PASS/GAP → låsning i `navigation-master.md` / `design-master.md` → ett byggsteg.

---

## Källor i denna inkorg

| # | Källa | Fil / plats |
|---|--------|-------------|
| 1 | Gemini share (ej läsbar utan login) | Titel: *Designkoncept för kognitiv avlastning* — https://g.co/gemini/share/17884ddf39a5 |
| 1b | Gemini mockups navigering (7 skärmdumpar) | [`artifacts/screenshots-gemini-2026-05-22/`](./artifacts/screenshots-gemini-2026-05-22/) |
| 1c | Gemini dashboard/moduler (9 skärmdumpar) | [`2026-05-22-inkorg-gemini-dashboard-funktioner.md`](./2026-05-22-inkorg-gemini-dashboard-funktioner.md) · **lås:** [`Gemini-Dashboard-FUNKTIONSLOCK.md`](../specs/incoming/Gemini-Dashboard-FUNKTIONSLOCK.md) |
| 2 | Gemini React-prototyp (mock, en fil `App`) | [`2026-05-22-inkorg-gemini-prototype.md`](./2026-05-22-inkorg-gemini-prototype.md) → [`artifacts/gemini-cognitive-exoskeleton-App.tsx`](./artifacts/gemini-cognitive-exoskeleton-App.tsx) |
| 2b | Gemini 3.0 interaktiv dashboard (mock) | [`artifacts/gemini-dashboard-interactive-App.tsx`](./artifacts/gemini-dashboard-interactive-App.tsx) |
| 3 | UI/UX-analys Navigation, ikonografi, menyer | Sektion nedan (klistrad 2026-05-22) |
| 3b | Desktop RTF (ClusterGrid) | [`2026-05-22-inkorg-rtf-clustergrid.md`](./2026-05-22-inkorg-rtf-clustergrid.md) |
| 3c | Desktop RTF (ModuleHubPanel) | [`2026-05-22-inkorg-rtf-modulehub.md`](./2026-05-22-inkorg-rtf-modulehub.md) |
| 4 | Cursor-förhandgranskning (ej låst) | Namnmappning repo Variant C ↔ extern ”Variant A” — se § Namnkrock |
| 5 | Gemini 3.0 — nyheter + F-09 (sammanfattning) | [`2026-05-23-inkorg-gemini-3-sammanfattning.md`](./2026-05-23-inkorg-gemini-3-sammanfattning.md) → [`artifacts/gemini-dashboard-interactive-App.tsx`](./artifacts/gemini-dashboard-interactive-App.tsx) |
| 6 | Skärmdumpar — samlad batch (16 st, hardlinks) | [`2026-05-23-inkorg-skarmdumpar.md`](./2026-05-23-inkorg-skarmdumpar.md) → [`artifacts/screenshots-inkorg-2026-05-23/`](./artifacts/screenshots-inkorg-2026-05-23/) |
| 7 | Transcript återställning (c7586bb5) | [`2026-05-23-inkorg-transcript-kallor.md`](./2026-05-23-inkorg-transcript-kallor.md) |

**Regel:** Innehåll här är **ritning**, inte source of truth. Kanon: `.context/design-language.md`, `docs/specs/design-master.md`, `docs/specs/navigation-master.md`, kod i `src/`.

---

## Namnkrock (måste lösas vid låsning)

| Extern/Gemini-analys | Livskompassen repo (`navigation-master.md`) |
|----------------------|-----------------------------------------------|
| **Variant A** — deterministisk, dock, 2×2 hub | **Variant C** — aktiv (Modulhub + kluster) |
| **Variant B** — Orbit / radial kompass | **Variant B** — arkiverad |
| **Variant C** — kontextuell ström, ingen dock | Finns **inte** som variant i repo — ny idé |

**Preliminär rekommendation (ej låst):** Behåll repo **Variant C**; finslipa mot extern **Variant A**-intent. Implementera **inte** Orbit som L1. **Inte** Shield/Valv som egen dock-ikon — Fyren + dold Bevis-flik.

---

## Gemini-prototyp — kortinventering (mock)

Full kod: [`2026-05-22-inkorg-gemini-prototype.md`](./2026-05-22-inkorg-gemini-prototype.md).

| System | State / flikar | Mock? | Mappning mot repo |
|--------|----------------|-------|-------------------|
| Safe Mode | `cognitiveLoad === 'high'` | Ja | Delvis → `/mabra`, saknar global header |
| Horizon Grid / Orbit | `menuStyle` | Ja | Orbit ≠ aktiv nav; hem = `ClusterGrid` + `ModuleHubPanel` |
| BIFF | `biff`, `processBiff` | Ja | → `safe_harbor` / `analyzeBiffMessage` (riktig API) |
| Bait-mask | `text-mask` blur | Ja | **GAP** i Hamn-UI |
| JADE-test | `jadeInput` regex | Ja | **GAP** klient; DCAP backend finns |
| Korsreferens | `korsreferens`, mock WORM+loggar | Ja | **GAP** enhetlig vy |
| Valvet | `valvet`, WORM-checkbox | Ja | → `reality_vault` (riktig WORM, ej checkbox-mock) |
| Vagus | 4-4-5 cykel | Ja | Måbra använder **4-7-8** |

---

## Analyskö (tom — fylls vid specialistpass)

| Specialist | Fråga | Rapportfil (planerad) |
|------------|-------|------------------------|
| Navigation | Extern Variant A vs repo Variant C, dock 1 vs 5 ikoner | `2026-05-23-UX-navigation-analys.md` |
| UI/design | Obsidian Calm, ikoner, #05080E vs tokens; 16 skärmdumpar batch | samma eller `2026-05-23-design-inkorg.md` |
| Hamn/BIFF | Maskering, tre svar, JADE L3, F-09 eget svar | `modul-safe_harbor` uppdatering |
| Security | Mock WORM vs `assertWormPayload` | utdrag i navigation-analys |
| Gemini 3.0 | F-01–F-09 vs shippat 2026-05-23 | utdrag i navigation-analys (FUNKTIONSLOCK redan låst) |

---

## UI/UX-analys — Navigation, Ikonografi & Menyer (råkopia)

**Datum:** 2026-05-22  
**Kontext:** Neuroinkluderande design för ADHD, GAD och RSD under hög allostatisk belastning.  
**Estetisk bas:** Obsidian Calm / Nordic Dusk (mörk, dämpad, deterministisk).

### Översikt Navigationsarkitekturen (L1 → L2 → L3)

För att eliminera kognitiv friktion och förhindra desorientering vilar systemet på tre strikta hierarkiska nivåer. Ingen dubbel-navigation eller motstridiga TabBars tillåts.

```
L1: Livsområde (Modulhub via botten-dock, max 5 vyer)
  └── L2: Kluster-flik (Segmented TabBar under header, t.ex. ?tab=reflektion)
        └── L3: Modul-läge (Lokal state för specifik interaktion, t.ex. logga/sök)
```

---

### Variant A: Det Deterministiska Flödet (Nuvarande bas, optimerad)

Denna variant renodlar och finjusterar den implementerade Variant C-navigationen från 2026-05-22. Fokus ligger på maximal förutsägbarhet, eliminering av oväntade animationer och tydliga taktila gränser.

#### 1. Wireframe-beskrivning (Mobil 390×844)

- **Header (Fast top):** Dämpat guld-tonat / märke till vänster. Till höger: Minimalistisk batteri-liknande indikator för kognitiv belastning (Klar sikt / Safe Mode). Inga dropdown-menyer.
- **Innehållsyta (Scrollbar, dämpad):**
  - Överst: Ett (1) kontextuellt kort baserat på tid på dygnet (Morgon/Dag/Kväll) utan krav på prestation.
  - Mitten: ModuleHubPanel (2×2 grid av Bento-kort):
    - Topp-vänster: Hamnen (Anchor - /hamn) — "Den trygga hamnen".
    - Topp-höger: Familjen (Users - /familjen) — "Neutral loggning för Kasper & Arvid".
    - Botten-vänster: Vardagen (Compass - /vardagen) — "Daglig rytm och stress".
    - Botten-höger: Måbra-sidan (Sparkles - /mabra) — "Kravlöst självbygge".
- **Botten-dock (Floating, fast):** Obsidian-docka (#05080E) med 5 ikoner:
  - [Anchor (Hamnen)] [Compass (Vardagen)] [Heart (Hjärtat - Centrum, stor guldring)] [Sparkles (Måbra)] [Shield (Valvet)]
  - **Fyren:** Long-press (3 sekunder) på Heart → haptik → avslöjar bevis-flik i Hjärtat L2 med dämpad guldlinje.

#### 2. Informationsarkitektur

| Nivå | Identifierare | Komponent | Funktion |
|------|---------------|-----------|----------|
| L1 | /dagbok (Hjärtat) | FloatingDock centrum | Central landningssida |
| L1 | /hamn | Dock knapp 1 | BIFF-triage |
| L1 | /familjen | ModuleHubPanel grid | Barnloggar |
| L2 | reflektion | TabBar cluster | Dagbok |
| L2 | bevis | TabBar (dold tills Fyren) | Verklighetsvalvet |
| L3 | Valv: logga | Lokal state under Bevis | WORM-bevis |

#### 3. Tap-räkning

- A. Spara dagbok: 2 taps  
- B. Bevis via Fyren: 1 long-press (3s)  
- C. BIFF i Hamn: 2 taps  

#### 4. Tillgänglighet & avvisat

- aria-selected på dock; kontrast 7:1 på #05080E; fokus #FDE68A  
- **Avvisat:** Svepgester för L1-växling (ADHD motorisk rastlöshet)

---

### Variant B: Den Radiala Fokuskompassen (Orbit-fokus)

- Central kompassros 280px, 4 noder (Hamn, Vardagen, Måbra, Familjen)  
- Smal dock: [Compass Hem] [Heart Fyren]  
- Fyren: long-press → femte nod Valvet (Shield)  
- **Avvisat:** Gyro/auto-rotation  

Tap-räkning Bevis via Fyren: 2 steg (long-press + klick nod).

---

### Variant C: Den Kontextuella Strömmen (Linjärt flöde)

- Ingen fast dock; vertikal ström (akut andning, dagens fokus, senaste WORM)  
- Global guld "Spegla" → bottom sheet  
- **Avvisat:** Swipe-to-dismiss på bottom sheet  

Tap-räkning högre (2.6 snitt).

---

### Jämförelse

| Metrik | Variant A | Variant B | Variant C |
|--------|-----------|-----------|-----------|
| Kognitiv belastning | Extremt låg | Medium | Låg |
| Arousal | Låg | Medium | Låg |
| Snitt taps | 2.0 | 2.0 | 2.6 |
| RSD/gaslight | Hög | Medium | Hög |

**Rekommenderad variant i dokumentet:** Variant A (Deterministisk).

---

### Ikonografi (Lucide)

| Livsområde | Ikon | Motivering |
|------------|------|------------|
| Hamnen | Anchor | Stabilitet |
| Hjärtat | Heart | Självmedkänsla |
| Vardagen | Compass | Vägledning utan prestation |
| Måbra | Sparkles | Kravlös återhämtning |
| Familjen | Users | Neutral observation Kasper & Arvid |
| Valvet | Shield | WORM-försvar |

---

### Nya funktioner (Progressive Disclosure, L3)

1. **JADE-realtidsvarnare** — under textfält Speglar/Loggning; mönster "eftersom", "förlåt", "för att", "du måste förstå"; guldsköld #FDE68A.  
2. **BIFF-triage** — Hamn `/hamn`: logistik 10% / beten 90% maskerade; tre BIFF-svar med kopiera.

---

### Prioriterad backlog (från dokumentet)

**P0**

1. Fyren-låset (3s long-press Hjärtat + haptik)  
2. Permanent tidsstämplad WORM  
3. JADE-realtidsvarnare (L3)  
4. BIFF Triage + maskering 90%  
5. Vagus 4-4-5 Safe Mode  

**P1**

- Korsreferens-motor (sök WORM + hälsohistorik)  
- Zero-Pressure balansmätare  

**P2**

- Obsidian glow  
- Dossier-export PDF/JSON  

---

## Cursor-notering (preliminär, ej låst)

| P0-post | Repo 2026-05-22 |
|---------|-----------------|
| Fyren 3s | Implementerat (`ModuleHubPanel`, `useLongPress`) |
| WORM | Implementerat (`reality_vault`) |
| JADE L3 klient | GAP |
| BIFF mask + 3 svar | Delvis (API fakta/beten, ett svar, ingen blur) |
| Vagus 4-4-5 global Safe Mode | Delvis (Måbra 4-7-8; ingen header-toggle) |
| 5-ikon dock + Shield | **Avviker** från nuvarande 1-hub dock + Fyren |

---

*Skapad av Cursor Agent 2026-05-22. Utökad 2026-05-23 (transcript c7586bb5). Analys och låsning väntar på explicit `kör UX-inkorg-analys`.*
