# YOLO v16 — MASTER sekventiell P113→P122

Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md

Kör ALLA uppgifter sekventiellt. Efter varje uppgift: kör task-smoke, logga PASS/FAIL.

## Uppgifter

- **p113-deploy** (yolo-vakt): P113 — (Valfritt) hosting deploy — SKIP om ej Pontus OK deploy. firebase hosting only.
- **p114-baseline** (yolo-vakt): P114 — Read-only baseline — smoke:predeploy:build. Eval baseline v16.
- **p115-auto-lock-hygiene** (specialist-verifier): P115 — Auto-lock hygiene — entryFiles + LOCK-MANIFEST.
- **p116-security** (specialist-security-auditor): P116 — Security read-only — WORM, silos, Zero Footprint. Eval security-v16.md.
- **p117-ux-guardian** (specialist-ux-guardian): P117 — Locked UX re-snapshot — locked-ux smokes.
- **p118-drift** (specialist-verifier): P118 — Drift & smoke — journal-2d, mabra, valv, widgets. Eval drift-v16.md.
- **p119-design-debt** (specialist-ux-guardian): P119 — Design-debt guard — dsBtn 0, btnPill 0, adHocDialog 0.
- **p120-fortification** (yolo-vakt): P120 — Agent-fortifikation v16 — cursor:yolo:v16 + queue/state.
- **p121-integration** (livskompassen-arkiv-master): P121 — Integration dry-run — preflight + seed --dry-run. Aldrig --apply.
- **p122-yolo-vakt** (yolo-vakt): P122 — yolo-vakt slutgate + handoff — GO/NO-GO + handoff v17

## Exit

Alla icke-SKIP tasks PASS → `npm run smoke:predeploy:build` → leveransrapport i docs/evaluations/
