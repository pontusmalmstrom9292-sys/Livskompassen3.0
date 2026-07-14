# YOLO v24 — MASTER sekventiell P193→P202

Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md

Kör ALLA uppgifter sekventiellt. Efter varje uppgift: kör task-smoke, logga PASS/FAIL.

## Uppgifter

- **p193-deploy** (yolo-vakt): P193 — (Valfritt) hosting deploy — SKIP om ej Pontus OK deploy.
- **p194-baseline** (yolo-vakt): P194 — Read-only baseline — smoke:predeploy:build. Eval baseline v24..
- **p195-auto-lock-hygiene** (specialist-verifier): P195 — Auto-lock hygiene — entryFiles + LOCK-MANIFEST..
- **p196-security** (specialist-security-auditor): P196 — Security read-only — WORM, silos. Eval security-v24.md..
- **p197-ux-guardian** (specialist-ux-guardian): P197 — Locked UX re-snapshot — locked-ux smokes..
- **p198-drift** (specialist-verifier): P198 — Drift & smoke — journal-2d, mabra, valv, widgets. Eval drift-v24.md..
- **p199-design-debt** (specialist-ux-guardian): P199 — Design-debt guard — dsBtn 0, btnPill 0, adHocDialog 0..
- **p200-fortification** (yolo-vakt): P200 — Agent-fortifikation v24 — cursor:yolo:v24 + queue/state..
- **p201-integration** (livskompassen-arkiv-master): P201 — Integration dry-run — preflight + seed --dry-run. Aldrig --apply..
- **p202-yolo-vakt** (yolo-vakt): P202 — yolo-vakt slutgate — GO/NO-GO + handoff v25.

## Exit

Alla icke-SKIP tasks PASS → `npm run smoke:predeploy:build` → leveransrapport i docs/evaluations/
