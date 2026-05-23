# Natt-CI — `@cursor/sdk` (READY)

**Datum:** 2026-05-23  
**Status:** **READY** — paket i [`scripts/natt-ci/`](../scripts/natt-ci/). G6 + FAS4 **done**.

---

## Syfte

Automatiserad byggpass-kedja (ersätter manuella overnight-sessioner):

1. `cd functions && npm run build`
2. `npm run build` (frontend)
3. `npx eslint . --max-warnings 0`
4. `npm run smoke:valv` / `smoke:kunskap` / `smoke:dossier`

Historik: [`docs/archive/OVERNIGHT_REPORT.md`](archive/OVERNIGHT_REPORT.md).

---

## Kommandon

| Kommando | Kräver | Beskrivning |
|----------|--------|-------------|
| `npm run natt-ci` | ADC för smoke | Deterministisk kedja — [`run-byggpass.mjs`](../scripts/natt-ci/run-byggpass.mjs) |
| `npm run natt-ci:agent` | `CURSOR_API_KEY` + ADC | Byggpass + SDK `Agent.prompt` review |

**Första gång:** `cd scripts/natt-ci && npm install`

**API-nyckel:** Cursor dashboard → API keys → `export CURSOR_API_KEY=...` (aldrig i git).

---

## Blockerare (historik)

| Krav | Status |
|------|--------|
| G6 Drive E2E → `kb_docs` | **done** 2026-05-22 |
| GCP FAS4 steg 3–7 | **done** 2026-05-22 |
| `@cursor/sdk` i repo | **READY** — `scripts/natt-ci/package.json` |

---

## Trigger

```
kör Natt-CI
```

→ `npm run natt-ci` från repo-rot.

Valfri agent-review: `npm run natt-ci:agent`.

---

## Framtida utökning

- GitHub Action: build + eslint only (smoke kräver ADC — oftast lokalt)
- Schemalagd körning via Cursor Automations eller cron + `natt-ci`
