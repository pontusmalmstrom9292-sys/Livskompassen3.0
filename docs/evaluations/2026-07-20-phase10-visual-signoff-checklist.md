# Phase 10 visual sign-off checklist

**Date:** 2026-07-20 · **Wave:** B08 · **Program:** Premium UI Polish — Phase 10 (legacy CSS sunset)  
**Scope:** Executive chrome / dock / hem — **locked UX**. No dock CSS deletion.

Reference: `docs/PROJECT_STATE.md` (Phase 10 in progress; `executive-chrome.css` retained).

## Before sign-off

- [ ] `npm run build` PASS
- [ ] `npm run smoke:design-modules` PASS
- [ ] `npm run smoke:locked-ux` PASS
- [ ] Test on **Motorola G85** (primary) + one desktop width (1280px)

## Executive chrome (`src/styles/executive-chrome.css`)

- [ ] Header: **LIVSKOMPASSEN** centered; ögat (Kompis) primary action right
- [ ] Glass material, gold accents — no flat Material toolbar regression
- [ ] Menu (hamburger) opens drawer; focus ring visible on icon buttons
- [ ] No accidental removal of `executive-chrome.css` import from `index.css`

## Dock (locked — DAD)

- [ ] Kompass **center**, larger than side icons; not inlined into flat tab bar
- [ ] Side zones: Anteckning / Familj / Hjärtat-Ventil / Inkast / Resurser per kanon
- [ ] Long-press kompass ~3s → Valv gate (haptic/progress ring if theme supports)
- [ ] Dock clearance: content not hidden behind floating dock on `/` and hub routes
- [ ] **No** deletion of dock CSS files (`dock-hub-band.css`, `dock-compass-hub.css`, `executive-chrome.css`)

## Hem / startsida

- [ ] **Dagens Reflektion** (hero) remains primary content module
- [ ] Visual hierarchy: Livskompassen → ögat → reflektion → kompass → övrigt
- [ ] Snabbstart / Fyren widgets do not overpower hero
- [ ] Low-capacity mode readable (contrast, touch targets ≥44px)

## Drawer / navigation chrome

- [ ] Vardag section + Valv section (when unlocked) match `MENU-DRAWER-KANON`
- [ ] Active row: gold accent only
- [ ] Swipe/backdrop close works; Escape closes drawer

## Regression guards

- [ ] `/familjen` — Barnfokus / locked §12 flows intact
- [ ] `/vardagen` — MåBra tab loads without layout break
- [ ] `/valvet` — PIN gate + tabs unchanged
- [ ] Theme Lab / sandbox routes unaffected

## Sign-off

| Role | Name | Date | OK |
|------|------|------|-----|
| Product (Pontus) | | | [ ] |

**After OK:** Update `docs/TODO.md` completion section + `docs/PROJECT_STATE.md` program note (visual sign-off done).
