# Cursor YOLO v13 — MASTER sekventiell (P84→P93)

**Version:** 13 · **Handoff från:** v12 (2026-07-13)

## Kommandon

```bash
npm run cursor:yolo:v13 -- status
npm run cursor:yolo:v13 -- master
npm run cursor:yolo:v13 -- handoff   # efter P93 — skriver prompt för v14
```

## Faser

| ID | Fas | Agent |
|----|-----|-------|
| p84-deploy | (Valfritt) hosting | yolo-vakt — PMIR |
| p85-baseline | Baseline | yolo-vakt |
| p86-auto-lock-hygiene | Auto-lock | specialist-verifier |
| p87-security | Security | specialist-security-auditor |
| p88-ux-guardian | Locked UX | specialist-ux-guardian |
| p89-drift | Drift | specialist-verifier |
| p90-design-debt | Design-debt | specialist-ux-guardian |
| p91-fortification | v13 orchestrering | yolo-vakt |
| p92-integration | Dry-run | livskompassen-arkiv-master |
| p93-yolo-vakt | Slutgate + handoff | yolo-vakt |

Efter P93: `npm run cursor:yolo:v13 -- handoff` → ny chatt v14.
