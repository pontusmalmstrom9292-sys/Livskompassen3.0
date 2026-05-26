# Session landning — 2026-05-26

**Gren vid commit:** `theme-pack-j`  
**Verifiering:** `npm run build` PASS · `npm run smoke:locked-ux` PASS

---

## Klart i kod (denna session + tidigare chattar)

| Spår | Status | Bevis |
|------|--------|--------|
| **Drawer Vardag/Valv** | **done** | [`MENU-DRAWER-KANON.md`](../design/references/MENU-DRAWER-KANON.md), `DrawerModeToggle`, `DrawerHubAccordion`, `navTruth.ts` |
| **Valv-baksida** | **done** | `VaultKunskapsbankPanel`, `VaultForensicPanel`, `vaultTabs.ts`, redirects |
| **Inkast Lite Fas 0–1** | **done** | `InkastLiteCard`, `submitInkastLite`, `functions/src/lib/submitInkastLite.ts` |
| **Life Hub Fas A** | **done** | `src/modules/core/lifeOs/` — 4 presets, Hem-väljare, materialFlags |
| **Rutiner Fas B** | **done** | `routineTemplates.ts`, `RoutinesPanel` på `/planering` |
| **Projekt minimal** | **partial** | `/projekt/ny` + `ProjektNyPage` — Firestore `projects` / `projectId` på kanban **ej** |
| **Fyren hub-kontextrad** | **partial** | `hubContextBar.ts` + `FyrenSmartWidgetBar` (4 slots + Mer). W1 rutnät (variant 1) **ej** |
| **Widget inspelning WH1** | **done** | `/widget/inspelning` → `tyst_inspelning` (commit `5b4b68f7` på grenen) |

---

## Öppna planer (bygg inte igen)

| Plan | Nästa kommando |
|------|----------------|
| Inkast Fas 2–5 | `kör inkast fas 2` |
| MåBra Daglig Mix | `kör måbra daglig mix` |
| Projekt P1 full | `kör projekt P1` |
| Fyren W1 rutnät / polish | `kör fyren kontextrad finish` |
| Header blur | `kör header utan blur` |

Kanon komihåg: [`LIFE-OS-KOPPLINGAR-KOMIHAG.md`](../design/LIFE-OS-KOPPLINGAR-KOMIHAG.md) Fas C–D.

---

## Fyren galleri vs kod

| Variant | Bild | Kod idag |
|---------|------|----------|
| W1 Rutnät 4×2 | `fyren-widget-variants-1-4.png` #1 | **Ej** — Hem har Life Hub + drawer |
| W2 Peek | #2 | Delvis — Mer-panel (anteckning/inspelning) |
| W3 Favorit-rad | #3 | Nära — 4 hub-slots i `FyrenSmartWidgetBar` |
| W4 Kontext Planering | #4 | **Ja** — `hubContextBar` på `/planering` |

---

## Chatt-referenser (arkiv)

| UUID | Tema |
|------|------|
| `79d85947` | Valv-baksida drawer |
| `e641cde2` | Helhetsindex meny |
| `97db30d3` | Inkast Life OS |
| `0b3b6c72` | MåBra curator + header/Fyren planer |
| `9636ac16` | Widget WH1 |
