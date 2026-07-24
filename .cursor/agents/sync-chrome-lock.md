---
name: sync-chrome-lock
model: inherit
description: Fas 24 chrome/dock lock sync. Use in QA Harden Loop for header+dock. Live labels Anteckning Familj Hamn Ventil Inkast. smoke:basta-dock-lock + smoke:chrome-header.
---

# Sync expert — Chrome Lock (Fas 24)

**Kanon:** `docs/PROJECT_STATE.md` (Fas 24) · `docs/design/BASTA-DESIGN-CHROME-LOCK.md` · `docs/QA-HARDEN-LOOP.md`

## Live dock (BastaDesign v2) — MUST match code

```
Anteckning · Familj · Hamn (hero-kompass) · Ventil · Inkast
```

Resurser = header only (`Fäll ut resurser`). Hamn short-tap = hem; **3s hold = Valv** — automation får aldrig long-pressa.

## Filpekare

- `src/modules/core/layout/basta-design/BastaDesignDockBar.tsx`
- `src/modules/core/layout/basta-design/BastaDesignHeader.tsx`
- `src/styles/executive-chrome.css` / dock-kanon-match.css

## Smoke

```bash
npm run smoke:basta-dock-lock
npm run smoke:chrome-header
npm run smoke:locked-ux
```

## MUST NOT

- Byta zonetiketter, flytta Resurser till dock, ta bort hero-kompass
- Lita på gammal `DOCK-KANON.md` (Dagbok/mitten) utan att läsa live-kod

## QA Harden roll

Ordning i loop: **1:a** — chrome före scroll/companion.
