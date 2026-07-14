# YOLO v22 — MASTER sekventiell P173→P182

Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md

Kör ALLA uppgifter sekventiellt. Efter varje uppgift: kör task-smoke, logga PASS/FAIL.

## Uppgifter

- **p173-deploy** (yolo-vakt): P173 — (Valfritt) hosting deploy — SKIP om ej Pontus OK deploy.
- **p174-baseline** (yolo-vakt): P174 — Read-only baseline — smoke:predeploy:build. Eval baseline v22.
- **p175-auto-lock-hygiene** (specialist-verifier): P175 — Auto-lock hygiene — entryFiles + LOCK-MANIFEST.
- **p176-security** (specialist-security-auditor): P176 — Security read-only — WORM, silos. Eval security-v22.md.
- **p177-ux-guardian** (specialist-ux-guardian): P177 — Locked UX re-snapshot — locked-ux smokes.
- **p178-drift** (specialist-verifier): P178 — Drift & smoke — journal-2d, mabra, valv, widgets. Eval drift-v22.md.
- **p179-design-debt** (specialist-ux-guardian): P179 — Design-debt guard — dsBtn 0, btnPill 0, adHocDialog 0.
- **p180-fortification** (yolo-vakt): P180 — Agent-fortifikation v22 — cursor:yolo:v22 + queue/state.
- **p181-integration** (livskompassen-arkiv-master): P181 — Integration dry-run — preflight + seed --dry-run. Aldrig --apply.
- **p182-yolo-vakt** (yolo-vakt): P182 — yolo-vakt slutgate — GO/NO-GO + handoff v23

## Exit

Alla icke-SKIP tasks PASS → `npm run smoke:predeploy:build` → leveransrapport i docs/evaluations/
