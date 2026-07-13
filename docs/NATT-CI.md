V# Natt-CI — `@cursor/sdk`

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

Kräver `.env` med Firebase web-config + **App Check debug-token** för callables:

```bash
npm run setup:env   # fyller VITE_FIREBASE_* från google-services.json
```

Lägg till i `.env` (eller Cursor Cloud Environment secrets):

- `VITE_APP_CHECK_DEBUG_TOKEN` — Firebase Console → App Check → Manage debug tokens

Utan debug-token: anonym inloggning fungerar, men `ingestKampsparEntry` m.fl. nekas med *App Check-verifiering krävs*.

Live-smokes:

- `npm run smoke:valv`
- `npm run smoke:kunskap`
- `npm run smoke:dossier`

### Firebase MCP (valfritt)

För `firebase_get_sdk_config` / `firebase_list_apps`: kör `firebase_login` i Cursor MCP och klistra in auth-koden.

---

## Blockerare (oförändrat)

| Krav | Status |
|------|--------|
| G6 Drive E2E → `kb_docs` | **open** (fork — Drive 403) |
| GCP FAS4 steg 3–7 | Väntar G6 + `OK steg N` |

---

## Historik

Ersätter manuella overnight-sessioner (historik: [`docs/archive/OVERNIGHT_REPORT.md`](archive/OVERNIGHT_REPORT.md)).
