# mabra — module plan

## Overview

Måbra-sidan — proaktivt självarbete: KBT, ACT, vagus, självmedkänsla. Eget kluster på hem.

**Route:** `/mabra` · **AuthGate:** ja  
**Canonical:** `.context/modules/mabra_sidan.md` · **Spec:** `docs/specs/incoming/Mabra-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/MabraPage.tsx` | Flow: hub → duration/exercise → complete (routing per symptom) |
| `components/SymptomHub.tsx` | 3 symptom-knappar |
| `components/DurationPicker.tsx` | 1 / 3 / 5 min |
| `components/BreathingExercise.tsx` | 4-7-8 framer, offline (per hub-copy) |
| `components/GroundingExercise.tsx` | 5-4-3-2-1 grounding, offline |
| `components/MabraComplete.tsx` | Avslut + länkar Dagbok/kväll |
| `constants.ts` / `types.ts` | Hub, duration, faser |
| `../core/firebase/firestore.ts` | `saveMabraSession` |

## Status

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| Route `/mabra` + kluster | Proaktiv rehab, ej ex | Ja | **done** |
| Symptom-hub 3 val | Panik/självkritik/hitta mig | Ja | **done** |
| Hub → andning / grounding | Vagus 4-7-8; 5-4-3-2-1 | Ja | **done** |
| `mabra_sessions` WORM | Metadata, ej gamification | Ja | **done** |
| Bro Dagbok/kväll | Länk, ej auto | Ja | **done** |
| Reframing / thought record | Kladd coping | Nej | **planned** |
| Måbra-coach + RAG dagbok | Kladd — opt-in only | Nej | **planned** |
| Trauma-historia i Kunskap | **Policy: opt-in ingest** | Delvis | **policy** |
| Stjärnbilder / streak | Notebook | Nej | **rejected** |
| Nordisk skymning UI | Notebook | Nej | **rejected** |

**Källa:** [`docs/specs/incoming/Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/specs/incoming/Kladd-2026-05-21-PERSONAL-MASTER.md)

## Nästa fas

1. Deploy Firestore rules + indexes (`firebase deploy --only firestore`)
2. Reframing / thought record light
3. Måbra-coach callable (opt-in)

## Avgränsning

- **INTE** Speglar, Hamn, Valv, Kunskap RAG
- **INTE** FloatingDock

## Security notes

- AuthGate; WORM append-only `mabra_sessions`
- Tidig exit ("Avsluta nu") sparar inte session
