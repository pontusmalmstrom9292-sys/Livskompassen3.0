# Cursor YOLO v11 — MASTER sekventiell (P64→P73)

**Version:** 11 · **Start:** 2026-07-13 (post-v10)

## Kommandon

```bash
npm run cursor:yolo:v11 -- status
npm run cursor:yolo:v11 -- next
npm run cursor:yolo:v11 -- done
```

Kö: `.orkester/cursor-yolo-queue-v11.json` · State: `.orkester/cursor-yolo-state-v11.json`

## Faser

| ID | Fas | Agent | Exit |
|----|-----|-------|------|
| p64-baseline | Baseline read-only | yolo-vakt | smoke:predeploy:build PASS |
| p65-auto-lock-hygiene | Auto-lock hygiene | specialist-verifier | smoke:module-lock PASS |
| p66-security | Security read-only | specialist-security-auditor | eval security-v11.md |
| p67-ux-guardian | Locked UX re-snapshot | specialist-ux-guardian | locked-ux PASS |
| p68-drift | Drift smokes | specialist-verifier | journal/mabra/valv/widgets PASS |
| p69-design-debt | Design-debt guard | specialist-ux-guardian | dsBtn 0, btnPill 0 |
| p70-fortification | v11 orchestrering | yolo-vakt | smoke:governance PASS |
| p71-integration | Dry-run only | livskompassen-arkiv-master | seed --dry-run, aldrig --apply |
| p72-yolo-vakt | Slutgate | yolo-vakt | smoke:predeploy:build PASS |
| p73-deploy | SKIP | — | Väntar Pontus "OK deploy" |

## Trippel-gate (efter kod i locked zon)

```bash
npm run smoke:locked-ux && npm run smoke:design-modules && npm run smoke:governance
```

## PMIR-STOPP

Se `docs/governance/LOCK-MANIFEST.md` — inget deploy utan separat Pontus OK.
