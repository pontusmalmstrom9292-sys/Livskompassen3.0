# YOLO v21 — MASTER sekventiell P163→P172

Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md

Kör ALLA uppgifter sekventiellt. Efter varje uppgift: kör task-smoke, logga PASS/FAIL.

## Uppgifter

- **p163-deploy** (yolo-vakt): P163 — (Valfritt) hosting deploy — SKIP om ej Pontus OK deploy.
- **p164-baseline** (yolo-vakt): P164 — Read-only baseline — smoke:predeploy:build. Eval baseline v21.
- **p165-auto-lock-hygiene** (specialist-verifier): P165 — Auto-lock hygiene — entryFiles + LOCK-MANIFEST.
- **p166-security** (specialist-security-auditor): P166 — Security read-only — WORM, silos. Eval security-v21.md.
- **p167-ux-guardian** (specialist-ux-guardian): P167 — Locked UX re-snapshot — locked-ux smokes.
- **p168-drift** (specialist-verifier): P168 — Drift & smoke — journal-2d, mabra, valv, widgets. Eval drift-v21.md.
- **p169-design-debt** (specialist-ux-guardian): P169 — Design-debt guard — dsBtn 0, btnPill 0, adHocDialog 0.
- **p170-fortification** (yolo-vakt): P170 — Agent-fortifikation v21 — cursor:yolo:v21 + queue/state.
- **p171-integration** (livskompassen-arkiv-master): P171 — Integration dry-run — preflight + seed --dry-run. Aldrig --apply.
- **p172-yolo-vakt** (yolo-vakt): P172 — yolo-vakt slutgate — GO/NO-GO + handoff v22

## Exit

Alla icke-SKIP tasks PASS → `npm run smoke:predeploy:build` → leveransrapport i docs/evaluations/
