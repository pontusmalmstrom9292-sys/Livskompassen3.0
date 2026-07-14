# YOLO v17 — MASTER sekventiell P123→P132

Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md

Kör ALLA uppgifter sekventiellt. Efter varje uppgift: kör task-smoke, logga PASS/FAIL.

## Uppgifter

- **p123-deploy** (yolo-vakt): P123 — (Valfritt) hosting deploy — SKIP om ej Pontus OK deploy.
- **p124-baseline** (yolo-vakt): P124 — Read-only baseline — smoke:predeploy:build. Eval baseline v17.
- **p125-auto-lock-hygiene** (specialist-verifier): P125 — Auto-lock hygiene — entryFiles + LOCK-MANIFEST.
- **p126-security** (specialist-security-auditor): P126 — Security read-only — WORM, silos. Eval security-v17.md.
- **p127-ux-guardian** (specialist-ux-guardian): P127 — Locked UX re-snapshot — locked-ux smokes.
- **p128-drift** (specialist-verifier): P128 — Drift & smoke — journal-2d, mabra, valv, widgets. Eval drift-v17.md.
- **p129-design-debt** (specialist-ux-guardian): P129 — Design-debt guard — dsBtn 0, btnPill 0, adHocDialog 0.
- **p130-fortification** (yolo-vakt): P130 — Agent-fortifikation v17 — cursor:yolo:v17 + queue/state.
- **p131-integration** (livskompassen-arkiv-master): P131 — Integration dry-run — preflight + seed --dry-run. Aldrig --apply.
- **p132-yolo-vakt** (yolo-vakt): P132 — yolo-vakt slutgate — GO/NO-GO + handoff v18

## Exit

Alla icke-SKIP tasks PASS → `npm run smoke:predeploy:build` → leveransrapport i docs/evaluations/
