# speglings_system — module plan

**Canonical spec:** [`docs/specs/incoming/Speglar-SPEC.md`](../../docs/specs/incoming/Speglar-SPEC.md) · **Context:** [`.context/modules/speglingssystemet.md`](../../.context/modules/speglingssystemet.md)

## Overview

Speglings-Coachen — ACT + VIVIR + valvjämförelse mot WORM-bevis.

Route: `/dagbok?tab=speglar` (redirect `/speglar`)

## Files

| Path | Role |
|------|------|
| `components/SpeglingsSystem.tsx` | Phase orchestrator (act → vivir → compare), unmount reset |
| `components/ActCalibrationView.tsx` | ACT — validera, `speglingsMirror` AI + fallback |
| `components/VivirStepView.tsx` | VIVIR 5 steg |
| `components/EvidenceCompareView.tsx` | Känsla vs valv (max 5 träffar) |
| `api/speglingsCoachService.ts` | `fetchSpeglingsMirror` → callable |
| `utils/matchVaultEvidence.ts` | Token + weaverTags; filter vävaren_metadata |
| `components/SpeglarEvidencePanel.tsx` | Media + WORM-spara till valv (`action: speglar_bevis`) |
| `../core/ui/EvidenceMediaAttach.tsx` | Delad UI: fil, kamera, ljudinspelning |
| `../core/hooks/useAudioRecorder.ts` | MediaRecorder → webm |
| `../core/types/journalBridge.ts` | Route state från Dagbok SavedStep |

## Status

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| ACT + VIVIR + Compare | Av-gaslighting, ej KBT | Ja | **done** |
| Valv-jämförelse | Fakta vs känsla | Ja | **done** |
| Hamn-bro | Efter compare | Ja | **done** |
| Media → valv | WORM bevis | Ja | **done** |
| Korsref barnen_logs auto | Kladd fråga | Nej | **planned** |
| Projektionsdetektor logg | Notebook | Nej | **planned** |
| Full DCAP pipeline | | Delvis | **planned** |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/specs/incoming/Kladd-2026-05-21-PERSONAL-MASTER.md)

## Valv-integration

- Data: `getVaultLogs(uid)` från `reality_vault` (Firestore SDK — inte Callable)
- Unlock: Shield 3s (Fyren) + PIN → session gate för compare
- Jämförelse: `matchVaultEvidence(searchText, logs, { evidenceOnly: true })`
- Exkluderar konsekvent `category: vävaren_metadata`

## Backend

- Callable: `speglingsMirror` — deploy krävs för prod (se `docs/DEPLOY.md`)

## Nästa fas

1. ~~Smoke prod: `speglingsMirror` deploy + script~~ **done** (`npm run smoke:speglar`)
2. Full DCAP Genkit Speglings-Coachen (utöver mirror)
3. Enforced max 4 meningar i backend; ev. Vector Search på valv
