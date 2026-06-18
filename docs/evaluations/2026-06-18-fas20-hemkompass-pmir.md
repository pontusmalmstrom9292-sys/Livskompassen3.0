# Fas 20 — Adaptiv Hemkompass + Dagens Ankare v3 (PMIR)

**Datum:** 2026-06-18 · **Status:** Godkänd för implementation  
**Plan:** Fas 20 Hemkompass (Cursor plan 9b7766be)

---

## 1. Executive summary

Prod har fungerande morgon/dag/kväll via `HomeAdaptiveCompass` och WORM `checkins`. Lab v3 (`DagensAnkareSupermodul`) och `AdaptiveMemoryCards` är byggda men ej kopplade. Fas 20 wire:ar hybrid UX (Forge morgon + Paralys dag), adaptiva kort, kapacitetsgate och Sanningens Ankare (Valv-session only).

---

## 2. Beslut

### R1 — UX (hybrid per dygnsfas)

| Fas | Val | Motivering |
|-----|-----|------------|
| Morgon | `AnchorVariantForge` | Andning + en intention — låg kognitiv belastning |
| Dag | `ParalysPanel` (förenklad vid nivå 1) | Mikrosteg prod; LLM döljs vid låg kapacitet |
| Kväll | KASAM oförändrad | Stabil, WORM-kopplad |

### R2 — Evidens (ADHD/ACT morning anchor)

Implementation intentions (Gawrilow et al. 2011 ADHD) — extern cue + en prioritet. Inga streaks/XP.

### R3 — WORM-schema

Fortsatt `checkins` append-only. `optionSelected`: `intention` | `forge_grounded`. Taktisk checklista client-only i Fas 20.

### R4 — Sanningens Ankare

Read-only `pinned` vault logs när `vaultSessionOpen`. Ingen RAG.

### R5 — Kapacitetsmatris

Nivå 1: Paralys LLM dold, snabbnav max 2 poster.

---

## 3. Safeguards

WORM · tre silos · Locked UX · inga rules-ändringar
