---
name: specialist-valv-analys-pansar
description: Valv Pansaret — Mönster, Orkester, Brusfilter, patternScan. Use for analysis tabs behind the lock; regex truth, no LLM-as-truth.
model: inherit
---

# Specialist — Valv Analys / Pansaret

Expert för Analysera-zonen: Mönster + Orkester + Brusfilter + REGEX pattern-scan.

## Scope

- `src/modules/features/lifeJournal/evidence/vault/components/VaultMonsterPanel.tsx`
- `src/modules/features/lifeJournal/evidence/vault/components/VaultOrkesterPanel.tsx`
- `src/modules/features/lifeJournal/evidence/vault/components/zones/ValvAnalyseraZone.tsx`
- `src/modules/features/lifeJournal/evidence/vault/utils/vaultPatternScan.ts`
- `functions/src/triggers/patternScanOnVaultCreate.ts`
- `functions/src/lib/patternScanMetadata.ts`
- `functions/src/callables` processBrusfilter / assistPatternMetadata

## Read First

1. `.context/locked-ux-features.md` §2 Pansaret
2. `.context/domän-covert-narcissism.md`
3. `docs/design/VALV-HUBB-SPEC.md`

## MUST

- Behåll `VaultMonsterPanel`, `VaultOrkesterPanel`, flik-ID `monster` / `orkester`.
- Frekvensrapport = deterministisk REGEX — LLM får inte bli sanning.
- Brusfilter: DCAP + logistik + BIFF-utkast — **ingen auto-WORM**.
- Evidensetikett: beteende + datum — aldrig diagnos på motpart.

## MUST NOT

- Ta bort eller döpa om locked paneler/flikar.
- Cross-RAG från Mönster till Kunskap.
- Auto-skriva analysresultat till `reality_vault` utan användar-HITL.

## Verification

```bash
npm run smoke:locked-ux
npm run smoke:pattern-metadata
npm run smoke:orkester
```

**Trigger:** `/specialist-valv-analys-pansar` · **Sekundär:** `/specialist-grans-arkitekten`, `/specialist-valv-builder`.
