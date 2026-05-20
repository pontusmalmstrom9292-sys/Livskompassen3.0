# dagbok — module plan

## Overview

Dagbokshubben — Progressive Disclosure journal + async Vävaren tagging.

Route: `/dagbok`

## Files

| Path | Role |
|------|------|
| `components/DagbokPage.tsx` | Wizard: humör → text → bekräfta → sparad |
| `api/weaverService.ts` | Fire-and-forget `weaveJournalEntry` |
| `../../functions/src/agents/weaverAgent.ts` | Gemini 1.5 Pro tagging |
| `../../functions/src/lib/kampsparRag.ts` | RAG: journal + valv + Kampspår |

## Status

| Area | Status |
|------|--------|
| Progressive Disclosure UI | **done** |
| Journal persist (`journal`) | **done** |
| Vävaren async callable | **done** — deploy `weaveJournalEntry` |
| RAG Firestore | **done** |
| RAG Vector Search 2.0 | **stub** — aktiveras med `VECTOR_SEARCH_INDEX_ID` |
| DCAP → Speglings-Coachen | **planned** |

## Röst-till-text (spec)

- API: Web Speech API (`SpeechRecognition`) med `sv-SE`
- Ett fält i taget: mikrofon-knapp endast på text-steg
- Zero Footprint: röstdata stannar i browser tills explicit save
- Fallback: manuell text om permission nekas

## Security notes

- Journal highly sensitive — CMEK, strict uid rules
- Vävaren metadata → `reality_vault` (`category: vävaren_metadata`), WORM
