# dagbok — module plan

## Overview

Dagbokshubben — Progressive Disclosure journal + async Vävaren tagging.

Route: `/dagbok` · Canonical: `.context/modules/dagbokshubben.md` · Spec: `docs/specs/modules/Dagbok-SPEC.md`

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
| `api/journalWovenService.ts` | Opt-in `journalWovenToKampspar` (G7) |
| `components/ConfirmStep.tsx` | Opt-in checkbox → Kampspár |

## Status

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| Wizard humör→text→sparad | Lager 1 fasad | Ja | **done** |
| Fyren 3s → valv | Dold ingång | Ja | **done** |
| Vävaren async | Taggar → valv metadata | Ja | **done** |
| Bro Speglar | Efter sparad post | Ja | **done** |
| Måbra-bro in (låg energi) | Kladd | Ja (`mabraBridge.ts`) | **done** |
| Måbra-bro ut (Låg/Spänd) | Kladd | Nej | **planned** |
| Humör-only save (Måbra path) | Kladd | Ja | **done** |
| Humör-only save (generellt) | Kladd | Nej | **planned** |
| KBT per humör | Kladd | Nej | **planned** |
| Vävaren godkännande | Master §I | Auto | **planned** |
| G7 journal_woven → kampspar | Opt-in only | Ja | **done** |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md)

## Security notes

- Journal highly sensitive — CMEK, strict uid rules
- Vävaren → `reality_vault` (`vävaren_metadata`), WORM
- Röst stannar i browser tills save (Zero Footprint)

## Nästa fas (implementera när användaren säger kör)

1. Måbra-bro + villkorlig Speglar efter Vävaren-hotnivå  
2. KBT/ACT-prompter per humör; valfritt humör-only save  
3. Utökad Speglings-Coachen-koppling via DCAP
