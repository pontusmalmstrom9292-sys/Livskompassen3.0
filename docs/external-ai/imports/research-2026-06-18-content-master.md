# Content Master — Deep Research 2026-06-18 (SA1–SA5)

**Datum:** 2026-06-18  
**Status:** Våg 28 poster 1–5 → **KEEP** + ingest (Pontus godkänd 2026-06-18)  
**Källor:** Cursor-syntes mot levande repo · [`research-2026-06-18-master-syntes.md`](./research-2026-06-18-master-syntes.md) (system/teknik) · [`research-cursor-2026-06-16-master-syntes.md`](./research-cursor-2026-06-16-master-syntes.md) · INNEHALL-REGISTER · bankerna  
**Gate:** [`research-content-gate.mdc`](../../.cursor/rules/research-content-gate.mdc) — ingest endast efter KEEP + `npm run seed:kunskap-facts`

---

## Executive summary

Fas 19 + P1/P2 Flow är **LOCK**. Kunskap (~140 FACT KEEP) och MåBra-banken täcker redan det mesta extern research föreslog (RSD `C-rsd-*`, 5-4-3-2-1 copy `F3`, DARVO `cn-043+`, parallellt föräldraskap `cop-006/007`, vagus, ekonomi-kapacitet `eko-001–008`). **Verkliga luckor** är främst **UI/implementation** och **förstärkning** — inte duplicerad fakta.

**Våg 28 (innehåll före Flow PMIR A/B/C):** 5 poster CANDIDATE — 3 Kunskap (1 NEW + 2 STRENGTHEN) + 2 MåBra (NEW PLAY + REFLECTION). **REJECT:** cross-RAG Valv→MåBra SOS (bryter U1). WORM/`children_logs`-isolering = **OVERLAP** (redan i `firestore.rules`). Hamn BIFF = **OVERLAP** (`askGransArkitekten`). Barnporten push = **DEFER**.

**BACKLOG (efter våg 28 PASS):** PMIR-D Arbetsliv — `projectBudgetToPayday` från `generatePayslip` + utgifter/inkomster. Stämpel + lönespec finns; Flow endast UI-mock om behövs.

---

## SA1 — MåBra / psykisk hälsa

| id | klass | zon | overlap | rekommendation |
|----|-------|-----|---------|---------------|
| sa1-001 | FACT | mabra | `C-rsd-*`, `F4` | **STRENGTHEN** — parafras i prod-coach |
| sa1-002 | FACT | rules | Obsidian Calm | **KEEP** — audit befintlig `error`-UI |
| sa1-003 | PLAY | mabra | `F3` 54321 copy, `G5` ljud-jakt | **NEW** `MB-PLAY-54321` — interaktiv wizard (våg 28 post 4) |
| sa1-004 | FACT | kunskap | vagus i seed | **OVERLAP** — `gad-038` ingest v27 |

**REJECT:** cross-RAG Valv→MåBra SOS. **Ersätt med:** fast akutväg i MåBra-hub (`/vardagen?tab=mabra`) — samma zon, ingen RAG.

---

## SA2 — Hamn / HCF / Valv

| id | klass | zon | overlap | rekommendation |
|----|-------|-----|---------|---------------|
| sa2-004 | REFLECTION | hamn | `cop-007`, Hamn wire | **STRENGTHEN** — skrift före telefon (wire live) |
| sa2-005 | FACT | kunskap | `cn-043+` DARVO | **OVERLAP** |
| sa2-006 | EVIDENCE | valv | WORM rules | **OVERLAP** — LOCK |
| sa2-007 | FACT | kunskap | `cn-016` Hoovering | **STRENGTHEN** — `cn-048` CANDIDATE (våg 28 post 3) |

---

## SA3 — Ekonomi / planering

| id | klass | zon | overlap | rekommendation |
|----|-------|-----|---------|---------------|
| sa3-007 | FACT | vardagen | `eko-004`, `EconomyCapacityLockedNotice` | **STRENGTHEN** copy Nivå 1 |
| sa3-008 | FACT | kunskap | `eko-005` impulshink KEEP v27 | **NEW** existensminimum → `kunskap-fact-eko-009` (våg 28 post 1) |
| sa3-009 | REFLECTION | vardagen | impulskö, evolution_hub | **KEEP** — ingen manuell bokföring |

---

## SA4 — Barn / Barnporten

| id | klass | zon | overlap | rekommendation |
|----|-------|-----|---------|---------------|
| sa4-009 | PLAY | barnen | `BP-PLAY-*` | **STRENGTHEN** ålders-UI — våg 29 |
| sa4-010 | FACT | rules | `children_logs` WORM | **OVERLAP** |

---

## SA5 — Meta / UX-regler

| id | klass | zon | overlap | rekommendation |
|----|-------|-----|---------|---------------|
| sa5-011 | REFLECTION | rules | Obsidian Calm, WCAG | **KEEP** |
| sa5-012 | REFLECTION | rules | streak REJECT | **KEEP** — kanon |
| sa5-013 | REFLECTION | mabra | felcopy | **NEW** `MB-REF-rsd-04` (våg 28 post 5) |

---

## Våg 28 — poster 1–5 (CANDIDATE)

| # | bankId | klass | kurator | åtgärd | status |
|---|--------|-------|---------|--------|--------|
| 1 | `kunskap-fact-eko-009` | FACT | kunskap-seed | NEW: existensminimum hyra/el/mat (P1) | KEEP |
| 2 | `kunskap-fact-cop-006` | FACT | kunskap-seed | STRENGTHEN: parallellt föräldraskap — skriftligt only vid eskalering | KEEP |
| 3 | `kunskap-fact-cn-048` | FACT | kunskap-seed | STRENGTHEN: Hoovering via barn/medlare (kompletterar cn-016) | KEEP |
| 4 | `MB-PLAY-54321` | PLAY | mabra-curator | NEW: steg-för-steg 54321 (≤2 min) | KEEP |
| 5 | `MB-REF-rsd-04` | REFLECTION | mabra-curator | NEW: neutral RSD-säker felcopy-mall | KEEP |

**ID-notering post 1:** Planerad rubrik «eko-005 existensminimum» kolliderar med `kunskap-fact-eko-005` (impulshink KEEP v27). Ny bankId: **eko-009**.

**REJECT (våg 28):** cross-RAG Valv→MåBra · streak/XP · diagnos-etiketter · LLM-FACT utan bank

**Smoke:** `npm run smoke:innehall` efter bank-ändring

---

## Källhänvisning

- System-syntes: [`research-2026-06-18-master-syntes.md`](./research-2026-06-18-master-syntes.md)
- Gap + PMIR: [`2026-06-18-system-gap-syntes.md`](../evaluations/2026-06-18-system-gap-syntes.md)
- Slutfas v27: [`2026-06-16-research-slutfas.md`](../evaluations/2026-06-16-research-slutfas.md)
