# Unlock MOD-VARD-PLAN — Android Inkorg-flik

**Datum:** 2026-07-12  
approved: yes  
**Scope:** Minimal bugfix — touch-säker TabBar, GoraHubTabBar query-rensning, Sheet pointer backdrop.

## Motivering

Inkorg-fliken på `/planering` reagerar inte på Android WebView (Motorola G85). Rotorsak: touch/scroll-konflikt + konkurrerande query-params.

## Tillåtna filer

- `src/modules/core/ui/TabBar.tsx`
- `src/modules/core/navigation/GoraHubTabBar.tsx`
- `src/design-system/components/Sheet.tsx`
- `scripts/smoke_planering_gora_e.mjs`

## MUST NOT

- Ändra P3 Kanban, locked UX, dock/header
- Firestore/rules/deploy

## Verifiering

`npm run smoke:planering-gora-e` + `npm run smoke:inkast-fas2` + manuell G85
