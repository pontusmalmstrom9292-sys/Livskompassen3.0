# Unlock — MOD-WIDGET (Egna moduler · W1)

**Datum:** 2026-07-21  
**Modul:** `MOD-WIDGET`  
**Våg:** W1 (masterplan v2.2 «Egna moduler»)  
**approved: yes**

**Pontus OK:** 2026-07-21 — «godkänn v2.2 kör hela planen».

**Relaterat:**  
- Contract: [`docs/specs/user-widgets-contract-v1.md`](../specs/user-widgets-contract-v1.md)  
- PMIR: [`docs/evaluations/2026-07-21-pmir-user-widgets-slotid-status.md`](./2026-07-21-pmir-user-widgets-slotid-status.md)  
- Masterplan: [`docs/evaluations/2026-07-21-modulbygg-pin-kanon-masterplan.md`](./2026-07-21-modulbygg-pin-kanon-masterplan.md)

---

## Syfte

Smal unlock av widget-motorn för mallar + typ-switch + CRUD/presets inom frozen MVP-types — **innan** Hem-adapter (W2) och Planering-skal (W3).

---

## In-scope (W1)

| Yta | Tillåtet |
|-----|----------|
| `WidgetModuler*` | Board, add-form, page — mallar inom whitelist |
| `HomeWidgetRenderer` | Switch → registry-map; style presets |
| `user_widgets` types / CRUD | `UserWidget` fields per contract; save/update/subscribe; pin/unpin/reorder helpers |
| Style presets | Optional `stylePreset` render |
| Experimentera | Experiment-/sandbox-yta kopplad till motor (ej Freeport-canvas på Hem) |

---

## Out-of-scope (MUST NOT)

- Fyren / dock / chrome (`MOD-CORE-*`)
- Record / ingest / Valv WORM-flöden
- Hem-canvas / DAD-grid redesign (`HomeLayoutA` hero)
- `?tab=bygg` under Planering → separat unlock W3 (`MOD-VARD-PLAN`)
- Ny `UserWidget.type` utanför `countdown|checklist|linked_savings|quick_note`
- Android WH8 deep-link-brott
- Fri canvas som Hem-hero

---

## Lock-kontrakt

```
unlock-doc (denna, approved: yes) + register developing
  → feature (additiv)
  → smoke: widgets (+ locked-ux / design-modules vid UI)
  → lock_module.mjs
  → ingen borttagning av entry/route/mall
```

**Status:** developing under W1; re-lock efter smoke PASS.

---

## Rules

Schema-mutation kräver PMIR ovan. **Ingen rules-deploy** utan separat Pontus «OK deploy».

---

*Docs only i W0 — feature-kod startar tidigast W1 efter W0 DoD.*
