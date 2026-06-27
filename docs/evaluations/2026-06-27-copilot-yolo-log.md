# Copilot YOLO log — 2026-06-27

**Git:** docs/governance-branch-protection-guide @ f40a4e3ed
**Kanon:** .github/copilot-instructions.md · AGENTS.md · .cursor/index.mdc

| Tid | Task | Status | Smoke | Notering |
|-----|------|--------|-------|----------|
| 21:33:31 | w2-backend-audit | PASS | ok | Våg 2 — read-only backend audit (WORM, silos, DCAP) |
| 21:34:43 | executive-home-motion | PASS | ok | Städa executive home-motion + build-gate grönt |
| 21:37:42 | lifeos-kopplingar-c | PASS | ok | Life OS kopplingar Fas C (kod) |
| 21:40:33 | projekt-p1-widget | PASS | ok | Projekt P1 widget-polish |
| 21:41:28 | ingest-vag1-deploy-prep | smoke FAIL | fail | kör yolo igen eller yolo skip |
| 21:42:16 | ingest-vag1-deploy-prep | smoke FAIL | fail | kör yolo igen eller yolo skip |
| 21:42:24 | ingest-vag1-deploy-prep | smoke FAIL | fail | kör yolo igen eller yolo skip |
| 21:42:49 | ingest-vag1-deploy-prep | smoke FAIL | fail | kör yolo igen eller yolo skip |
| 23:48:08 | ingest-vag1-deploy-prep | PASS | ok | Verifierat: submitInkastLite + notifyNewFile kod klar. Smoke PASS (`functions build`, `smoke:inkast-fas2`, `smoke:innehall`, `smoke:predeploy`). Deploy-instruktion: vänta Pontus OK, kör sedan `firebase deploy --only functions:submitInkastLite,functions:notifyNewFile` och därefter `npm run smoke:kunskap` manuellt. |
| 23:50:04 | ingest-vag1-deploy-prep | BLOCKED | fail | Pontus OK mottagen och deploy körd men stoppad av GCP: `secretmanager.googleapis.com` 403 (billing ej aktiverad för projekt `gen-lang-client-0481875058`). `npm run smoke:kunskap` efteråt gav `FAIL — internal`. |
| 23:06:49 | modul-smoke-fix-loop | preflight FAIL | fail | orkester:night |
