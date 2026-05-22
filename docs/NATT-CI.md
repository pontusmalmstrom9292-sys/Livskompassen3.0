# Natt-CI — `@cursor/sdk` (WAIT)

**Datum:** 2026-05-22  
**Status:** **READY (manuell)** — G6 PASS 2026-05-22; FAS4 steg 1–7 **done**. `@cursor/sdk` saknas — kör byggpass-kedja via Agent/`scripts/README.md` tills Natt-CI paketeras.

---

## Syfte (planerat)

Automatiserad nattpass-loop via [`@cursor/sdk`](https://www.npmjs.com/package/@cursor/sdk):

1. `cd functions && npm run build`
2. `npm run build` (frontend)
3. `npx eslint . --max-warnings 0`
4. `npm run smoke:valv` / `smoke:kunskap` / `smoke:dossier`

Ersätter manuella overnight-sessioner (historik: [`docs/archive/OVERNIGHT_REPORT.md`](archive/OVERNIGHT_REPORT.md)).

---

## Blockerare

| Krav | Status |
|------|--------|
| G6 Drive E2E → `kb_docs` | **done** 2026-05-22 |
| GCP FAS4 steg 3–7 | **done** 2026-05-22 (G6 förutsatt) |
| `@cursor/sdk` i repo | **Saknas** — se [`docs/GCP-INVENTORY-LATEST.md`](GCP-INVENTORY-LATEST.md) |

---

## Trigger (framtida)

När G6 **done** och konsolidering låst:

```
kör Natt-CI setup
```

Skapar då dedikerat automation-paket + valfri GitHub Action — **inte** i denna fas.
