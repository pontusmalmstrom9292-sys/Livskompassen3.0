# YOLO v23 — MASTER sekventiell P183→P192

Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md

Kör ALLA uppgifter sekventiellt. Efter varje uppgift: kör task-smoke, logga PASS/FAIL.

## Uppgifter

- **p183-deploy** (yolo-vakt): P183 — (Valfritt) hosting deploy — SKIP om ej Pontus OK deploy.
- **p184-baseline** (yolo-vakt): P184 — Read-only baseline — smoke:predeploy:build. Eval baseline v23..
- **p185-auto-lock-hygiene** (specialist-verifier): P185 — Auto-lock hygiene — entryFiles + LOCK-MANIFEST..
- **p186-security** (specialist-security-auditor): P186 — Security read-only — WORM, silos. Eval security-v23.md..
- **p187-ux-guardian** (specialist-ux-guardian): P187 — Locked UX re-snapshot — locked-ux smokes..
- **p188-drift** (specialist-verifier): P188 — Drift & smoke — journal-2d, mabra, valv, widgets. Eval drift-v23.md..
- **p189-design-debt** (specialist-ux-guardian): P189 — Design-debt guard — dsBtn 0, btnPill 0, adHocDialog 0..
- **p190-fortification** (yolo-vakt): P190 — Agent-fortifikation v23 — cursor:yolo:v23 + queue/state..
- **p191-integration** (livskompassen-arkiv-master): P191 — Integration dry-run — preflight + seed --dry-run. Aldrig --apply..
- **p192-yolo-vakt** (yolo-vakt): P192 — yolo-vakt slutgate — GO/NO-GO + handoff v24.

## Exit

Alla icke-SKIP tasks PASS → `npm run smoke:predeploy:build` → leveransrapport i docs/evaluations/
