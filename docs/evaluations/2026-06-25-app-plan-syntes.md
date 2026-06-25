# Uppdaterad app-planering — syntes juni 2026

**Datum:** 2026-06-25  
**Plattform:** Cursor (Composer)  
**Typ:** Officiell PO-syntes av produktanalys 01–12  
**Status:** Godkänd som aktiv planeringskanon tillsammans med `.context/system-plan.md`

**Källor:**

- [`docs/evaluations/2026-06-25-produktanalys/`](./2026-06-25-produktanalys/INDEX.md) (12 prompter)
- [`.context/system-plan.md`](../../.context/system-plan.md)
- [`docs/evaluations/2026-06-15-fas19-masterplan-v2.md`](./2026-06-15-fas19-masterplan-v2.md)
- [`docs/specs/modules/Arkiv-GAP-REGISTER.md`](../specs/modules/Arkiv-GAP-REGISTER.md)

**Ersätter som primär roadmap:** [`2026-06-22-ROADMAP-BACKLOG.md`](./2026-06-22-ROADMAP-BACKLOG.md) (historisk referens kvar)

---

## 1. Vad som ändras

Tidigare plan (Fas 19–23) var **teknik- och modulorienterad**. Produktanalysen skiftar fokus:

> **Fungerande mobil vardag under låg energi** — med säker fångst till rätt silo — inte fler AI-demoer eller nya hubbar.

| Tidigare prioritet | Ny prioritet |
|--------------------|--------------|
| Fas 19-vågor (tokens, evolution_ledger, arkiv) | **Deploy + smoke grön** som första leverans |
| Spridd feature-utveckling | **Hamn · MåBra · Widgets v1** (daglig coping) |
| Agent-expansion | **Billig backend-hårdning** (DCAP 4 band, guards) |
| Valv/Kunskap djup | **Våg 1 = UI/read** (källkedja, HITL) — export/hash väntar |

**Oförändrat (kanon):** Tre zoner · tre silos · WORM · Zero Footprint · Locked UX · PMIR · YOLO före deploy.

---

## 2. Strategisk nordstjärna

Livskompassen är ett **personligt Life OS** under juridiskt och psykologiskt tryck — inte en wellness-app.

1. Tillförlitlig **daglig användning på telefon**
2. **Bevisbar säkerhet** (rätt silo, HITL, ingen cross-RAG)
3. **Kognitiv avlastning** (ett steg, inga streaks)
4. **Billig drift** (Firebase skala-till-noll, PMIR före scope)

---

## 3. Fas-struktur (uppdaterad)

### Avslutat / låst — rör inte utan PMIR

- G1–G17 **done**
- Superhubbar Fas 6–11 **låsta**
- Fas 23A (Globalt Pansarläge) **done**
- Fas 23B (Töm skallen / Inkast-Dyk) **done**
- G17 blur/pagehide **done**

### Aktiv etapp: Fas 23 + Produktvåg 1 (Q3 2026)

| ID | Leverans | Status | Källa |
|----|----------|--------|-------|
| **P0** | Smoke grön + Android daily driver | **smoke PASS** 2026-06-25 · G85 7d kvar | [12-produkagare](./2026-06-25-produktanalys/12-produkagare-nasta-bygg.md) #5 |
| **23C** | SOS Ankare `/mabra/recovery/sos` | **done** | [07-mabra](./2026-06-25-produktanalys/07-mabra-vit-lagtröskel.md) |
| **23D** | Paralys-Brytaren i Planering P3 | TODO | [09-agenter](./2026-06-25-produktanalys/09-agenter-synapser-ai.md) |
| **23E** | Tyst läge / dissociation i Dagbok | TODO | [03-dagbok](./2026-06-25-produktanalys/03-dagbok-hjartat.md) topp #1 |
| **PV1** | Produktvåg 1 (Hamn/MåBra/Widget/Fyren) | **delvis done** | [05–08](./2026-06-25-produktanalys/INDEX.md) |

### Defer (explicit)

| Spår | Tidshorisont |
|------|--------------|
| Fas 19.5 evolution_ledger (om ej done) | 6m |
| M3.0-C Fitness/Näring djup | 6m+ |
| CMEK full rollout | 12m + PMIR |
| Genkit / V1 migration | GAP wait |
| Batch Mönster-insikter | efter unified HITL |
| Barnporten åldersladder | efter av-paus + PMIR |
| Dossier BBIC `reportType` (12D) | 12m juridik-spår |

---

## 4. Byggsekvens: 0–12 veckor

**Regel:** Deploy först — annars shippar du till ingen.

```
Vecka 0–2   P0   smoke:predeploy + Android G85 daily driver
Vecka 1–3   PV1a Fyren silo-labels · MåBra lågenergi-filter · Hamn kopiera+rensa
Vecka 2–4   23C  SOS Ankare (3 knappar, ingen logg default)
Vecka 3–5   S24  Zero Footprint widget/synapse · DCAP 4 band · mabraCoachGuard
Vecka 4–8   PV1b Widget silo-chip + panik «Dölj» · WH1 etik-audit
Vecka 6–10  HITL1 Unified preview (inkast först)
Vecka 8–12  23D Paralys P3 · 23E Tyst läge Dagbok
```

### Topp 3 — snabbast vinst

1. **MåBra lågenergi-filter** — toggle finns; filtrera `MABRA_HUB_ITEMS`
2. **Fyren silo-labels** — «Dagbok» / «Bevis-rad» / «Barnobs»
3. **Hamn kopiera + rensa** — JADE finns; slutför affärsflödet

### Topp 3 — strategiskt viktigast

1. **Smoke + Android daily driver**
2. **Widget silo + panik dölj**
3. **Unified HITL preview**

### Topp 3 — vänta (trots att de är spännande)

1. Batch Mönster-Arkivarien / veckoinsikter
2. CMEK full rollout
3. Web Share Target + offline widget-kö

---

## 5. Zonplan

### Vardagen — MåBra

| Våg | Leverans |
|-----|----------|
| **1 (nu)** | Lågenergi-filter · post-session «Klart» · RSD-säker felcopy · SOS Ankare (23C) |
| **2 (6m)** | Paralys-panel · dissociation fullscreen · «Bara andas» · bank-only coach audit |

**Undvik:** Streaks · wellness-ton · Kunskap-RAG i coach

### Familjen — Hamn / BIFF

| Våg | Leverans |
|-----|----------|
| **1 (nu)** | Kopiera-svar · mikrosteg · JADE undo · session rensas |
| **2 (6m)** | Brusfilter steg 2 · HITL-paus · Speglar↔Hamn · autosort→Inkast |

**Undvik:** Auto-send till ex · AI «bevisdomare»

### Widgets / Fyren / Android

| Våg | Leverans |
|-----|----------|
| **1 (nu)** | Silo-chip (5 chips, default Inkast) · panik «Dölj» · rensa vid stäng · Fyren-labels |
| **2 (6m)** | Dagbok-puls · andning 2 min · Web Share Target · App Shortcuts · FLAG_SECURE |

**Undvik:** Push med känsligt innehåll · default Valv utan PIN

### Hjärtat — Dagbok / Speglar

| Våg | Leverans |
|-----|----------|
| **1 (nu)** | 23E tyst/dissociation · tre-ord default · post-save «Klart» · draft-återkomst |
| **2 (6m)** | Röst→journal · Vävaren opt-in preview · Speglar-bro med journalContext |

**Undvik:** Daglig AI-push · streak · auto-promote journal→Valv

### Valv

| Våg | Leverans |
|-----|----------|
| **1 (3m)** | Beviskort källkedja · Mönster→Samla filter · session nedräkning · forensik ingress |
| **2 (6m)** | Enhetlig HITL-kö · Valv-Chat citat · DCAP-alert · Mönster→Dossier |
| **3 (12m)** | Hash-kedja verify · Dossier export v2 · SMS-tråd · ombudslänk |

**Locked UX oförändrad:** Mönster · Orkester · P3 Kanban

### Familjen — Barnen

| Våg | Leverans |
|-----|----------|
| **1 (6m)** | Mikrosteg livslogg · positiva minnesankare · Kunskap FACT-bro (bh-*) |
| **2 (6–12m)** | Balans-export PDF · Barnporten HITL UX (efter av-paus) |

**Vänta:** Barn synlighetsnivåer · offline kö · BP-PUSH · auto barn→Valv

### Kunskap / RAG / Minne

| Våg | Leverans |
|-----|----------|
| **1 (6m)** | Citation UX · PIN-only browse · metadata-sidecar · FACT-gate inkast |
| **2 (12m)** | Chunking kb_docs · re-embed · journal_woven preview · Retrieval-Agent read-only |

### Agenter / AI

| Våg | Leverans |
|-----|----------|
| **3m** | `routeFromDcap` 4 band · `mabraCoachGuard` utökad · Inkorg-Sorteraren som agent card |
| **6m** | valvChat split · Safety-Review BIFF · traceId |
| **12m** | L0–L5 komplett · Batch Mönster HITL · Barn-EVIDENCE-klassificerare |

**Aldrig:** Universal-agent · LLM-routing istället för DCAP · autonom WORM-skrivning

---

## 6. Roadmap 3 · 6 · 12 månader

| Horisont | Mål | Huvudleveranser |
|----------|-----|-----------------|
| **3m (sep 2026)** | Dagliga verktyg på telefon | Fas 23C–E · PV1 · smoke CI · Zero Footprint · App Check |
| **6m (dec 2026)** | 3-zonsflöde sammanhängande | Unified HITL · Valv/Dagbok/Barn v2 · Widget v2 · agent L2 |
| **12m (jun 2027)** | Mogen Life OS custody-kontext | Dossier BBIC · CMEK eval · content banks · iOS minimal |

```
Q3 2026   Stabilisera · Fas23 · Hamn/MåBra/Widget v1 · smoke deploy
Q4 2026   HITL unified · Valv/Dagbok/Barn v2 · Agent split
H1 2027   Dossier · CMEK eval · Content · iOS · L-layer
```

---

## 7. Aldrig-lista (stoppskylt)

1. Universal-agent med läs till alla silos
2. AI «bevisdomare» / diagnos på motpart
3. Auto-promote barnlogg eller dagbok → Valv
4. Streaks / XP / gamification i coping
5. Push/notiser med journal-, konflikt- eller barninnehåll
6. Auto-send BIFF-svar till ex
7. Cross-RAG Kunskap ↔ Valv ↔ Barnen
8. Offentlig Kunskap utan PIN
9. LLM som svarar barn direkt
10. Gmail/Kalender OAuth-sync

**Snabb nej-checklista:** Kräver cross-silo? · Skriver WORM utan HITL? · Skapar skuld/streak? · Push med känslig text? · Ersätter DCAP med LLM? → **Stopp.**

Se även [11-farliga-bra-ideer.md](./2026-06-25-produktanalys/11-farliga-bra-ideer.md).

---

## 8. KPI:er (icke-skambeläggande)

| KPI | 3m | 6m | 12m |
|-----|----|----|-----|
| `smoke:predeploy` PASS | 100% merges | CI-gate | + nattpass |
| Widget → rätt silo (stickprov) | 90% | 95% | 95% |
| HITL pending cleared (median/vecka) | — | <7d | <3d |
| DCAP ALERT utan raw text leak | 100% | 100% | 100% |
| Månadskostnad GCP AI | inom gratis/kredit | alert-tröskel | scale-to-zero |

*Inga streak-KPI:er. Ingen «daily active user»-skuld.*

---

## 9. Beroendegraf

```
smoke:predeploy
    ├── Fas 23C–E
    ├── PV1 (Hamn/MåBra/Widget/Fyren)
    └── hosting deploy (YOLO + Pontus OK)

Unified HITL
    ├── inbox_queue UI
    ├── dcap_alerts UI
    └── Valv evidence prompt-mönster

AI L-layer
    ├── routeFromDcap 4 band
    ├── traceId
    └── valvChat split

12m juridik
    ├── Dossier BBIC
    ├── Valv export v2
    └── CMEK PMIR
```

---

## 10. Nästa steg (Pontus)

**Vecka 0:** Kör `npm run smoke:predeploy` tills grön → `build:web && cap sync` → använd G85 **7 dagar** och logga friktion — **innan** ny feature.

**Deploy-gate:** `npm run smoke:predeploy` → YOLO GO → Pontus OK
