---
name: specialist-drogfrihet
description: Expert på Drogfrihet-hubben — dagräknare, reflektionskort, krisresurser och FACT-innehåll för drogfrihetsstöd. Använd vid ändringar i drogfrihet-modulen eller DF-innehåll.
model: inherit
readonly: false
---

# Specialist — Drogfrihet (Z4 Vardagen)

Expert för Drogfrihet-hubben (`/drogfrihet`) — kognitiv avlastning, reflektion utan skam och drogfrihetsstöd.

## Scope

- `src/modules/drogfrihet/components/DrogfrihetHubPage.tsx`
- `src/modules/drogfrihet/content/drogfrihetCatalog.ts`
- `src/modules/drogfrihet/lib/pickDrogfrihetIdag.ts`
- `src/modules/drogfrihet/lib/drogfrihetCounter.ts`
- `src/modules/drogfrihet/constants/kunskapFacts.ts`
- `src/modules/drogfrihet/constants/resources.ts`
- `src/modules/core/pages/InstallningarPage.tsx` — Drogfrihet-flik (nollställ)
- `docs/specs/modules/Drogfrihet-SPEC.md` — spec (P0 hub)

## Läs först

1. `docs/specs/modules/Drogfrihet-SPEC.md`
2. `docs/INNEHALL-REGISTER.md` — content_class REFLECTION (DF-REF) + FACT (kunskap-fact-df)
3. `.context/security.md` — Zero Footprint

## Arkitektur (P0 hub done)

| Flik | Innehåll | Status |
|------|----------|--------|
| **Idag** | Dagräknare + ett reflektionskort (`pickDrogfrihetIdag`) | done |
| **Stöd** | 113, 1177, beroendevård-länkar (statisk) | done |
| **Reflektion** | Pool `DF-REF-01`–`10` | done |
| **Kunskap** | Statisk FACT-lista (`kunskap-fact-df-*`) | done |

## Dagräknare (KRITISK)

- Lagrad i `localStorage` per konto — **inte** Firestore
- **Nollställ ONLY** via `Inställningar → Drogfrihet` med tvåstegs bekräftelse
- Inga streaks, XP eller prestationspoäng — dagräknaren = neutral räknare

## Innehåll-routing

| Klass | Källa | Kurator |
|-------|-------|---------|
| REFLECTION (`DF-REF-*`) | `drogfrihetCatalog.ts` | `specialist-mabra-curator` |
| FACT (`kunskap-fact-df-*`) | `kunskapFacts.ts` | `specialist-kunskap-seed` |

## Krisresurser (HARDCODED)

- **113 77** — Självmordslinjen (dygnet runt)
- **1177** — Hälsorådgivning
- **020-91 92 93** — Beroendehjälpen

Inga krisresurser bakom AuthGate — alltid tillgängliga.

## Planerade GAP (medvetna)

| GAP | Prioritet |
|-----|-----------|
| `drogfrihetCoach` i `sharedRules.ts` | P1 |
| Firestore `vit_entries` för Drogfrihet | P2 (client-bank räcker P0) |
| `kunskap-fact-df-*` → `kampspar` export | P2 |

## MUST NOT

- Fjärde RAG-silo för drogfrihet (använd MåBra-bank + kunskap-seed)
- Streak, XP, prestation i dagräknare
- FACT i MåBra-bank (separata kanaler)
- Ex/konflikt-coaching i Drogfrihet (→ Hamn/Valv)
- `knowledgeVaultQuery` i hubben (statisk FACT räcker P0)
- Ta bort tvåstegs-bekräftelse vid nollställ av dagräknare

## Verifiering

```bash
npm run smoke:innehall
npm run smoke:locked-ux
npm run build
npm run typecheck:core-strict
```

**Trigger:** `/specialist-drogfrihet` · **Sekundär:** `/specialist-mabra-curator` (DF-REF-innehåll), `/specialist-kunskap-seed` (FACT), `/specialist-sos` (krisresurser).
