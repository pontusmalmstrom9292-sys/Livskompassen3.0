# speglings_system — module plan

## Overview

Speglings-Coachen — ACT + VIVIR + valvjämförelse mot WORM-bevis.

Route: `/speglar`

## Files

| Path | Role |
|------|------|
| `components/SpeglingsSystem.tsx` | Phase orchestrator |
| `components/ActCalibrationView.tsx` | ACT — validera, aldrig fixa |
| `components/VivirStepView.tsx` | VIVIR 5 steg |
| `components/EvidenceCompareView.tsx` | Känsla vs valv |
| `utils/matchVaultEvidence.ts` | Token + weaverTags match |

## Status

| Area | Status |
|------|--------|
| ACT flow | **done** |
| VIVIR checklist | **done** |
| Glassmorphism Obsidian Calm | **done** |
| Valvjämförelse | **done** — evidence-only filter |
| DCAP → Speglings-Coachen agent | **planned** |

## Valv-integration

- Data: `getVaultLogs(uid)` från `reality_vault` (WORM)
- Unlock: Shield 3s (Fyren) + WebAuthn → session gate
- Jämförelse: token + `weaverTags` + filter bort `vävaren_metadata`
- Nästa: route DCAP output till Speglings-Coachen card

## Design

- Accent: Electric Indigo `#6366F1`
- Obsidian Calm: `bg-[#0f172a]/60 backdrop-blur-xl border-white/10`
