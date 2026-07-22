# Valv — visionsbeslut (B1)

**Datum:** 2026-06-15  
**Status:** Godkänd via Cursor CHECKPOINT (ersätter ChatBox chatt 1)  
**Källa:** Repomix `repomix-valv-komplett-2026-06-15` + levande kod

---

## Tre pelare

| # | Pelare | Zon / läge | Teknik | Användarbehov |
|---|--------|------------|--------|---------------|
| 1 | **Mönster & bevis** | `analysera`, `samla`, `granska` | WORM `reality_vault`, DCAP, Mönster/Orkester (locked) | Behålla verklighetsuppfattning; dokumentation för eventuell vårdnadstvist |
| 2 | **Egen utveckling** | `vit` (`mitt_vit`) | Separat från bevis-WORM; MåBra-bank | Självkänsla, gränser, mål — inte blandat med bevis |
| 3 | **Kunskapsbank / arkiv** | `kunskap`, `sok` (Valv-Chat) | Tre silos — **aldrig** cross-RAG | Oföränderligt minne; Inkast → granska → arkiv (HITL) |

---

## Dold kärna (plausible deniability)

- Inga ord «valv», «bevis», «arkiv» i publikt chrome (drawer, dock, launcher).
- Valv-rader i drawer **endast** när `vaultSessionOpen` / PIN upplåst.
- Ingång: Fyren long-press / biometri → `/valvet`.
- Systemet jobbar i bakgrunden (Inkast, synapser, klassificering) — användaren släpper bevis när det känns rätt.

---

## Användarresa (förenklad)

1. **Släpp** — Inkast (fil/text) i Valv eller Capture → pending
2. **Granska** — HITL-kö (`InboxReviewQueue`) → WORM
3. **Analysera** — Mönster + Orkester (locked, oförändrat)
4. **Exportera** — Dossier vid behov
5. **Mer** — Forensik (Hamn, Speglar, …) bakom progressive disclosure

Primär navigation = **lägesväljare** (4 + Mer), inte 14 synliga flikar.

---

## Scope-begränsning

- Fas B1: frontend-only enligt `VALVET_SUPERMODULE_PLAN.md`
- Ingen ändring av callables, rules, eller locked panel-logik
- Ingen auto-promote barnlogg → Valv
