# FAS24 Sprint Autorun

**Aktiv fas:** 24 · **Gate:** `npm run smoke:predeploy` → `/yolo-vakt` GO → Pontus OK

## Sprint 24.1 — Styrningssync (P0) ✅

- [x] `.cursorrules` → Fas 24
- [x] `fas-masterplan-guard.mdc` Fas 23/24
- [x] `agent-gap-scout` + 11 agenter registrerade
- [x] Metadata-fix ("Alltid aktiv" borttagen — smoke:mdc kräver 1 alwaysApply)
- [x] `2026-06-25-app-plan-syntes.md` skapad
- [x] `npm run cursor:pipeline:pack:copilot` PASS
- [x] `npm run smoke:mdc` PASS
- [x] `npm run smoke:prompts` PASS

## Sprint 24.2 — Arkiv-städ (P1) ✅

- [x] Arkivera orphan frontend → `docs/archive/2026-06-26/`
- [x] Radera `main.tsx.bak`
- [x] Backend kommentars-fix (`kampsparRag.ts`)
- [x] `npm run smoke:predeploy` PASS (2026-06-26)

## Sprint 24.3 — Design P2 (P1) ✅

- [x] hex→tokens: `DagbokReflektionDelegate` (`text-bg`)
- [x] Figma Phase 0: `get_variable_defs` — tokens matchar kod
- [x] `docs/design/figma-fas24-foundations.md` (Phase 1–2 spec)
- [x] `npm run smoke:design-modules` PASS

## Sprint 24.4 — Zon-färdig (nästa)

Max **1 zon aktiv** per våg — kör när Pontus säger "gör det":

1. Valv — `specialist-valv-builder`
2. Hjärtat — `specialist-hjartat-inkast-builder`
3. Vardagen — `specialist-vardagen-builder`
4. Familjen — `specialist-familjen-hamn-builder`

## YOLO audit

Se [`docs/evaluations/2026-06-26-yolo-audit.md`](evaluations/2026-06-26-yolo-audit.md) — **GO** efter smoke:predeploy.

## Slutgate (före prod deploy)

```bash
npm run smoke:super-yolo
```

Deploy endast med Pontus OK.

**Notering:** `smoke:super-yolo` kräver `.env` + seed-användare för live e2e. Static gate (`smoke:predeploy`) PASS 2026-06-28.
