# Natt-CI — `@cursor/sdk` (WAIT)

**Datum:** 2026-05-22  
**Status:** **WAIT** — implementera **inte** före G6 PASS + doc-synk + GCP-konsolidering steg 3–7.

---

## Syfte (planerat)

Automatiserad nattpass-loop via [`@cursor/sdk`](https://www.npmjs.com/package/@cursor/sdk):

1. `cd functions && npm run build`
2. `npm run build` (frontend)
3. `npx eslint . --max-warnings 0`
4. `npm run smoke:valv` / `smoke:kunskap` / `smoke:dossier`

Ersätter manuella overnight-sessioner dokumenterade i [`docs/OVERNIGHT_REPORT.md`](OVERNIGHT_REPORT.md).

---

## Blockerare

| Krav | Status |
|------|--------|
| G6 Drive E2E → `kb_docs` | **open** (fork — Drive 403) |
| GCP FAS4 steg 3–7 | Väntar G6 + `OK steg N` |
| `@cursor/sdk` i repo | **Saknas** — se [`docs/GCP-INVENTORY-LATEST.md`](GCP-INVENTORY-LATEST.md) |

---

## Trigger (framtida)

När G6 **done** och konsolidering låst:

```
kör Natt-CI setup
```

Skapar då dedikerat automation-paket + valfri GitHub Action — **inte** i denna fas.
