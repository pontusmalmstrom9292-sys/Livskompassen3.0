# mabra — module plan

## Overview

Måbra-sidan — proaktivt självarbete: KBT, ACT, vagus, självmedkänsla. Eget kluster på hem.

**Route:** `/mabra` · **AuthGate:** ja  
**Canonical:** `.context/modules/mabra_sidan.md` · **Spec:** `docs/specs/incoming/Mabra-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/MabraPage.tsx` | Shell — placeholder; hub + övningar planerade |
| `../core/ui/ClusterGrid.tsx` | Hem-kluster Måbra |
| `../core/routing/AppRoutes.tsx` | Route + AuthGate |
| Planerat: `components/BreathingExercise.tsx` | 4-7-8 offline |
| Planerat: `hooks/useMabraSession.ts` | save session metadata |
| Planerat: `../dagbok/` bro | Spara insikt |

## Status

| Area | Status |
|------|--------|
| Route `/mabra` | **done** |
| MabraPage shell + EmptyState | **done** |
| ClusterGrid kluster | **done** |
| Symptom-hub (3–4 knappar) | **planned** |
| 4-7-8 andning offline | **planned** (MVP #1) |
| Firestore `mabra_sessions` | **planned** |
| `mabra_progress` / coreValues | **planned** |
| Måbra-coach callable | **planned** (fas 2) |
| Web Speech sv-SE | **planned** |
| Bro Dagbok / Kompasser | **planned** |
| Unmount cleanup | **planned** |

## Produktbeslut (låsta 2026-05)

1. `mabra_sessions` metadata ON; fritext opt-in / RAM
2. Symptom-hub; default 3 min (1/3/5 valfritt)
3. Obsidian Calm; ingen natur/streak
4. AI opt-in; ingen Kunskap RAG; ingen proaktiv dagbok
5. Länk till Dagbok/Kompasser — inte auto

## Nästa fas (implementera när användaren säger kör)

1. Symptom-hub UI i `MabraPage`
2. `BreathingExercise` — framer/CSS, offline-first
3. `saveMabraSession` + Firestore rules
4. Avslut + valfri länk Dagbok/kväll

## Avgränsning

- **INTE** Speglar, Hamn, Valv, Kunskap RAG
- **INTE** FloatingDock

## Security notes

- AuthGate
- Känslig fritext: RAM default; Kill Switch global
- Prompts endast backend `sharedRules.ts`
