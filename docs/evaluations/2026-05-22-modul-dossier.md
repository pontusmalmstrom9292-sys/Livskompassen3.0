# Modul — dossier

**Route:** `/dossier` | **Collection:** `dossier_snapshots` | **Callable:** `generateDossier`

## PASS

- Wizard UI + `generateDossier` backend
- WORM snapshots — client create:false L115–118
- smoke:dossier PASS 2026-05-22
- Länk från Barnen export

## GAP

- U2.5 HITL för känsliga exports — **open** (security.md)
- PDF pipeline — verifiera prod efter deploy

## Sacred / säkerhet

Dossier-Generator **PASS**. Läser WORM, skriver immutable snapshot server-side.

## Rekommenderat

`npm run smoke:dossier`.
