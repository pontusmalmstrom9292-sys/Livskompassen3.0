# speglings_system — module plan

## Overview

Speglings-Coachen — ACT + VIVIR + valvjämförelse mot WORM-bevis.

Route: `/speglar` · Canonical: `.context/modules/speglingssystemet.md` · Spec: `docs/specs/incoming/Speglar-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/SpeglingsSystem.tsx` | Phase orchestrator (act → vivir → compare), unmount reset |
| `components/ActCalibrationView.tsx` | ACT — validera, `speglingsMirror` AI + fallback |
| `components/VivirStepView.tsx` | VIVIR 5 steg |
| `components/EvidenceCompareView.tsx` | Känsla vs valv (max 5 träffar) |
| `api/speglingsCoachService.ts` | `fetchSpeglingsMirror` → callable |
| `utils/matchVaultEvidence.ts` | Token + weaverTags; filter vävaren_metadata |
| `constants/vivirSteps.ts` | VIVIR-steg + Grey Rock copy |
| `../core/types/journalBridge.ts` | Route state från Dagbok SavedStep |

## Status

| Area | Status |
|------|--------|
| ACT flow | **done** |
| VIVIR checklist | **done** |
| Glassmorphism Obsidian Calm | **done** |
| Valvjämförelse (evidence-only filter) | **done** |
| Klient `getVaultLogs` + matchVaultEvidence | **done** |
| HomePage bento-ingång | **done** |
| Ingång från dagbok SavedStep | **done** — `journalContext` prefiller känsla/humör |
| `speglingsMirror` callable (AI-spegling) | **done** — deterministisk fallback vid fel |
| AI-accent `#6366F1` | **done** — `glass-card--ai`, `accent-ai` |
| Zero Footprint vid unmount | **done** — SpeglingsSystem cleanup |
| Dagbok journal/weaverTags som initial kontext | **done** |
| Safe Harbor → BIFF routing | **planned** |
| Full DCAP Genkit-pipeline | **planned** (mirror callable räcker för smoke) |

## Valv-integration

- Data: `getVaultLogs(uid)` från `reality_vault` (Firestore SDK — inte Callable)
- Unlock: Shield 3s (Fyren) + PIN → session gate för compare
- Jämförelse: `matchVaultEvidence(searchText, logs, { evidenceOnly: true })`
- Exkluderar konsekvent `category: vävaren_metadata`

## Backend

- Callable: `speglingsMirror` — deploy krävs för prod (se `docs/DEPLOY.md`)

## Nästa fas (implementera när användaren säger kör)

1. Bro till `/hamn` med meddelande/kontext  
2. Full DCAP Genkit Speglings-Coachen (utöver mirror)
