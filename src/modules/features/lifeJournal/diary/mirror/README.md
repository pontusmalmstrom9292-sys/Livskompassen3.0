# speglings_system

> Sacred Feature — reaktiv kognitiv sköld (ACT + VIVIR + bevisjämförelse).

## Syfte

Validera utan att fixa. Jämför känsla mot WORM-bevis. Grey Rock, max 2–4 meningar. **Skild från MåBra** (proaktiv KBT) och **Kunskap** (livsminne).

## Route och ingång

| | |
|---|---|
| **Route** | `/dagbok?tab=speglar` (redirect `/speglar`) |
| **AuthGate** | via `/dagbok` (Hjärtat) |
| **Dock** | ej i FloatingDock |

**Ingång:** Dagbok SavedStep · flik Speglar · ClusterGrid · bro från MåBra-coach.

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/SpeglingsSystem.tsx` | Fas-orkestrator, unmount reset |
| `components/ActCalibrationView.tsx` | ACT + `speglingsMirror` |
| `components/VivirStepView.tsx` | VIVIR 5 steg |
| `components/EvidenceCompareView.tsx` | Känsla vs valv |
| `components/SpeglarEvidencePanel.tsx` | Media → valv |
| `api/speglingsCoachService.ts` | Callable wrapper |
| `utils/matchVaultEvidence.ts` | Token-match mot `reality_vault` |

## Data

- **Läser:** `reality_vault` (kräver upplåst valv)
- **Skriver:** inget permanent (Zero Footprint)

**Callable:** `speglingsMirror` (Speglings-Coachen)

## Beror på

- `core` — journalBridge, EvidenceMediaAttach, auth
- `verklighetsvalvet` — bevisläsning

## Kopplingar

- **dagbok** — bro + journalContext
- **safe_harbor** — BIFF via `prefilledMessage`
- **mabra** — guardrail vid ex-text

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | Zero Footprint — inget sparas |
| **RAG / chatt** | Nej — läser `reality_vault` klient-side |
| **PDF / samlad export** | — |
| **Planerat** | Vector Search valv (ej Kunskap) |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/speglingssystemet.md)
- [Speglar-SPEC](../../../docs/specs/modules/Speglar-SPEC.md)
