# Cursor YOLO v12 — MASTER sekventiell (P74→P83)

**Version:** 12 · **Handoff från:** v11 (2026-07-13)

## Kommandon

```bash
npm run cursor:yolo:v12 -- status
npm run cursor:yolo:v12 -- master
npm run cursor:yolo:v12 -- handoff   # efter P83 — skriver prompt för v13
```

## Faser

| ID | Fas | Agent |
|----|-----|-------|
| p74-deploy | (Valfritt) hosting | yolo-vakt — PMIR |
| p75-baseline | Baseline | yolo-vakt |
| p76-auto-lock-hygiene | Auto-lock | specialist-verifier |
| p77-security | Security | specialist-security-auditor |
| p78-ux-guardian | Locked UX | specialist-ux-guardian |
| p79-drift | Drift | specialist-verifier |
| p80-design-debt | Design-debt | specialist-ux-guardian |
| p81-fortification | v12 orchestrering | yolo-vakt |
| p82-integration | Dry-run | livskompassen-arkiv-master |
| p83-yolo-vakt | Slutgate + handoff | yolo-vakt |

Efter P83: `npm run cursor:yolo:v12 -- handoff` → ny chatt v13.
