# Natt-CI — `@cursor/sdk`

**Datum:** 2026-07-13  
**Status:** **AKTIV** — två lokala runners + valfri SDK-molnagent.

---

## Snabbstart

| Kommando | Runner | När |
|----------|--------|-----|
| `npm run natt:ci` | `scripts/natt-ci.mjs` | **Kanon** — predeploy-gate + valfria live-smokes |
| `npm run natt-ci` | `scripts/natt_ci.mjs` | Orkester-faser A–D (`orkester:night` + ikoner + git) |
| `npm run sdk:natt-ci` | `scripts/sdk-natt-ci.mjs` | Cloud agent via `@cursor/sdk` (fallback → `natt:ci`) |
| `npm run natt-ci:setup` | `scripts/natt_ci_setup.mjs` | Verifiera SDK, Playwright, functions-deps |

---

## Runner 1 — `natt:ci` (merge-gate / live)

```bash
npm run natt:ci
```

### Fas A (offline / CI)

1. `functions` — `npm install` (vid behov) + `npm run build`
2. `npm run build` (frontend)
3. `npx playwright install chromium` (vid behov)
4. `npm run smoke:predeploy`

### Fas B (live Firebase, valfri)

Kräver `.env` med Firebase web-config + **App Check debug-token**:

```bash
npm run setup:env   # fyller VITE_FIREBASE_* från google-services.json
```

Lägg till i `.env` (eller Cursor Cloud Environment secrets):

- `VITE_APP_CHECK_DEBUG_TOKEN` — Firebase Console → App Check → Manage debug tokens

Utan debug-token: anonym inloggning fungerar, men callables nekas med *App Check-verifiering krävs*.

Live-smokes:

- `npm run smoke:valv`
- `npm run smoke:kunskap`
- `npm run smoke:dossier`

---

## Runner 2 — `natt-ci` (orkester nattpass)

```bash
npm run natt-ci              # A+B+C+D
npm run natt-ci:fas-a        # orkester:night + valv/kunskap/dossier
npm run natt-ci:fas-b        # ikoner (v4 endast vid generator-ändring)
npm run natt-ci:fas-c        # git/arbetsyta
npm run natt-ci -- --agent   # + readonly SDK-sammanfattning
```

| Fas | Innehåll |
|-----|----------|
| **A** | `orkester:night` + valv/kunskap/dossier smoke |
| **B** | `smoke:locked-icons`; v4-batch vid generator-ändring |
| **C** | Git-status — varnar för secrets |
| **D** | Rapport `docs/evaluations/YYYY-MM-DD-orkester-natt.md` |

State: `.orkester/natt-ci-state.json` · Logg: `.orkester/natt-ci-runs/`

**GitHub Actions:** `.github/workflows/natt-ci.yml` — manuell `workflow_dispatch`.

---

## SDK-moln (`sdk:natt-ci`)

```bash
export CURSOR_API_KEY="cursor_..."
npm run sdk:natt-ci
```

Startar cloud agent mot repo; utan API-nyckel → lokal `natt:ci`.

---

## MUST NOT

- Auto-deploy eller merge till `main` i nattpasset
- Committa `.env`, service account `*.json`, eller `google-services.json`
- Ändra `firestore.rules` / `sharedRules.ts` utan PMIR

---

## Relaterat

- [`ORKESTER-BACKLOG-PLANS.md`](./ORKESTER-BACKLOG-PLANS.md) — Fas A–D ordlista
- [`ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md) — terminal + specialister
- [`docs/cursor-automations/prefill-nattpass-orkester.json`](./cursor-automations/prefill-nattpass-orkester.json)
