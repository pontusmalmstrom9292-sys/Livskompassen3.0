# Natt-CI (`scripts/natt-ci`)

Isolerat paket — påverkar inte Vite-appens `node_modules` i repo-rot.

## Första gång

```bash
cd scripts/natt-ci && npm install
```

## Kommandon (från repo-rot)

| Kommando | Syfte |
|----------|--------|
| `npm run natt-ci` | Byggpass-kedja (build + eslint + smoke subset) |
| `npm run natt-ci:agent` | Byggpass + valfri SDK-review (kräver `CURSOR_API_KEY`) |

## Miljö

| Variabel | Krävs för |
|----------|-----------|
| `CURSOR_API_KEY` | Endast `natt-ci:agent` |
| ADC (`gcloud auth application-default login`) | Smoke-steg i byggpass |

Committa **aldrig** API-nycklar.

## Källa

[`docs/NATT-CI.md`](../../docs/NATT-CI.md)
