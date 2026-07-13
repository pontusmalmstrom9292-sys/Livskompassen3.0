# Natt-CI — `@cursor/sdk`

**Datum:** 2026-07-13  
**Status:** **AKTIV** — deterministiska faser A–C + valfri SDK-agent.

---

## Syfte

Automatiserad nattpass-loop via [`@cursor/sdk`](https://www.npmjs.com/package/@cursor/sdk) och deterministiska npm-skript:

| Fas | Innehåll | Kommando |
|-----|----------|----------|
| **A** | Terminal — `orkester:night` + valv/kunskap/dossier smoke | `npm run natt-ci:fas-a` |
| **B** | Ikoner — `smoke:locked-icons`; v4-batch endast vid generator-ändring | `npm run natt-ci:fas-b` |
| **C** | Git/arbetsyta — varnar för secrets i diff | `npm run natt-ci:fas-c` |
| **D** | Rapport — `docs/evaluations/YYYY-MM-DD-orkester-natt.md` | ingår i `npm run natt-ci` |

Ersätter manuella overnight-sessioner (historik: [`docs/archive/OVERNIGHT_REPORT.md`](archive/OVERNIGHT_REPORT.md)).

---

## Setup (engång)

```bash
npm install          # @cursor/sdk i devDependencies
export CURSOR_API_KEY="cursor_..."   # valfritt för --agent
npm run natt-ci:setup
```

State: `.orkester/natt-ci-state.json`  
Körlogg: `.orkester/natt-ci-runs/<timestamp>.json`

---

## Körning

```bash
# Hela passet (A+B+C+D)
npm run natt-ci

# En fas
npm run natt-ci:fas-a
npm run natt-ci:fas-b
npm run natt-ci:fas-c

# + readonly SDK-sammanfattning (kräver CURSOR_API_KEY)
npm run natt-ci -- --agent
```

**GitHub Actions:** `.github/workflows/natt-ci.yml` — manuell `workflow_dispatch` (fas + valfri agent).

---

## Blockerare (historik)

| Krav | Status |
|------|--------|
| G6 Drive E2E → `kb_docs` | **done** |
| `@cursor/sdk` i repo | **installerad** (`devDependencies`) |

---

## MUST NOT

- Auto-deploy eller merge till `main` i nattpasset
- Committa `.env`, service account `*.json`, eller `google-services.json`
- Ändra `firestore.rules` / `sharedRules.ts` utan PMIR

---

## Relaterat

- [`ORKESTER-BACKLOG-PLANS.md`](./ORKESTER-BACKLOG-PLANS.md) — Fas A–D ordlista
- [`ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md) — terminal + specialister
- [`docs/cursor-automations/prefill-nattpass-orkester.json`](./cursor-automations/prefill-nattpass-orkester.json) — veckovis readonly automation
