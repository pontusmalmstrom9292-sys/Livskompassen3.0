# YOLO v7 — P27 Feljakt drift & regression

**Datum:** 2026-07-13  
**Agent:** specialist-verifier

## Zon-smokes

| Smoke | Resultat | Notering |
|-------|----------|----------|
| `smoke:mabra` | **PASS** | Live backend WORM + coach |
| `smoke:valv` | **PASS** | reality_vault seed + WebAuthn-gate |
| `smoke:journal-2d` | **FAIL** | `PERMISSION_DENIED` vid journal write (anonym auth) |
| `smoke:widgets` | **PASS** | WH1/WH2 + Fyren silo-labels |

## journal-2d (J2D-LIVE)

- **Rotorsak:** Live Firestore rules tillåter inte anonym journal-write i smoke-flödet
- **PMIR:** Ja — kräver `firestore.rules` + ev. `storage.rules`
- **Åtgärd v7:** Ingen rules-fix (mandat). Dokumenterad info-GAP.

## Minimal fix (smoke drift)

| Fil | Ändring | Varför |
|-----|---------|--------|
| `scripts/smoke_projekt_regler.mjs` | Acceptera `ProtectedModule` utöver `AuthGate` | AppRoutes migrerat auth-mönster; MOD-CORE-NAV orörd |

`integration:preflight` PASS efter smoke-fix (var FAIL på projekt-regler).

## Slutsats

**P27 PASS med info-GAP** — journal-2d kvarstår (PMIR). Övriga zoner gröna.
