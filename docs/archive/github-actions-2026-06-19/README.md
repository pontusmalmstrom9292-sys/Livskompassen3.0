# GitHub Actions — arkiverad 2026-06-19

**Orsak:** Konto-billing blockerade Actions (*payments failed / spending limit*). Solo-trunk kör **manuell YOLO-gate** lokalt istället.

**Kanon:** [`docs/CI-HOSTING.md`](../../CI-HOSTING.md) · [`docs/YOLO-VAKT-GATE.md`](../../YOLO-VAKT-GATE.md)

## Arkiverade workflows

| Fil | Tidigare syfte |
|-----|----------------|
| `workflows/firebase-hosting-main.yml` | Deploy vid push till `main` |
| `workflows/firebase-hosting-pr.yml` | PR quality gate (våg 3) |
| `workflows/android-app-distribution.yml` | APK → App Distribution |
| `workflows/sacred-backup.yml` | Sacred backup vid PR |

## Återaktivera (valfritt)

1. Fixa billing: GitHub → Settings → Billing
2. Flytta tillbaka YAML till `.github/workflows/`
3. Repo → Settings → Actions → Enable

## Ersättning (nu)

```bash
cd ~/StudioProjects/Livskompassen3.0
npm run smoke:predeploy:build
firebase deploy --only hosting   # vid behov
```

Se [`docs/DEPLOY.md`](../../DEPLOY.md) för functions/rules.
