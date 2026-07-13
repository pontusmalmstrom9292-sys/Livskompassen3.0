# Natt-CI — `@cursor/sdk`

**Datum:** 2026-05-22 (uppdaterad 2026-07-13)  
**Status:** **AKTIV (infrastruktur)** — SDK + runner i repo; live-smokes kräver `.env`.

---

## Körning

```bash
npm run natt:ci          # Fas A: smoke:predeploy:build · Fas B: live om .env finns
npm run sdk:natt-ci      # Startar cloud agent via @cursor/sdk (CURSOR_API_KEY)
```

### Fas A (offline / CI)

1. `functions` — `npm install` (vid behov) + `npm run build`
2. `npm run build` (frontend)
3. `npm run smoke:predeploy` (samma gate som merge — se `package.json`)

### Fas B (live Firebase, valfri)

Kräver `.env` (kopiera från `.env.example`):

- `npm run smoke:valv`
- `npm run smoke:kunskap`
- `npm run smoke:dossier`

---

## Blockerare (oförändrat)

| Krav | Status |
|------|--------|
| G6 Drive E2E → `kb_docs` | **open** (fork — Drive 403) |
| GCP FAS4 steg 3–7 | Väntar G6 + `OK steg N` |

---

## Historik

Ersätter manuella overnight-sessioner (historik: [`docs/archive/OVERNIGHT_REPORT.md`](archive/OVERNIGHT_REPORT.md)).
