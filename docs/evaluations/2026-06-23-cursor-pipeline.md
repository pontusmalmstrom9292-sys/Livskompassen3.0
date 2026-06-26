# Cursor Pipeline — 2026-06-23
**Kört:** 2026-06-23T09:58:40.578Z
**Git:** main @ 0cce2f790 (80 unstaged)
**Attempt:** 1 / 5
**Status:** FAIL
## Faser
| Fas | Status | ms |
|-----|--------|-----|
| Functions TypeScript build | PASS | 15004 |
| Frontend Vite build | FAIL | 14341 |
| MDC rules smoke | PASS | 277 |
| Pre-deploy smoke gate | FAIL | 102353 |
| YOLO static (locked UX + orkester + synapse) | PASS | 50865 |
| npm run smoke:predeploy | FAIL | 1967 |
## Risker
- Dirty tree: 80 filer
- 3 fas(er) FAIL — se fix-brief
## Förbättringsförslag
- Fixa: **Frontend Vite build**
## Agent-jobb
- Master prompt: `.cursor/pipeline/MASTER-PROMPT.md`
- State: `.cursor/pipeline/state.json`
---
<!-- template -->
# Rapportmall — Cursor Pipeline

Denna sektion fylls i automatiskt av `scripts/cursor_pipeline/orchestrator.mjs`.

## Checklista efter PASS

- [ ] Hard refresh webb (Cmd+Shift+R) vid prod-deploy
- [ ] `npm run smoke:predeploy:live` om callables deployats
- [ ] PMIR vid diff i rules / Sacred / Locked UX

## Nästa våg (vid PASS)

1. Kör MASTER-PROMPT med fokus på öppna GAP i `docs/specs/modules/Arkiv-GAP-REGISTER.md`
2. Valfritt: `npm run smoke:super-yolo` före deploy

## Vid FAIL

1. Läs `.cursor/pipeline/fix-brief.md`
2. Sätt `export CURSOR_PIPELINE_AUTORUN=1` för stop-hook-loop
3. Max 5 försök — därefter manuell PMIR
