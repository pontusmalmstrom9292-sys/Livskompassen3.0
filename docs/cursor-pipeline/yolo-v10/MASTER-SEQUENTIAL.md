# Cursor YOLO v10 — MASTER sekventiell (P54→P63)

**Version:** 10 · **Start:** 2026-07-13 (post-deploy v9)

## Kommandon

```bash
npm run cursor:yolo:v10 -- status
```

## Faser

| ID | Fas | Agent |
|----|-----|-------|
| p54-baseline | Baseline post-deploy | yolo-vakt |
| p55-auto-lock-hygiene | Auto-lock hygiene | specialist-verifier |
| p56-security | Security audit | specialist-security-auditor |
| p57-ux-guardian | Locked UX | specialist-ux-guardian |
| p58-drift | Drift smokes | specialist-verifier |
| p59-design-debt | Design-debt | specialist-ux-guardian |
| p60-fortification | v10 orchestrering | yolo-vakt |
| p61-integration | Dry-run | livskompassen-arkiv-master |
| p62-yolo-vakt | Slutgate | yolo-vakt |
| p63-deploy | SKIP (deployad v9) | — |
