# SMOKE_RESULTS — manuella USER-tester

Uppdaterad: 2026-07-13 (YOLO v6 P20)

## G17 Zero Footprint blur (manuell)

| # | Steg | Förväntat | OK? |
|---|------|-----------|-----|
| 1 | Öppna app, logga in | Normal vy | |
| 2 | Byt till annan app (bakgrund) | Innehåll blurras / döljs | |
| 3 | Återvänd till Livskompassen | Innehåll återställs efter auth | |
| 4 | Byt flik i webbläsare (desktop) | Blur vid tab-byte | |
| 5 | Logga ut | Session rensad (Zero Footprint) | |

Agent: `npm run smoke:widgets` PASS 2026-07-13.
