# System-gap syntes — Flow/krediter & PMIR-kandidater

**Datum:** 2026-06-18  
**Källor:** `research-2026-06-18-master-syntes.md` (Gemini Deep Research) · `LIFE-OS-BUILD-STATE.md` · `2026-06-17-flow-pipeline-karta.md` · `2026-06-18-fas19-leverans.md` · levande repo (grep)  
**Status:** Syntes klar — **våg 28 innehåll KEEP** (2026-06-18). Nästa: **en** Flow-PMIR (A/B/C).  
**Content:** [`research-2026-06-18-content-master.md`](../external-ai/imports/research-2026-06-18-content-master.md)

---

## Våg 28 — innehåll (före PMIR A/B/C)

**Godkänd:** Pontus 2026-06-18 · **Smoke:** `npm run smoke:innehall` **PASS** 2026-06-18

| # | bankId | klass | kurator | åtgärd |
|---|--------|-------|---------|--------|
| 1 | `kunskap-fact-eko-009` | FACT | kunskap-seed | NEW existensminimum hyra/el/mat (P1) — *eko-005 = impulshink KEEP v27* |
| 2 | `kunskap-fact-cop-006` | FACT | kunskap-seed | STRENGTHEN skriftligt only vid HCF-eskalering |
| 3 | `kunskap-fact-cn-048` | FACT | kunskap-seed | STRENGTHEN Hoovering via barn (kompletterar cn-016) |
| 4 | `MB-PLAY-54321` | PLAY | mabra-curator | NEW interaktiv 54321 ≤2 min |
| 5 | `MB-REF-rsd-04` | REFLECTION | mabra-curator | NEW neutral RSD-säker felcopy |

**REJECT:** cross-RAG Valv→MåBra (U1). Akutväg = MåBra-hub `/vardagen?tab=mabra`, ingen Valv-RAG.

**BACKLOG (efter våg 28 KEEP):** PMIR-D Arbetsliv — `projectBudgetToPayday` från `generatePayslip` + utgifter/inkomster. Stämpel + lönespec live; Flow endast UI-mock om behövs.

---

## Executive summary

Fas 19 (19.1–19.6) och P1/P2 Flow-pipelines är **LOCK** i kanon. Research bekräftar baseline och pekar på **tre backend PMIR-kandidater** (P3–P4–P6) plus **ett frontend/Flow-designexperiment** (P5). Hamn, Barnporten push och M3.0-C Fitness/Näring ska **DEFER** — redan täckt eller lågt ROI nu.

**Top GAP (nytta × säkerhet):**

| # | GAP | Rekommendation | PMIR |
|---|-----|----------------|------|
| 1 | P3 Mönster — metadata-assistans på `vaultPatternScan` | NEW (Flow, låg kredit) | Ja |
| 2 | P4 MåBra — Flow-parafras i befintlig `mabraCoach` + bankId | NEW (medel kredit) | Ja |
| 3 | P6 Dossier — Flow tidslinje-struktur i `generateDossierInternal` | NEW (medel kredit) | Ja |
| 4 | P5 Theme — mockups i Antigravity/Flow (`/dev/theme-lab`) | NEW (frontend) | Nej |
| 5 | Hamn BIFF/Grey Rock | OVERLAP / DEFER | Nej |
| 6 | Barnporten push (BP-PUSH) | DEFER | Senare |
| 7 | M3.0-C Fitness/Näring full UI | DEFER | Nej (BUILD-STATE) |
| 8 | Cross-RAG / fjärde silo | REJECT | — |
| 9 | Streak/XP/gamification | REJECT | — |
| 10 | Arkiv-batch Fas 19.6 | DEFER (egen PMIR) | Separat |

---

## Top 5 Flow-experiment (~2000 krediter)

| Prio | Pipeline | Kredit | Verifierat i repo | PMIR |
|------|----------|--------|-------------------|------|
| **1** | **P3** Mönster-metadata via Flow på `vaultPatternScan` | low (~200–400) | `VaultMonsterPanel.tsx`, `vaultPatternScan.ts` — klient-scan idag, ingen Flow-brygga | Ja |
| **2** | **P4** MåBra coach parafras — tunn Flow i `mabraCoach` | medium (~400–800) | `mabraCoach` callable + `mabraCoachService.ts`, bankId låst 19.4 | Ja |
| **3** | **P6** Dossier tidslinje — Flow i `generateDossierInternal` | medium (~400–800) | `generateDossierInternal.ts`, `dossierAiForeword.ts` — foreword LOCK, timeline saknas | Ja |
| **4** | **P5** Theme mockups (Obsidian Calm varianter) | low (~100–300) | `smoke:design-modules`, theme-lab route | Nej |
| **5** | **P7** Hamn Flow-assist | — | `askGransArkitekten` täcker BIFF — **DEFER** | Nej |

**Budget:** P3 + P4 + P6 ≈ 1000–2000 krediter om prototypas i Flow före tunn callable.

---

## Top 5 Cursor-byggen (utan Flow)

| Prio | Bygge | Varför | Smoke |
|------|-------|--------|-------|
| 1 | Formell **F19.2–19.5 LOCK**-rad i BUILD-STATE | Smoke PASS men ej formellt stängd | `smoke:mabra`, `smoke:modulvaljare`, `smoke:evolution-discovery` |
| 2 | **Deploy-diff** `invalidateSession` + hosting om ej live | F19.1 PASS lokalt | `smoke:valv-security`, `smoke:auth-login` |
| 3 | **Arkiv-batch 19.6** (PMIR först) | Dokumenterad DEFER-våg | `smoke:orkester` |
| 4 | **M3.0-C** Fitness/Näring UI (efter PMIR eller explicit DEFER-bekräftelse) | BUILD-STATE DEFER | `smoke:mabra` |
| 5 | **imports/** — `.md` inte `.rtf` | **Done** — `research-2026-06-18-master-syntes.md.rtf` raderad 2026-06-18 | — |

---

## Backend-PMIR-kandidater (`backend_impact: YES`)

### PMIR-A: P3 Mönster Flow-metadata

| Fält | Värde |
|------|-------|
| Modul | `evidence/vault` · `vaultPatternScan` |
| Route | `/valvet?vaultTab=monster` |
| Sketch | Tunn callable eller Flow-webhook: föreslå HCF/covert-taggar till **metadata** (inte WORM-text), DCAP före LLM |
| Brott-risk | Låg om endast metadata + locked `VaultMonsterPanel` oförändrad |
| Smoke | `npm run smoke:valv`, `npm run smoke:valv-security`, `npm run smoke:pattern-metadata` |
| Flow | low |

### PMIR-B: P4 MåBra Flow-parafras

| Fält | Värde |
|------|-------|
| Modul | `wellbeing/mabra` · `mabraCoach` |
| Route | `/vardagen?tab=mabra` |
| Sketch | Utöka `mabraCoach` med valfritt Flow-steg: parafras bank-kort (`bankId` P1) — **ingen** ny FACT utan bank |
| Brott-risk | Medel — `mabraCoachGuard` måste hålla ex/konflikt → Speglar |
| Smoke | `npm run smoke:mabra`, `npm run smoke:innehall`, `npm run smoke:grans` |
| Flow | medium |

### PMIR-C: P6 Dossier Flow-tidslinje

| Fält | Värde |
|------|-------|
| Modul | `evidence/vault/dossier` |
| Route | Valv → dossier |
| Sketch | Flow offload i `generateDossierInternal` för strukturerad tidslinje; behåll WORM `dossier_snapshots`, hash-kedja |
| Brott-risk | Medel — får inte ändra LOCK på `includeAiForeword` utan ny CP |
| Smoke | `npm run smoke:dossier`, `npm run smoke:valv-security`, `npm run smoke:vault-worm` |
| Flow | medium |

### DEFER (backend men inte nu)

| ID | Post | Orsak |
|----|------|-------|
| research-sa4-007 | Barnporten push | Fas 19 DEFER, manuell synk funkar |
| research-sa2-004 | Hamn Flow | `askGransArkitekten` täcker |

---

## Stop doing list (max 10)

1. Fjärde RAG-silo eller cross-RAG mellan Kunskap/Valv/Barnen  
2. Streak, XP, gamification i MåBra  
3. Auto-promote barnlogg → Valv  
4. Diagnos-etiketter på motpart i WORM/dossier  
5. Ersätta LOCK `processBrusfilter` / Inkast HITL  
6. Ersätta LOCK Dossier-kärna — endast **additiv** Flow  
7. P7 Hamn Flow duplicera BIFF-coach  
8. Prod-kod direkt från NotebookLM/Gemini utan PMIR  
9. `firestore.rules`-ändring utan explicit Pontus-OK  
10. Teal/turquoise chrome (gap-matrix REJECT)

---

## Smoke-checklista före ny LOCK

```bash
npm run build
cd functions && npm run build
npm run smoke:locked-ux
npm run smoke:orkester
# + zonspecifik smoke från PMIR-tabellen ovan
```

Uppdatera `LIFE-OS-BUILD-STATE.md` med ny LOCK-rad + datum.

---

## Rekommenderad ordning (ett steg i taget)

| Steg | Åtgärd | Verktyg | Pontus |
|------|--------|---------|--------|
| **1** | **Våg 28 KEEP** + ingest Kunskap (eko-009, cop-006↑, cn-048) | Cursor + `seed:kunskap-facts` | **DU** |
| 2 | Våg 28 UI: `MB-PLAY-54321` wizard + RSD felcopy-audit | Cursor | När energi finns |
| **3** | Godkänn **PMIR-A (P3 Mönster)** eller välj B/C istället | Cursor | **DU** |
| 4 | Flow-prototyp P3 i Google Flow (låg kredit) | Flow | Validera output |
| 5 | Tunn callable + smoke → LOCK P3 | Cursor + deploy | Godkänn deploy |
| 6 | **PMIR-B + PMIR-C parallellt** (Worker B/C, disjunkta filset) | Flow → Cursor | Se eval nedan |
| 7 | **PMIR-D Arbetsliv** budget→lön (BACKLOG) | Cursor | Efter våg 28 KEEP |
| 8 | P5 Theme mockups (valfritt) | Antigravity | När energi finns |
| 9 | Formell F19.2–19.5 LOCK i BUILD-STATE | Cursor | Parallellt OK |

---




## PMIR-A P3 — LOCK (2026-06-18)

Pontus valde **P3**. Callable `assistPatternMetadata` — FLOW-lager metadata, DCAP före LLM, stängd taktik-katalog.  
Eval: [`2026-06-18-pmir-a-p3-monster-flow.md`](./2026-06-18-pmir-a-p3-monster-flow.md)

## Våg 28 KEEP + ingest (2026-06-18)

| Kommando | Status |
|----------|--------|
| `export:kunskap-seed` | PASS — 142 KEEP → manifest |
| `seed:kunskap-facts` | PASS — ok 3, skip 139, fail 0 |
| `npm run smoke:innehall` | PASS |

**Nya/uppdaterade ingest:** `kunskap-fact-eko-009`, `kunskap-fact-cop-006` (STRENGTHEN), `kunskap-fact-cn-048`  
**MåBra bank KEEP:** `MB-PLAY-54321`, `MB-REF-rsd-04` (prod-wire wizard = separat UI-steg)

## Källhänvisning

- Gemini master: [`docs/external-ai/imports/research-2026-06-18-master-syntes.md`](../external-ai/imports/research-2026-06-18-master-syntes.md)
- Flow-karta: [`2026-06-17-flow-pipeline-karta.md`](./2026-06-17-flow-pipeline-karta.md)
- Gap-matris: [`docs/external-ai/imports/gap-matrix-2026-06-18.md`](../external-ai/imports/gap-matrix-2026-06-18.md)

---

## PMIR-B/C parallellt (2026-06-18)

**Status:** UTKAST — väntar Pontus godkännande.

| PMIR | Pipeline | Eval | Worker |
|------|----------|------|--------|
| **B** | P4 MåBra Flow-parafras | [`2026-06-18-pmir-b-p4-mabra-flow-parafras.md`](./2026-06-18-pmir-b-p4-mabra-flow-parafras.md) | B — `mabra*` |
| **C** | P6 Dossier Flow-tidslinje | [`2026-06-18-pmir-c-p6-dossier-timeline.md`](./2026-06-18-pmir-c-p6-dossier-timeline.md) | C — `dossier*` |

**Conductor:** max 2 workers parallellt · disjunkta filset · en kombinerad deploy efter båda smoke PASS · ingen merge utan Pontus OK.

