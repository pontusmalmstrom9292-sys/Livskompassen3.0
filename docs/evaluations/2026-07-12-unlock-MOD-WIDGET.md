# Unlock — MOD-WIDGET (WH1/WH2 Executive Midnight polish)

**Datum:** 2026-07-12  
**Modul:** MOD-WIDGET — Fyren + widget-routes + Android hemskärms-widgets  
**Status:** unlocked  
approved: yes  
**Godkänd av:** Pontus  

---

## Scope (tillåtet)

- Native Android WH1/WH2: layout, ikon, strings (diskret WH1, unik WH2, Inkast-copy)
- In-app `WidgetShell` polish: glass, guld, 44px touch, panik «Dölj nu», reduced-motion
- WH1 web: behåll diskret titel, etik-gate, ingen REC på hemskärm
- WH2 web: behåll default silo Inkast
- Smoke-uppdateringar för discreet-layout wiring
- `npm run build:web && npx cap sync android`

## Utanför scope (kräver ny PMIR)

- `firestore.rules` / `storage.rules` / WORM-pipeline
- Ersätta låsta WH1/WH2 TS/SVG-glyph (`FyrenShortcutMicIcon`, `FyrenShortcutNoteIcon`)
- W1 v2 kompakt strip (native provider) — separat våg
- Locked UX (Fyren bar routes, Barnporten)

## DoD

- [x] WH1 hemskärm: «Anteckningar», discreet layout, ingen REC-indikator
- [x] WH2 hemskärm: unik ikon + «Snabbanteckning», subtitle «En rad → Inkast»
- [ ] Device smoke G85: tap → route → spara → panik dölj (Våg 2, Pontus)
- [x] `smoke:widgets`, `smoke:widget-ingest`, `smoke:locked-icons`, `smoke:design-modules`, `smoke:locked-ux` PASS

## Re-lock

Efter smoke PASS: `node scripts/lock_module.mjs MOD-WIDGET --smoke smoke:widgets smoke:widget-ingest`


## Våg 1 leverans (2026-07-14)

- W1EdgeQuickDock (Executive höger kant) → Röst / Snabbanteckning / Valv
- `widget_bg_premium_panel.xml` på native WH1/WH2
- MOD-WIDGET re-locked efter smoke PASS
