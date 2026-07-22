# Cursor Pipeline — 2026-06-19
**Kört:** 2026-06-19T13:27:58.269Z
**Git:** main @ b70098ad6 (23 unstaged)
**Attempt:** 1 / 5
**Status:** PASS
## Faser
| Fas | Status | ms |
|-----|--------|-----|
| Functions TypeScript build | PASS | 10050 |
| Frontend Vite build | PASS | 31325 |
| npm run smoke:predeploy | PASS | 77108 |
## Risker
- Dirty tree: 23 filer
## Förbättringsförslag
- Kör manuell smoke enligt docs/SMOKE_CHECKLIST.md vid prod-deploy.
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
