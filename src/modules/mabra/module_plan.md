# mabra — module plan

## Overview

Måbra-sidan — proaktivt självarbete: KBT, ACT, vagus, självmedkänsla. Eget kluster på hem.

**Route:** `/mabra` · **AuthGate:** ja  
**Canonical:** `.context/modules/mabra_sidan.md` · **Spec:** `docs/specs/modules/Mabra-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/MabraPage.tsx` | Flow: hub → akut/duration/exercise/reframing → complete |
| `components/SymptomHub.tsx` | 3 symptom-knappar |
| `components/AkutLanding.tsx` | Panik/RSD validering före duration |
| `components/DurationPicker.tsx` | 1 / 3 / 5 min (endast panic_rsd) |
| `components/BreathingExercise.tsx` | 4-7-8 framer, offline (per hub-copy) |
| `components/GroundingExercise.tsx` | 5-4-3-2-1 grounding, offline |
| `components/ReframingExercise.tsx` | 4-stegs thought record light, RAM-only (self_critical) |
| `components/ValuesCompass.tsx` | ACT värderingar 3–5 (mutable `mabra_progress`) |
| `components/MabraCoachPanel.tsx` | Opt-in coach efter övning (`#6366F1`) + Speglar guardrail + röst |
| `../core/ui/SpeechMicRow.tsx` | Delad Web Speech sv-SE (reframing + coach) |
| `api/mabraCoachService.ts` | Callable `mabraCoach` |
| `constants.ts` / `types.ts` | Hub, duration, faser |
| `../core/firebase/firestore.ts` | `saveMabraSession` |

## Status

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| Route `/mabra` + kluster | Proaktiv rehab, ej ex | Ja | **done** |
| Symptom-hub 3 val | Panik/självkritik/hitta mig | Ja | **done** |
| Hub → andning / grounding / reframing | Vagus 4-7-8; 5-4-3-2-1; 4-stegs reframing | Ja | **done** |
| `mabra_sessions` WORM | Metadata, ej gamification | Ja | **done** |
| Bro Dagbok/kväll | Länk med `/dagbok?from=mabra&hub=…&energy=low` | Ja | **done** (fas 2c) |
| Reframing / thought record | self_critical hub, valfri 1-min andning | Ja | **done** (fas 2a) |
| AkutLanding panic_rsd | Validering före duration + panik-andning UX | Ja | **done** (fas 2b) |
| ACT ValuesCompass + `mabra_progress` | Länk under hub, 3–5 värden | Ja | **done** (fas 2d) |
| Måbra-coach callable | Opt-in, ingen RAG, Speglar guardrail | Ja | **done** (fas 2e) |
| Speglar guardrail vid ex-text | Heuristik → `/speglar` | Ja | **done** (fas 2e) |
| Web Speech sv-SE | Reframing + coach (`SpeechMicRow`) | Ja | **done** (fas 2f) |
| Trauma-historia i Kunskap | **Policy: opt-in ingest** | Delvis | **policy** |
| Stjärnbilder / streak | Notebook | Nej | **rejected** |
| Nordisk skymning UI | Notebook | Nej | **rejected** |

**Källa:** [`docs/archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md)

## Nästa fas

Måbra fas 2 (2a–2f) **klar**. Eventuellt: grounding-förbättringar (research brief §3).

## Avgränsning

- **INTE** Speglar, Hamn, Valv, Kunskap RAG
- **INTE** FloatingDock

## Security notes

- AuthGate; WORM append-only `mabra_sessions`
- Tidig exit ("Avsluta nu") sparar inte session
