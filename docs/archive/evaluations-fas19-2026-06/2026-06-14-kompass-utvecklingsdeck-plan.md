# KompassSuperHub — Utvecklings-Deck + Vit-koppling

**Datum:** 2026-06-14 (uppdaterad eval)  
**Status:** **P4 done** (2026-06-15) — deck i `HomeAdaptiveCompass` alla teman; Forge = separat shell utan dublett.  
**Ägare:** Pontus · ADHD/GAD · kognitiv avlastning, ett steg i taget  
**Kanon:** [MABRA-PROJEKT-VIT-HUB-SPEC](../design/MABRA-PROJEKT-VIT-HUB-SPEC.md) · [INNEHALL-REGISTER](../INNEHALL-REGISTER.md) U6 · [OBSIDIAN-FORGE-SPEC](../design/themes/OBSIDIAN-FORGE-SPEC.md) · [kompass-widget-snabbstart-plan](2026-05-29-kompass-widget-snabbstart-plan.md)

### Implementeringsbaseline (ärlig nuläge)

En **första implementation** av P0–P4 finns redan i repo (`OdForgeKompassSuperHub`, `discoveryBentoCatalog.ts`, `KompassDiscoveryCardFlow`, `evolutionLedgerFirestore`). Denna eval är **godkännandegrind och kanon** — inte en tom backlog. Vid godkännande: verifiera smoke, manuell UX-test, PMIR före utökad prod-wire till **alla** hem-teman (`HomeAdaptiveCompass`).

| Yta | Status |
|-----|--------|
| `/dev/obsidian-forge` | Superhub + deck + kortflöde |
| Hem prod (`HomeForgeKompassBridge`) | Endast `OD-obsidian-depth` + `FORGE_PROD_WIRE_ENABLED` |
| `HomeAdaptiveCompass` (default scenic) | **P4 done** — Utforska-deck + snabb-rad ovanför CTA (alla teman) |
| Valv `vaultTab=mitt_vit` | Läser `vit_entries` inkl. `categoryId` / `vitCategory` filter |

---

## A. REASONS (kort)

### Requirements

| Id | Krav |
|----|------|
| R1 | Hemkompass = levande supermodul — Obsidian Calm, **ingen jargon**, inga streak/XP |
| R2 | Snabbstart **ovanför primär CTA** — får **inte** täcka hälsning |
| R3 | Enklare svenska etiketter (KASAM→Stäng dagen, Fokus→Nästa steg, Paralys→Ett litet steg) |
| R4 | **Utforska** → 12 bento-kategorier → **ett** kort (REFLECTION/PLAY) via `bankId` — parafras, **ingen LLM-fakta** |
| R5 | Valfri reflektion → `vit_entries`; Valv-promote **endast** via `MabraVitEvidencePrompt` + `sourceRef` |
| R6 | Statistik i Valv **Mitt Vit** — separat från WORM-bevis (`reality_vault`) |
| R7 | `evolution_ledger` vid första spar per kategori — append-only, ingen gamification |
| R8 | U6: Vit-silo — **ingen** cross-RAG till `kampspar` |

### Entities

| Entitet | Sökväg / fil | Roll |
|---------|--------------|------|
| `discoveryBentoCatalog.ts` | `compasses/content/` | 12 kategorier, accent, `projectId`, `bankId[]` |
| `discoveryCoachBank.ts` | `compasses/content/` | MB-REF/MB-PLAY parafras-pool |
| `pickDiscoveryCard.ts` | `compasses/lib/` | FNV-1a rotation per uid + datum + kategori |
| `discoveryBankResolver.ts` | `compasses/lib/` | Slår upp `bankId` → DM/MB/C-* kort |
| `vit_entries` | Firestore | Append-only reflektion, `inputMode: kompass_discovery` |
| `vit_hub` | Firestore | Aktiva projekt per användare |
| `evolution_ledger` | Firestore WORM | Milestone `kompass_discovery` per `categoryId` |
| `OdForgeKompassSuperHub` | `core/ui/forge/` | Superhub-shell (fas, läge, rail, CTA, deck) |
| `HomeForgeKompassBridge` | `core/home/` | Prod-wire bakom tema + flag |
| `VaultVitHubPanel` | Valv | Läser/filterar Vit — `?vitCategory=` |

### Approach

1. **Forge först** (`/dev/obsidian-forge`) — layout, copy, deck UX utan prod-risk.
2. **Bank-only kort** — rotation från KEEP-rader (`dagligMixCatalog`, `mabraReflectionCards`, `discoveryCoachBank`, `mabraExtendedPlays`).
3. **Vit write** — `saveVitEntry` med `categoryId` + `projectId` från katalog.
4. **Evolution** — idempotent milestone (cache + ledger-read) vid första spar per kategori.
5. **Prod-wire sist** — `HomeAdaptiveCompass` efter PMIR + explicit «godkänn Forge».

### Structure (modulgränser)

```
Hem
├── HomeForgeKompassBridge (flag + tema)
│   └── OdForgeKompassSuperHub
│       ├── COMPASS_WIDGET_CATALOG (snabb-rad)
│       ├── KompassDiscoveryDeck (12 bento)
│       └── KompassDiscoveryCardFlow → vit_entries
├── HomeAdaptiveCompass (legacy scenic — P4 mål)
Valv vaultTab=mitt_vit
└── VaultVitHubPanel (+ vitCategory filter)
```

### Operations

| Operation | Trigger | Utfall |
|-----------|---------|--------|
| Visa kort | Kategori-val | `pickDiscoveryCard` → ett kort |
| Spara Vit | «Spara till Vit» | `ensureVitHub` + `saveVitEntry` |
| Milestone | Första spar/kategori | `recordDiscoveryMilestoneIfNew` |
| Promote bevis | Användaren väljer explicit | `MabraVitEvidencePrompt` → `reality_vault` |
| Läs statistik | Valv Mitt Vit | `vitHubStats` + `categoryCounts` |

### Norms

- **Ett steg i taget:** bento → kort → valfri text → spara/hoppa.
- **Inåtvänd utveckling** — inte ex/BIFF/gaslighting (→ Hamn/Speglar).
- **Närvaro** räknar unika dagar — **inte** streak-skuld.
- **Obsidian Calm:** grafit `#050b14`, guld `#d4af37`, bento-accenter dämpade (amber, rose-dim, sea-dim — aldrig regnbågs-chrome).

### Safeguards

| Risk | Grind |
|------|-------|
| Fjärde RAG-silo | `bankId` endast REFLECTION/PLAY; `smoke:discovery-deck` parity |
| Auto-promote Valv | Ingen `reality_vault` write utan `MabraVitEvidencePrompt` |
| LLM-fakta | Ingen runtime-generering; `discoveryBankResolver` statisk |
| Gamification | `mustNotInclude` streak/XP i smoke; ingen count-up UI |
| Forge prod utan OK | `FORGE_PROD_WIRE_ENABLED` + tema-gate; PMIR före default-hem |
| WORM-läckage | `vit_entries` ≠ `reality_vault`; separata Valv-flikar |

---

## B. UX-spec (Obsidian Calm)

### Layout — Kompass-läge (vertikal ordning)

**Kritiskt:** Snabb-rad (`od-forge__superhub-widget-rail`) ligger **efter** hälsning/lead/micro-tip men **före** primär CTA. Hälsning (`od-forge__hero-greeting`) är alltid överst i main-kolumnen.

```
┌─ KompassSuperHub ─────────────────────────────────────┐
│ [Morgonkompass]                    [Mer ▾] [Dagbok]  │  ← fas + topp-actions
├──────────────────────────────────────────────────────┤
│ ( Kompass ) ( Inkast ) ( Lek & lär )                 │  ← läge-tabbar
├──────────────────────────────────────────────────────┤
│ God kväll, Pontus ✦                                   │  ← hälsning (ej täckt)
│ «Ett litet steg räcker…»                             │  ← tagline / flow-lead
│ Mikrosteg-hint                                        │
│ Micro-tip (roterande, deterministisk)                 │
│ [Anteckning] [Inspelning] [Känslokort]               │  ← inline chips (max 3)
├──────────────────────────────────────────────────────┤
│ SNABBSTART ─────────────────────────────────────────  │  ← horisontell rail
│ ○ Anteckning ○ Inspelning ○ Känslokort ○ Snabb rad   │     (ovanför CTA)
├──────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐  │
│ │  ✦ Fortsätt kompassen                           │  │  ← primär CTA (guld)
│ └─────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│  ◎ Utforska ▾                                         │  ← progressive disclosure
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                 │
│  │Ha kul│ │Lär ny│ │Utveck│ │Värder│  … 12 bento     │  ← dämpade accenter
│  └──────┘ └──────┘ └──────┘ └──────┘                 │
└──────────────────────────────────────────────────────┘
```

### Kategori → kort-vy (ett steg)

```
┌─ Kortflöde ──────────────────────────────────────────┐
│ ← Tillbaka                                            │
│ KÄNSLOR (kicker)                                      │
│ «Vilken känsla sitter starkast…» (bankId DM-CARD-05) │
│ [Din reflektion (valfritt)_______________]            │
│ [Spara till Vit]  [Hoppa över]                        │
│ (efter spar) MabraVitEvidencePrompt — valfri promote  │
└──────────────────────────────────────────────────────┘
```

### Etiketter (enklare svenska)

| Före | Efter | Fil |
|------|-------|-----|
| KASAM | **Stäng dagen** | `compassWidgetCatalog.ts` evening |
| Fokus | **Nästa steg** | evening `planering` |
| Paralys / Mikrosteg | **Ett litet steg** | day `paralys` |
| Frågesport / Quiz | **Snabb fråga** | day `quiz` |
| Känslomemory | **Känslokort** | morning |

Forge `flowLead`: «Stäng dagen utan skuld» (kväll), «Ett litet steg — manuell start» (dag).

### Bento-accenter (dämpade, inte regnbågs-chrome)

| Accent | Användning |
|--------|------------|
| `gold` | Personlig utveckling |
| `amber` | Ha kul |
| `rose-dim` | Självkänsla |
| `sea-dim` | Kropp & rörelse |
| `moss` | Lek & paus |
| `mist` | Lugn & landning |
| `slate`, `bronze`, `sand`, `copper`, `pearl`, `ash` | Övriga kategorier |

CSS: `od-forge__disc-card--{accent}` — subtil border/gradient, mörk bas.

### Återanvända komponenter

| Befintlig | Roll i superhub |
|-----------|-----------------|
| `OdForgeBentoGrid` | Mönster för 2×2 zonkort (Forge lab); deck använder `KompassDiscoveryDeck` |
| `CompassQuickWidgetRail` | Mönster för horisontell chip-scroll (`od-forge__superhub-widget-rail`) |
| `COMPASS_WIDGET_CATALOG` | Datakälla snabbstart per `CompassFlow` |
| `saveVitEntry` / `ensureVitHub` | Vit-persist |
| `MabraVitEvidencePrompt` | Explicit Valv-promote (ersätter generisk `SaveAsEvidencePrompt` i Vit-flödet) |
| `VaultVitHubPanel` | Statistik + filter `vitCategory` |
| `pickDagligMix` (mönster) | `pickDiscoveryCard` — FNV-1a daglig rotation |
| `BentoCard` | Ej i Forge-lab (Forge har egna klasser); kan återanvändas i `HomeAdaptiveCompass` P4 |

### Lägen (superhub)

| Läge | Innehåll |
|------|----------|
| **Kompass** | Hälsning + rail + CTA + Utforska |
| **Inkast** | Placeholder-fält (fas 2: koppla `InkastDirectPanel`) |
| **Lek & lär** | Grid av alla widgets för aktiv fas |

---

## C. Innehållskatalog (första våg)

**Fil:** `src/modules/features/dailyLife/wellbeing/compasses/content/discoveryBentoCatalog.ts`  
**Resolver:** `discoveryBankResolver.ts` ← `dagligMixCatalog`, `mabraReflectionCards`, `discoveryCoachBank`, `mabraExtendedPlays`  
**Rotation:** `pickDiscoveryCard.ts` — samma princip som `pickDagligMix.ts`

### 12 kategorier (KEEP `bankId`, minst 4 per kategori)

| id | Etikett | accent | projectId | bankIds (KEEP) |
|----|---------|--------|-----------|----------------|
| `ha_kul` | Ha kul | amber | `who_am_i` | DM-CARD-01, C-joy-01, C-joy-02, MB-REF-JOY-02, MB-PLAY-JOY-01 |
| `lar_ny` | Lär något nytt | slate | `learn_together` | MB-REF-02, C-kbt-03, DM-CARD-08, MB-REF-GEN-01 |
| `utveckling` | Personlig utveckling | gold | `self_esteem` | C-goal-01, C-goal-02, MB-REF-ADHD-03, C-kbt-01 |
| `varderingar` | Dina värderingar | bronze | `who_am_i` | MB-REF-ACT-01, MB-REF-ACT-02, MB-REF-01, MB-PLAY-02 |
| `sjalvkansla` | Självkänsla | rose-dim | `self_esteem` | C-identity-02, DM-CARD-04, MB-REF-MIRROR-02, C-kbt-03 |
| `kropp` | Kropp & rörelse | sea-dim | `who_am_i` | DM-PLAY-02, MB-REF-GAD-02, MB-PLAY-03, MB-REF-06 |
| `lek_paus` | Lek & paus | moss | `emotional_memory` | DM-PLAY-01, DM-PLAY-03, MB-PLAY-01, MB-PLAY-05 |
| `kanslor` | Känslor | copper | `emotional_memory` | C-feel-01, C-feel-02, DM-CARD-05, C-feel-04 |
| `lugn` | Lugn & landning | mist | `emotional_memory` | MB-REF-GAD-05, MB-REF-05, C-rsd-02, MB-PLAY-03 |
| `identitet` | Vem är jag | sand | `who_am_i` | C-identity-01, C-identity-03, DM-CARD-06, MB-REF-JOY-01 |
| `nar_det_knar` | När det känns hårt | ash | `self_esteem` | C-rsd-01, C-rsd-03, MB-REF-03, MB-REF-ADHD-02 |
| `min_uppgift` | Rolig mini-uppgift | pearl | `who_am_i` | MB-PLAY-JOY-02, MB-PLAY-04, MB-PLAY-MIRROR-01, DM-PLAY-03 |

**Not:** «Rolig historia» mappas till `min_uppgift` / PLAY-kort (MB-PLAY-*, DM-PLAY-03) — separat narrativ-bank kräver ny kurator-rad (ej P1).

### Innehållsregler (U6)

| Klass | Tillåtet i deck | Förbjudet |
|-------|-----------------|-----------|
| REFLECTION | C-*, DM-CARD-*, MB-REF-* | Ex/BIFF, diagnos mot motpart |
| PLAY | DM-PLAY-*, MB-PLAY-* | Gamification, poäng |
| FACT | — | Endast via Kunskapsbank (PIN), ej deck |
| EVIDENCE | — | Endast explicit promote |

Nya kort: `specialist-mabra-curator` → `Mabra-CONTENT-BANK.md` KEEP → export till resolver-pool → `smoke:discovery-deck`.

---

## D. Backend / Firestore

### `vit_entries` (append-only)

| Fält | Typ | Krav |
|------|-----|------|
| `ownerId` / `userId` | string | = auth.uid |
| `projectId` | enum | `self_esteem` \| `emotional_memory` \| `learn_together` \| `who_am_i` \| `recovery` |
| `kind` | enum | `card` (deck) \| `memory` \| `chat_turn` |
| `bankId` | string | KEEP-id, ≤32 tecken |
| `content_class` | enum | `REFLECTION` \| `PLAY` |
| `responseText` | string? | ≤5000, valfri användarreflektion |
| `cardDateKey` | string? | `YYYY-MM-DD` |
| `categoryId` | string? | 12 whitelist (rules) |
| `inputMode` | string? | `kompass_discovery` |
| `zone` | string? | `mabra` |
| `createdAt` | timestamp | server |

**WORM:** ingen `updatedAt` / `delete` på create. Rules: `isValidVitEntryCreate()` i `firestore.rules`.

### Valv Vit-panel (`vaultTab=mitt_vit`)

| Funktion | Implementation |
|----------|----------------|
| Lista entries | `listVitEntries` / filter |
| Kategori-filter | URL `?vitCategory=ha_kul` (12 ids + `all`) |
| Veckostatistik | `vitHubStats.ts` — unika dagar, pass, **categoryCounts** |
| Utveckling | `VitDevelopmentPanel` — 4 veckor aktivitet, **ingen streak** |
| Export | `exportVitHubReport` — PDF/JSON till användaren, ej dossier |

**Skilj från:** Mönster/Orkester (ex), Kunskapsbank (FACT RAG), WORM-bevis.

### `evolution_ledger` (milestones)

| Fält | Värde |
|------|-------|
| `type` | `milestone_unlocked` |
| `pillar` | `kognitiv` |
| `levelBefore` / `levelAfter` | `0` / `1` |
| `rationale` | «Första sparade reflektion i kompass-deck» |
| `metadata.source` | `kompass_discovery` |
| `metadata.categoryId` | t.ex. `ha_kul` |
| `metadata.firstBankId` | första sparade kort |

**Idempotens:** `localStorage` cache + `hasDiscoveryMilestoneInLedger` före write. Append-only — rules nekar update/delete.

### Deploy-påverkan

| Fas | Deploy |
|-----|--------|
| P0–P1 | `hosting` only |
| P2 | `firestore:rules` (categoryId + inputMode whitelist) |
| P3 | Ingen rules-ändring om milestone-fält redan tillåtna |
| P4 | `hosting` |

---

## E. Faser (P0–P4)

### P0 — Forge lab + naming

| Leverans | Filer |
|----------|-------|
| `OdForgeKompassSuperHub` layout | `OdForgeKompassSuperHub.tsx`, `obsidian-forge-lab.css` |
| Enklare etiketter | `compassWidgetCatalog.ts` |
| Theme Lab preview | `ObsidianForgeLabPage.tsx` |

| Smoke | `npm run build` · `npm run smoke:obsidian-forge` · `npm run smoke:locked-ux` |
| Deploy | hosting (lab-route) |
| **Baseline** | **done** |

---

### P1 — Bento deck + bank rotation

| Leverans | Filer |
|----------|-------|
| 12-kategori katalog | `discoveryBentoCatalog.ts` |
| Coach-bank | `discoveryCoachBank.ts` |
| Resolver + pick | `discoveryBankResolver.ts`, `pickDiscoveryCard.ts` |
| Deck UI | `KompassDiscoveryDeck.tsx` |
| Kortflöde | `KompassDiscoveryCardFlow.tsx` |
| Superhub wire | `OdForgeKompassSuperHub.tsx` («Utforska») |

| Smoke | `npm run smoke:discovery-deck` |
| Deploy | hosting |
| **Baseline** | **done** |

---

### P2 — `vit_entries` write + Valv Vit read

| Leverans | Filer |
|----------|-------|
| Spar Vit | `vitHubFirestore.ts` (`saveVitEntry` + `categoryId`) |
| Evidence prompt | `MabraVitEvidencePrompt` i kortflöde |
| Valv filter | `VaultVitHubPanel.tsx`, `filterVitEntries.ts` |
| Rules whitelist | `firestore.rules` |

| Smoke | `npm run smoke:mabra` · `npm run smoke:discovery-deck` |
| Deploy | **`firestore:rules` + hosting** |
| **Baseline** | **done** (rules deployad 2026-06-15 enligt tidigare logg) |

---

### P3 — `evolution_ledger`

| Leverans | Filer |
|----------|-------|
| Milestone write | `evolutionLedgerFirestore.ts` |
| Hook vid spar | `KompassDiscoveryCardFlow.tsx` |

| Smoke | `npm run smoke:evolution-discovery` · `npm run smoke:evolution` |
| Deploy | ingen rules-ändring |
| **Baseline** | **done** |

---

### P4 — Prod-wire KompassSuperHub → Home

| Leverans | Filer |
|----------|-------|
| Prod-bridge | `HomeForgeKompassBridge.tsx`, `odForgeBridge.ts` |
| Hem mount | `HomePage.tsx` / shell |
| **Mål (ej fullt):** Default scenic | `HomeAdaptiveCompass.tsx` — deck + rail ovanför CTA för **alla** teman |

| Smoke | `npm run smoke:locked-ux` · `npm run smoke:compass` · `npm run smoke:discovery-deck` |
| Deploy | hosting |
| **Baseline** | **delvis** — Forge-bridge live för `OD-obsidian-depth` only |

### Backlog efter P4 (ej blocker)

| Id | Beskrivning |
|----|-------------|
| B1 | `HomeAdaptiveCompass` — samma rail-ordning som Forge |
| B2 | Inkast-läge — koppla `InkastDirectPanel` (ej placeholder) |
| B3 | «Rolig historia» — dedikerad PLAY-bank (kurator våg) |
| B4 | Widget `onWidgetSelect` — navigera till `href` (idag status-only i bridge) |

---

## F. PMIR-checklista före merge / utökad prod-wire

### Kod & innehåll

- [ ] `npm run build` PASS
- [ ] `npm run smoke:locked-ux` PASS
- [ ] `npm run smoke:compass` PASS
- [ ] `npm run smoke:discovery-deck` PASS (12 kategorier, alla `bankId` KEEP)
- [ ] `npm run smoke:evolution-discovery` PASS
- [ ] `npm run smoke:innehall` PASS (U6, ingen fjärde silo)
- [ ] Ingen `streak` / `XP` / `gamification` i deck-komponenter
- [ ] Ingen auto-write `reality_vault` — endast `MabraVitEvidencePrompt`

### Säkerhet & silo

- [ ] `vit_entries` append-only; separat från `reality_vault`
- [ ] `categoryId` whitelist i `firestore.rules`
- [ ] `inputMode: kompass_discovery` i rules
- [ ] Ingen Vit → `kampspar` ingest

### UX & locked features

- [ ] Barnfokus, Valv Mönster/Orkester/Kunskapsbank oförändrade (`smoke:locked-ux`)
- [ ] Fyren WH1/WH2 oförändrade
- [ ] Snabb-rad **ovanför** CTA i Forge — manuell screenshot `/dev/obsidian-forge`

### Prod-wire (P4 utökning)

- [ ] Användaren sagt **«godkänn Forge»** explicit
- [ ] `FORGE_PROD_WIRE_ENABLED` avvägd (idag `true` i `odForgeBridge.ts` — dokumentera i PMIR)
- [ ] Beslut: alla teman vs endast Obsidian Depth
- [ ] `firebase deploy --only hosting` (+ rules om ändrade)

### Dokumentation

- [ ] Uppdatera `docs/content/CONTENT-WAVES.md` om ny innehållsvåg
- [ ] `INNEHALL-REGISTER` vid nya bankIds

---

## Verifiering (samlad)

```bash
npm run build && \
npm run smoke:discovery-deck && \
npm run smoke:evolution-discovery && \
npm run smoke:compass && \
npm run smoke:mabra && \
npm run smoke:innehall && \
npm run smoke:locked-ux && \
npm run smoke:orkester
```

**Manuell:** `/dev/obsidian-forge` eller Hem + tema Obsidian Depth → Utforska → kategori → Spara till Vit → Valv Mitt Vit (`?vitCategory=`).

---

**Vänta på godkännande innan implementation.**

Godkännande avser: (1) denna eval som kanon, (2) eventuell P4-utökning till `HomeAdaptiveCompass`, (3) deploy enligt PMIR ovan.
