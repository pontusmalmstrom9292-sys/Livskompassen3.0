# MASTER — Cursor YOLO v5 sekventiell (P4 → P13)

**En chatt, YOLO på.** Kör faserna i ordning. Gå INTE vidare förrän varje fas smoke PASS.

```
CURSOR YOLO v5 — MASTER SEKVENTIELL (P4→P13)

Du kör Livskompassen safe YOLO v5. P1–P3 audits är klara. Kör ENDAST följande faser i ordning — en i taget, smoke PASS mellan varje.

=== GLOBAL MUST ===
- WORM · tre silos · Locked UX intakt · Zero Footprint
- PMIR-stopp: firestore.rules, storage.rules, NavigationDrawer, Barnporten kanon-UI, mass-radering
- Rör INTE AppRoutes.tsx (MOD-CORE-NAV låst)
- Små commits: cursor-yolo-v5: <fas> — <kort varför>
- Uppdatera docs/PROGRESS.md efter varje fas

=== FAS P4 — Calm-card polish ===
1. npm run smoke:calm-card-audit
2. Fixa findings en i taget (DS tokens, design-calm.mdc)
3. Smoke: calm-card-audit + design-modules + locked-ux
→ Logga PASS i docs/evaluations/2026-07-13-cursor-yolo-v5-log.md

=== FAS P5 — Ad-hoc dialoger → DS Modal ===
Sandbox först: W1ProjektNyPickerPreview, FreeportResurserOverlay. ResurserOverlay endast om locked-ux PASS.
Smoke: design-modules + locked-ux + orkester

=== FAS P6 — A11y Vardagen ===
Scope: src/modules/features/dailyLife/**
aria-label, focus-visible, reduced-motion, 44px touch
Smoke: design-modules + locked-ux + mabra

=== FAS P7 — Copy audit ===
npm run smoke:copy-audit — fixa alla FAIL till src/modules/core/copy/
Smoke: copy-audit + locked-ux

=== FAS P8 — A11y Hjärtat ===
Scope: lifeJournal/** (ej Valv PIN)
Smoke: design-modules + locked-ux + journal-2d

=== FAS P9 — Bundle perf ===
Dynamic import i superhub delegates — INTE AppRoutes
Smoke: build + locked-ux

=== FAS P10 — Android G85 ===
build:web → cap:sync:prod → smoke:android-platform → smoke:android-prod-sync
Logga docs/evaluations/2026-07-13-g85-sync.md

=== FAS P11 — G17 Zero Footprint blur ===
Blur vid tab-byte. smoke:locked-ux + smoke:widgets. Notera USER smoke för Pontus.

=== FAS P12 — Kunskap v8 dry-run ===
Dry-run only. smoke:innehall. Ingen live ingest.

=== FAS P13 — Hosting deploy (sist) ===
/yolo-vakt GO → smoke:predeploy:build PASS → fråga Pontus OK → firebase deploy --only hosting
Logga docs/evaluations/2026-07-13-yolo-deploy-hosting.md

Vid FAIL: fixa och kör om samma fas. Vid PMIR: STOPP + ett fixsteg.
Vid ALLA faser PASS: sammanfatta i docs/evaluations/2026-07-13-cursor-yolo-v5-leverans.md

Jämför mot hela projektets kontext. Arbeta autonomt och sluta inte förrän P4–P13 PASS eller tydlig blocker.
```
