# PMIR-A — P3 Mönster Flow-metadata

**Datum:** 2026-06-18 · **Status:** **IMPLEMENTERAD** (Pontus valde P3)  
**Route:** `/valvet?vaultTab=monster` · **Callable:** `assistPatternMetadata`

---

## Beslut

| Fält | Värde |
|------|-------|
| Scope | FLOW-lager i `pattern_scan_metadata` — **inte** WORM `reality_vault` |
| DCAP | `dcapGatePatternAssist` i kod före LLM (längd 12–12000 tecken) |
| LLM | `gemini-2.5-flash` — stängd katalog `TACTIC_PATTERN_DEFS` only |
| Rate | `assistPatternMetadata` max 2/timme per UID |
| UX | `VaultMonsterPanel` — knapp «Flow-assist (kompletterande)» |

## Filer

| Fil | Roll |
|-----|------|
| `functions/src/lib/patternMetadataAssist.ts` | LLM + validering |
| `functions/src/lib/patternScanMetadata.ts` | FLOW sidecar write |
| `functions/src/callables/valv.ts` | `assistPatternMetadata` |
| `src/.../patternScanService.ts` | Frontend callable |
| `src/.../VaultMonsterPanel.tsx` | UI trigger |

## Smoke

```bash
cd functions && npm run build
npm run smoke:pattern-metadata
npm run smoke:valv-security
npm run smoke:locked-ux
```

## Deploy

```bash
firebase deploy --only functions:assistPatternMetadata,hosting
```

**MUST NOT:** cross-RAG Valv→MåBra · diagnos i metadata · auto-FLOW vid varje upload (manuell/batch — sparar krediter)
