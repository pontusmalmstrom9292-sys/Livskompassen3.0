# Barnhub Fas B — complete

**Datum:** 2026-07-20  
**Status:** BYGGD (lokal) — ej deploy  
**Modul:** MOD-FAM-INCIDENT + MOD-FAM-HUB

## Leverans

1. **Kortrotation** (`incidentCardRotation.ts`) — localStorage: öppnad / hoppad; påverkar `pickIncidentCard`.
2. **7-dagars tematik** (`incidentThemeFromLogs.ts`) — läser `[incident_meta] tags=` från `children_logs`.
3. **Bank** — fler R4-kort (sig/pappa/reg/hopp); `pickIncidentCard` med soft preferred + rotation.
4. **UI** — `ChildIncidentPulse` på Reflektion; «Hoppa över kortet» i incident-delegate.
5. **Analys** — `analyzeChildIncidentLocal` tar `themePatternIds`.

## Smoke

- `smoke:child-incident` PASS
- `smoke:locked-ux` PASS

## Utanför scope (Fas C / senare)

- Deploy functions/hosting
- Barnen-vektor, `/barnhub`-route, cloud spaced repetition
