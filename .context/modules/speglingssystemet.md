# Speglings-Systemet

**Sacred Feature** — reaktiv kognitiv sköld mot gaslighting/RSD.

**Kanonisk kod:** `src/modules/features/lifeJournal/diary/mirror/`  
**Spec (konsoliderad):** [`docs/specs/modules/Speglar-SPEC.md`](../../docs/specs/modules/Speglar-SPEC.md)  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md) (Obsidian Calm)

## Syfte

ACT (validera, aldrig fixa) + VIVIR + jämför känsla mot WORM-bevis. Grey Rock, max 2–4 meningar, ingen JADE. **Skild från MåBra** (proaktiv KBT) och **Kunskap** (livsminne).

## Route och ingång

| | |
|---|---|
| **Route** | `/hjartat?tab=speglar` (legacy redirect `/speglar`) |
| **AuthGate** | `/hjartat` (Hjärtat) |
| **Dock** | Inte i FloatingDock |

**Ingång:** Dagbok `SavedStep` (`journalContext`) · flik **Speglar** i Hjärtat · ClusterGrid.

## UI-flöde

1. **ACT** — `ActCalibrationView` + valfri `speglingsMirror`
2. **VIVIR** — fem steg (`VivirStepView`)
3. **EvidenceCompare** — `matchVaultEvidence` mot `reality_vault` (kräver upplåst valv)
4. **Hamn** — länk med `prefilledMessage` (redigerbart i Familjen → Trygg hamn)

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

## Säkerhet

- Valv unlock (Fyren/PIN) före bevis
- Device Clear global
- LLM ≠ auktoritet för bevis

## Kopplingar

- **Dagbok** → bro + context
- **Verklighetsvalvet** → read-only bevis
- **Hamn** → BIFF via `analyzeMessage`

Kod: `src/modules/features/lifeJournal/diary/mirror/` · Plan: [`src/modules/features/lifeJournal/diary/mirror/module_plan.md`](../../src/modules/features/lifeJournal/diary/mirror/module_plan.md)
