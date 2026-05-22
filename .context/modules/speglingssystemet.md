# Speglings-Systemet

**Sacred Feature** — reaktiv kognitiv sköld mot gaslighting/RSD.

**Spec (konsoliderad):** [`docs/specs/modules/Speglar-SPEC.md`](../../docs/specs/modules/Speglar-SPEC.md)  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md) (Obsidian Calm)

## Syfte

ACT (validera, aldrig fixa) + VIVIR + jämför känsla mot WORM-bevis. Grey Rock, max 2–4 meningar, ingen JADE. **Skild från MåBra** (proaktiv KBT) och **Kunskap** (livsminne).

## Route och ingång

| | |
|---|---|
| **Route** | `/dagbok?tab=speglar` (redirect `/speglar`) |
| **AuthGate** | `/dagbok` (Hjärtat) |
| **Dock** | Inte i FloatingDock |

**Ingång:** Dagbok `SavedStep` (`journalContext`) · flik **Speglar** i Hjärtat · ClusterGrid.

## UI-flöde

1. **ACT** — `ActCalibrationView` + valfri `speglingsMirror`
2. **VIVIR** — fem steg (`VivirStepView`)
3. **EvidenceCompare** — `matchVaultEvidence` mot `reality_vault` (kräver upplåst valv)
4. **Hamn** — länk med `prefilledMessage` (redigerbart i Hamn)

Zero Footprint: state rensas vid unmount (`SpeglingsSystem`).

## Datamodell

- **Läser:** `reality_vault` via klient `getVaultLogs(uid)`
- **Match:** `matchVaultEvidence` (token + weaverTags; exkl. `vävaren_metadata`)
- **Skriver:** inget permanent

## Backend

| Callable | Roll |
|----------|------|
| `speglingsMirror` | ACT-spegling (Speglings-Coachen prompt) |

Fallback: `mirrorFeeling()` lokalt vid AI-fel.

## Status

| Klart | Delvis | Planerat |
|-------|--------|----------|
| ACT, VIVIR, Compare, journalContext, valv-lås, mirror+fallback, Hamn-bro, media/WORM | Auto korsref barnen_logs | Full DCAP, Vector Search, projektionsdetektor UI |

## Kladd 2026-05-21

- **Kladd:** Projektion, gaslighting, "sanningens ankare" — **inte** Måbra.
- **Gap:** Auto-länk Kasper/Arvid-loggar vid VIVIR — **planerat**, ej MVP.
- **Användning:** Eget tvivel / patologisering från ex — inte proaktiv KBT.

## Säkerhet

- Valv unlock (Fyren/PIN) före bevis
- Kill Switch global
- LLM ≠ auktoritet för bevis

## Kopplingar

- **Dagbok** → bro + context
- **Verklighetsvalvet** → read-only bevis
- **Hamn** → BIFF via `analyzeMessage`

Kod: `src/modules/speglings_system/` · Plan: [`src/modules/speglings_system/module_plan.md`](../../src/modules/speglings_system/module_plan.md)
