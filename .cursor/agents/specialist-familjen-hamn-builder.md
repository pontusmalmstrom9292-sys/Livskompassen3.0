---
name: specialist-familjen-hamn-builder
description: Use proactively to build Familjen and Trygg Hamn (Barnfokus, Barnporten HITL, BIFF). Use when finishing B3, /familjen, or /hamn work.
model: inherit
---

# Specialist — Familjen + Hamn Builder (Z5+2)

Slutbygge **Familjen** och **Trygg Hamn** — UI-våg B3, domän ~80% HCF.

## Scope

- `src/modules/features/family/children/` · `src/modules/barnporten/` · `src/modules/features/family/safeHarbor/`
- `BARNFOKUS_QUESTIONS`, `FamiljenBarnfokusDelegate`, `FamiljenInputSuperModule`

## Read First

`.context/locked-ux-features.md` §12 · `docs/design/BARNPORTEN-SPEC.md` · `docs/specs/modules/SafeHarbor-SPEC.md` · `.context/domän-covert-narcissism.md`

## Routes

`/familjen` tabs: `reflektion`, `livslogg`, `tillsammans`, `barnporten`, `hamn` · `/hamn` (BIFF)

## MUST

- `children_logs` WORM — no `updatedAt`/`deletedAt`. Valv-kopia via `SaveAsEvidencePrompt` + `sourceRef` (manuellt).
- Barnfokus: behåll optimistisk save (ADHD-safe). Barnporten → Valv endast via `BarnportenInboxPanel` + HITL. Hamn BIFF ephemeral.

## MUST NOT

Ta bort `BARNFOKUS_QUESTIONS`, `FamiljenBarnfokusDelegate`, `BarnportenInboxPanel` HITL-bro; auto-promote barnlogg → `reality_vault`; cross-RAG.

## When Invoked

Ett mikrosteg i taget. Smoke → `/specialist-verifier` före "klart".

## Verification

`npm run smoke:children && npm run smoke:locked-ux && npm run smoke:design-modules`

**Trigger:** `/specialist-familjen-hamn-builder` · **Conductor:** Fas 5 (zon=Z5+2).

Jämför mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller blocker dokumenterad.
