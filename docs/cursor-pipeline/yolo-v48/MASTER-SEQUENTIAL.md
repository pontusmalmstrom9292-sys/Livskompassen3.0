# YOLO v48 — G85-LIVE-VERIFY

**Wave:** Post-main-sync — App Check + Valv kickout verify  
**Efter:** main-sync PR #226 · v47 MINNE-DEPLOY (deploy SKIP)  
**Fas:** 24 AKTIV

## Ordning

1. `b48-deploy` — SKIP utan Pontus OK (hosting)
2. `b48-build` — verifiera App Check live-harden + Valv bakgrundslås
3. `b48-gate` — wave-gate smokes
4. `b48-vakt` — GO/NO-GO + handoff

## MUST NOT

- App Check Enforce
- `--apply` på minne/arkiv
- Force-push / direkt push till protected `main` (PR-väg)
- Sacred / Locked UX-ombyggnad
