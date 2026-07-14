# Unlock — MOD-WIDGET Standalone v1 (5 vågor)

**Datum:** 2026-07-14  
**Modul:** MOD-WIDGET — fristående widgets (web skin + Android WH7 + auth bypass)  
**Status:** unlocked  
approved: yes  
**Godkänd av:** Pontus (via plan «Fristående Widgets — 5 vågor»)

---

## Scope (tillåtet)

- Design Freeport `WidgetStandaloneLab` + `STANDALONE-WIDGET-SKIN.md`
- Prod-primitiver: `widget-tokens.css`, `WidgetButton`, `WidgetActionTile`, `WidgetShell v2`
- Polish: Record, Note, ActionDashboard + övriga widget-sidor (skin only)
- Android WH1–WH7 native premium refresh + `ActionDashboardWidgetProvider`
- `AppUnlockGate` bypass på `/widget/*` (Firebase-session kvar)
- Enhetlig `AuthGate variant="widget"` på alla widget-sidor
- Smoke-uppdateringar; governance docs

## Utanför scope

- `functions/` · `firestore.rules`
- iOS WidgetKit
- Locked UX §5 Fyren expand-logik · §13 ActionDashboard funktion
- `HomeWidgetRenderer` wiring

## DoD

- [ ] Freeport + prod skin extraherad
- [ ] Capture-widgets utan onödig app-nav
- [ ] WH7 `/widget/aktioner`
- [ ] `smoke:widgets`, `smoke:widget-ingest`, `smoke:locked-ux`, `smoke:predeploy:build` PASS

## Re-lock

Efter våg 5: `node scripts/lock_module.mjs MOD-WIDGET --smoke smoke:widgets`
