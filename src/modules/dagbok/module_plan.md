# dagbok — module plan

## Overview

Dagbokshubben — Progressive Disclosure journal + async Vävaren tagging.

Route: `/dagbok` · Canonical: `.context/modules/dagbokshubben.md` · Spec: `docs/specs/incoming/Dagbok-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/DagbokPage.tsx` | Orkestrator — kopplar hook + steg + arkiv |
| `components/DagbokStepIndicator.tsx` | Visuell steg-rad (Humör → Text → Bekräfta → Klar) |
| `components/MoodStep.tsx` | Steg 1 — humör-pills |
| `components/ReflectionStep.tsx` | Steg 2 — textarea + röst (Web Speech sv-SE) |
| `components/ConfirmStep.tsx` | Steg 3 — preview + spara |
| `components/SavedStep.tsx` | Steg 4 — bekräftelse, bro `/speglar`, gaslighting-copy |
| `components/JournalArchive.tsx` | Journal-tidslinje med pagination |
| `components/JournalEntryCard.tsx` | Enskild post med datum + trunkering |
| `hooks/useJournalFlow.ts` | Wizard-state, save, refresh, unmount cleanup |
| `../core/hooks/useSpeechToText.ts` | Delad röst-till-text (sv-SE) |
| `constants/moods.ts` | `MOOD_OPTIONS`, accent-färger, steg-labels |
| `types/journal.ts` | `JournalEntry`, `JournalStep` |
| `utils/formatJournalDate.ts` | Svensk datumformatering + text-trunkering |
| `api/weaverService.ts` | Fire-and-forget `weaveJournalEntry` |

## Status

| Area | Status |
|------|--------|
| Progressive Disclosure UI | **done** |
| Komponent-split (Obsidian Calm) | **done** |
| `JournalEntry` typ + `FIRESTORE_COLLECTIONS.journal` | **done** |
| Journal persist (`journal`) | **done** |
| Vävaren async callable | **done** |
| Bro till `/speglar` efter sparad post | **done** — SavedStep + `journalContext` |
| Röst-till-text (Web Speech sv-SE) | **done** — ReflectionStep + `useSpeechToText` |
| Full journal-tidslinje (>5) | **done** — pagination i JournalArchive |
| Wizard cleanup on unmount | **done** — useJournalFlow |
| Fortsätt-knapp indigo (design-master) | **done** — btn-pill--secondary |
| SavedStep gaslighting-copy | **done** |
| StepIndicator (core/ui) | **done** — DagbokStepIndicator wrapper |
| TimelineEntry (core/ui) | **done** — JournalEntryCard |
| Variant B: long-press dagbok→valv | **planned** (nav-beslut) |
| DCAP → Speglings-Coachen (utöver mirror) | **planned** |

## Security notes

- Journal highly sensitive — CMEK, strict uid rules
- Vävaren → `reality_vault` (`vävaren_metadata`), WORM
- Röst stannar i browser tills save (Zero Footprint)

## Nästa fas (implementera när användaren säger kör)

1. Variant B navigation (long-press dagbok → valv)  
2. Utökad Speglings-Coachen-koppling via DCAP
