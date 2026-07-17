# YOLO v48 — starta här

**Wave:** G85-LIVE-VERIFY (post-main-sync)  
**Varför:** v47 deploy SKIP + App Check/Valv-fixar just mergade till `main` — behöver grön verify-gate.

## Kör (ett kommando)

```bash
npm run sdk:yolo:v48
```

## Prompt för Cursor

```
Kör YOLO v48 G85-LIVE-VERIFY på main.
Läs .orkester/cursor-yolo-queue-v48.json och docs/cursor-pipeline/yolo-v48/MASTER-SEQUENTIAL.md.
Ordning: b48-deploy SKIP (ingen OK deploy) → b48-build → b48-gate → b48-vakt.
Smoke: android-platform, valv-security, predeploy:build.
Minimal fix vid FAIL. Ingen App Check Enforce. Ingen hosting utan Pontus OK.
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
Uppdatera state + skriv kort eval under docs/evaluations/.
```
