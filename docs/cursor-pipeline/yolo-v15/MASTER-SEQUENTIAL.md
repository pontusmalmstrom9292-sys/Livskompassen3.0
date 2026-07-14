# YOLO v15 — MASTER sekventiell P103→P112

Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md

Kör ALLA uppgifter sekventiellt. Efter varje uppgift: kör task-smoke, logga PASS/FAIL.

## Uppgifter

- **p103-deploy** (yolo-vakt): P103 — (Valfritt) hosting deploy — SKIP om ej Pontus OK deploy. firebase hosting only.
- **p104-baseline** (yolo-vakt): P104 — Read-only baseline — smoke:predeploy:build. Eval baseline v15.
- **p105-auto-lock-hygiene** (specialist-verifier): P105 — Auto-lock hygiene — entryFiles + LOCK-MANIFEST.
- **p106-security** (specialist-security-auditor): P106 — Security read-only — WORM, silos, Zero Footprint. Eval security-v15.md.
- **p107-ux-guardian** (specialist-ux-guardian): P107 — Locked UX re-snapshot — locked-ux smokes.
- **p108-drift** (specialist-verifier): P108 — Drift & smoke — journal-2d, mabra, valv, widgets. Eval drift-v15.md.
- **p109-design-debt** (specialist-ux-guardian): P109 — Design-debt guard — dsBtn 0, btnPill 0, adHocDialog 0.
- **p110-fortification** (yolo-vakt): P110 — Agent-fortifikation v15 — cursor:yolo:v15 + queue/state.
- **p111-integration** (livskompassen-arkiv-master): P111 — Integration dry-run — preflight + seed --dry-run. Aldrig --apply.
- **p112-yolo-vakt** (yolo-vakt): P112 — yolo-vakt slutgate + handoff — GO/NO-GO + npm run cursor:yolo:v15 -- handoff

## Exit

Alla icke-SKIP tasks PASS → `npm run smoke:predeploy:build` → leveransrapport i docs/evaluations/
