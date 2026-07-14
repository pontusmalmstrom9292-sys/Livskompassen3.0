# YOLO v19 — MASTER sekventiell P143→P152

Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md

Kör ALLA uppgifter sekventiellt. Efter varje uppgift: kör task-smoke, logga PASS/FAIL.

## Uppgifter

- **p143-deploy** (yolo-vakt): P143 — (Valfritt) hosting deploy — SKIP om ej Pontus OK deploy.
- **p144-baseline** (yolo-vakt): P144 — Read-only baseline — smoke:predeploy:build. Eval baseline v19.
- **p145-auto-lock-hygiene** (specialist-verifier): P145 — Auto-lock hygiene — entryFiles + LOCK-MANIFEST.
- **p146-security** (specialist-security-auditor): P146 — Security read-only — WORM, silos. Eval security-v19.md.
- **p147-ux-guardian** (specialist-ux-guardian): P147 — Locked UX re-snapshot — locked-ux smokes.
- **p148-drift** (specialist-verifier): P148 — Drift & smoke — journal-2d, mabra, valv, widgets. Eval drift-v19.md.
- **p149-design-debt** (specialist-ux-guardian): P149 — Design-debt guard — dsBtn 0, btnPill 0, adHocDialog 0.
- **p150-fortification** (yolo-vakt): P150 — Agent-fortifikation v19 — cursor:yolo:v19 + queue/state.
- **p151-integration** (livskompassen-arkiv-master): P151 — Integration dry-run — preflight + seed --dry-run. Aldrig --apply.
- **p152-yolo-vakt** (yolo-vakt): P152 — yolo-vakt slutgate — GO/NO-GO + handoff v20

## Exit

Alla icke-SKIP tasks PASS → `npm run smoke:predeploy:build` → leveransrapport i docs/evaluations/
