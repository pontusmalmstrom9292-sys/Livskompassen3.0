# Unlock — UI polish vågor 2–6 (hel app)

Date: 2026-07-21
approved: yes
Pontus OK: Cursor-chatt «kör ui polish i hela appen noga i flera vågor» 2026-07-21

## Modules (unlock → developing per våg, re-lock efter smoke PASS)

| Våg | Moduler | Scope |
|-----|---------|--------|
| 1 | *(inga locked globs)* | Hem Layout A, HomeGreeting, HomeHeroKanon.css, exec-home-chrome, premium-polish — **FREE** |
| 2 | MOD-VARD-MABRA, MOD-VARD-PLAN, MOD-VARD-LAUNCH | Token/a11y/depth — ingen flödesändring |
| 3 | MOD-HJ-DAGBOK, MOD-HJ-INPUT, MOD-HJ-SPEGLAR | Samma |
| 4 | MOD-FAM-HUB, MOD-FAM-BARN, MOD-FAM-HAMN | Samma; Barnfokus kvar |
| 5 | MOD-VALV-HUB, MOD-VALV-INKAST | Samma; Mönster/Orkester orörda strukturellt |
| 6 | MOD-WIDGET, MOD-CORE-CHROME (endast polish CSS) | Widget shell tokens; dock/header **ingen** layout-flytt |

## MUST NOT

- Locked UX borttagning / omläggning (dock, kompass, header, Barnfokus, P3)
- WORM / firestore.rules / Sacred
- Nya routes eller modul-flytt
- Redesign — endast refine/elevate (premium-ui.mdc)

## Smoke per våg (minimum)

```bash
npm run build
npm run smoke:locked-ux
npm run smoke:design-modules
```

Extra: `smoke:widgets` (våg 6), `smoke:mabra` (våg 2), `smoke:basta-dock-lock` om CHROME rörs.
