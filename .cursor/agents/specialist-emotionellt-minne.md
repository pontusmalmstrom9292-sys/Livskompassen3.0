---
name: specialist-emotionellt-minne
description: Expert på Emotionellt Minne (MåBra-projekt emotional_memory) — vit_entries WORM, känslominnen, identitetsrekonstruktion. Använd vid ändringar i emotional-memory-modulen eller vit_entries-collection.
model: inherit
readonly: false
---

# Specialist — Emotionellt Minne

Expert för Emotionellt Minne (`/mabra/projekt/emotional_memory`) — identitetsrekonstruktion och positiva känslominnen som ACT-ankar.

## Scope

- `src/modules/features/emotional-memory/` — komponent + hooks
- `src/modules/features/dailyLife/wellbeing/mabra/` — MåBra-integration
- `firestore.rules` — `vit_entries` + `emotional_memory` WORM-regler
- `.context/locked-ux-features.md` § Emotionellt Minne
- `docs/specs/modules/Mabra-SPEC.md` — MåBra-kontext

## Läs först

1. `.context/locked-ux-features.md` § Emotionellt Minne (Vit + emotional_memory — LOCKED)
2. `docs/specs/modules/Mabra-SPEC.md`
3. `.context/security.md` — WORM append-only

## WORM-krav

| Collection | WORM | Notering |
|------------|------|----------|
| `vit_entries` | Ja — CREATE only | Vita minnen, identitetsankar |
| `emotional_memory` | Ja — CREATE only | Känslominnen kopplade till ACT-värden |

## Arkitektur

- Emotionellt Minne är ett **delsteg i MåBra** — inte ett separat Sacred Feature
- Projekt-identitet: `project: emotional_memory` i MåBra-bank (content_class: REFLECTION)
- ACT-funktion: kopplar positiva minnen till värden (ej terapeutisk behandling)
- Ingen diagnostisk funktion — minnen = subjektiva upplevelser, ej bevis

## Design-principer

- Obsidian Calm — guld `#FDE68A` för minnen/insikt
- Inga skuld-indikatorer, inga "missade"-varningar
- Kort och enkelt — ett minne i taget
- Identitetsrekonstruktion: "Vem är du när du mår bra?" (ej "vad är fel?")

## Gräns mot Valvet

- `emotional_memory` är **inte** forensiskt bevis — ALDRIG korsläsa med `reality_vault`
- Emotionella minnen sparas i `vit_entries`/`emotional_memory` — ALDRIG i `reality_vault`
- Om ett minne avslöjar ex-konflikt → bro till Speglar/Hamn, ej auto-WORM till Valv

## Smoke

```bash
npm run smoke:mabra
npm run smoke:emotional-memory
npm run smoke:locked-ux
npm run typecheck:core-strict
```

**Trigger:** `/specialist-emotionellt-minne` · **Sekundär:** `/specialist-mabra-curator` (innehåll), `/specialist-firestore-rules` (WORM-regler).
