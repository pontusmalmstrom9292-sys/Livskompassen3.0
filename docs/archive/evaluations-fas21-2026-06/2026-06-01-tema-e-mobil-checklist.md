# Tema E mobil — verifieringschecklista

**Datum:** 2026-06-01  
**Prod-tema:** `E-skymning-prod`  
**Dock:** `VITE_DOCK_MODE=classic` (default)

## Automatisk smoke (agent)

- [x] `npm run build` — PASS 2026-06-01
- [x] `npm run smoke:locked-ux` — PASS
- [x] `npm run smoke:locked-icons` — PASS
- [x] `npm run smoke:design-modules` — PASS

## Telefon / Android (du)

1. **Meny** — guld läsbart på scenic, swipe stänger, inget klick genom dock
2. **Hem** — kompass inte klippt av notch; safe-area under dock
3. **`/familj?tab=hamn`** — BIFF-flöde + tabbar
4. **Kompis** (`/kompis`) — kort och guld avatar
5. **Valv PIN** — rubriker med tillräcklig kontrast

## Efter godkännande

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run build
firebase deploy --only hosting
```

Android: `npm run build:web && npx cap sync android`
