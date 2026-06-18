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
| V6 | PMIR docs — arkiv/App Check/BP-PUSH (ingen prod-ändring utan OK) | se nedan |

## V6 — kvar med Pontus OK

| ID | Åtgärd | Varför stopp |
|----|--------|--------------|
| ARKIV | Arkiv-batch utförande | PMIR + explicit godkännande före mass-flytt |
| APP-CHECK | Console Enforce | Manuell Firebase Console |
| BP-PUSH | FCM/notiser | Ny infra + kostnad — eval only |
| DEPLOY | invalidateSession + hosting | Named deploy efter OK |

## Gate

```bash
npm run smoke:barn-epistemik
npm run smoke:locked-ux
npm run smoke:tier1
```
