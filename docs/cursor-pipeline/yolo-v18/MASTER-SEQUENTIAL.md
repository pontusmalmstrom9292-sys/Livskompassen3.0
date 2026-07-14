# YOLO v18 — MASTER sekventiell P133→P142

Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md

Kör ALLA uppgifter sekventiellt. Efter varje uppgift: kör task-smoke, logga PASS/FAIL.

## Uppgifter

- **p133-deploy** (yolo-vakt): P133 — (Valfritt) hosting deploy — SKIP om ej Pontus OK deploy.
- **p134-baseline** (yolo-vakt): P134 — Read-only baseline — smoke:predeploy:build. Eval baseline v18.
- **p135-auto-lock-hygiene** (specialist-verifier): P135 — Auto-lock hygiene — entryFiles + LOCK-MANIFEST.
- **p136-security** (specialist-security-auditor): P136 — Security read-only — WORM, silos. Eval security-v18.md.
- **p137-ux-guardian** (specialist-ux-guardian): P137 — Locked UX re-snapshot — locked-ux smokes.
- **p138-drift** (specialist-verifier): P138 — Drift & smoke — journal-2d, mabra, valv, widgets. Eval drift-v18.md.
- **p139-design-debt** (specialist-ux-guardian): P139 — Design-debt guard — dsBtn 0, btnPill 0, adHocDialog 0.
- **p140-fortification** (yolo-vakt): P140 — Agent-fortifikation v18 — cursor:yolo:v18 + queue/state.
- **p141-integration** (livskompassen-arkiv-master): P141 — Integration dry-run — preflight + seed --dry-run. Aldrig --apply.
- **p142-yolo-vakt** (yolo-vakt): P142 — yolo-vakt slutgate — GO/NO-GO + handoff v19

## Exit

Alla icke-SKIP tasks PASS → `npm run smoke:predeploy:build` → leveransrapport i docs/evaluations/
