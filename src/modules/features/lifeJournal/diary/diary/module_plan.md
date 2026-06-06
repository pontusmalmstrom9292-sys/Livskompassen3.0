# dagbok — module plan

## Overview

Dagbokshubben — Progressive Disclosure journal + async Vävaren tagging.

Route: `/dagbok` · Canonical: `.context/modules/diary/diaryshubben.md` · Spec: `docs/specs/modules/Dagbok-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/DagbokPage.tsx` | Orkestrator — kopplar hook + steg + arkiv |
| Steg-indikator | Borttagen — ett steg i taget via innehåll + Tillbaka (skärmläsare: sr-only) |
| `components/MoodStep.tsx` | Steg 1 — humör-pills |
| `components/ReflectionStep.tsx` | Steg 2 — textarea + röst (Web Speech sv-SE) |
| `components/ConfirmStep.tsx` | Steg 3 — preview + spara |
| `components/SavedStep.tsx` | Steg 4 — bekräftelse, bro `/speglar`, gaslighting-copy |
| `components/JournalArchive.tsx` | Journal-tidslinje med pagination |
| `components/JournalEntryCard.tsx` | Enskild post med datum + trunkering |
| `components/HandoffBox.tsx` | Lager 1 → Valv CTA `/dagbok?tab=bevis` (Fas 4) |
| `@/core/triggers/valvHandoff` | Regex-triggers för HandoffBox |
| `components/DagbokRememberCard.tsx` | IHÅG Dagbok vs Valv |
| `hooks/useJournalFlow.ts` | Wizard-state, save, refresh, unmount cleanup |
| `../core/hooks/useSpeechToText.ts` | Delad röst-till-text (sv-SE) |
| `constants/moods.ts` | `MOOD_OPTIONS`, accent-färger, steg-labels |
| `types/journal.ts` | `JournalEntry`, `JournalStep` |
| `utils/formatJournalDate.ts` | Svensk datumformatering + text-trunkering |
| `api/weaverService.ts` | Fire-and-forget `weaveJournalEntry` |

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
| Vävaren godkännande | Taggar → valv metadata | Ja | **done** 2026-05-31 |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md)

## Security notes

- Journal highly sensitive — CMEK, strict uid rules
- Vävaren → `reality_vault` (`vävaren_metadata`), WORM
- Röst stannar i browser tills save (Zero Footprint)

## Nästa fas (implementera när användaren säger kör)

1. Måbra-bro + villkorlig Speglar efter Vävaren-hotnivå  
2. KBT/ACT-prompter per humör; valfritt humör-only save  
3. Utökad Speglings-Coachen-koppling via DCAP
