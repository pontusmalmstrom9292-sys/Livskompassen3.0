# Produktkomplett våg — leverans 2026-06-18

## Implementerat

| Våg | Innehåll | Smoke |
|-----|----------|-------|
| V0 | orkester:night baseline | PASS |
| V1 | `[citat]`/`[tolkning]` i children_logs + UI-väljare | `smoke:barn-epistemik`, `smoke:children` |
| V2 | Barnporten toddler bracket + MB-PLAY-54321 wizard | `smoke:barn-epistemik`, `smoke:mabra` |
| V3 | M3.0-C kapacitetsgate (befintlig `useMabra30Capacity`) + Projekt bild-upload (befintlig) | `smoke:modulvaljare`, `smoke:projekt-regler` |
| V4 | `BarnportenParentHubPanel` på `/familjen?tab=barnporten` + `/barnporten` PWA | `smoke:locked-ux` |
| V5 | Flow P3/P4/P6 **redan live** (`assistPatternMetadata`, `mabraCoach` bank, `dossierAiForeword` timeline) | `smoke:pattern-metadata`, `smoke:dossier` |
| V6 | Arkiv PMIR + handoff sync + ops docs | `orkester:night` · `2026-06-18-v6-leverans.md` |

## V6 — kvar (manuellt)

| ID | Åtgärd | Status |
|----|--------|--------|
| APP-CHECK | Console Enforce | Pontus — Firebase Console |
| DEPLOY | hosting (epistemik + barnporten-paus) | Efter OK |

## Gate

```bash
npm run smoke:barn-epistemik
npm run smoke:locked-ux
npm run smoke:tier1
```
