# PMIR — Valv Samla A2.1 (CalmCollapsible)

**Datum:** 2026-06-19  
**Våg:** Frontend polish masterplan A2.1  
**Status:** Godkänd implementation  
**STOP:** Ingen ändring av Mönster/Orkester, rules, eller ingest-routing.

---

## Scope

| Synlig (primär) | Bakom fold |
|-----------------|------------|
| Inkast (`VaultInkastCompact`) | Manuell post (`CalmCollapsible`) |
| Granskningskö-knapp | Drive-hint (`CalmCollapsible`) |
| Bevislista (`VaultLogList` i `ValvSamlaZone`) | — |

---

## Risk

| Risk | Mitigation |
|------|------------|
| Locked UX regression | `smoke:locked-ux` guards oförändrade |
| WORM ingest | Ingen ändring av `saveLog` / CaptureSuperModule |
| Drive auto-promote | Hint oförändrad copy — fortfarande HITL |

---

## Smoke

```bash
npm run build
npm run smoke:locked-ux
npm run smoke:design-modules
npm run smoke:valv-mode
npm run smoke:vault-worm
npm run smoke:inbox
npm run smoke:weaver-hitl
```

---

## Deploy

`firebase deploy --only hosting` efter smoke PASS.
