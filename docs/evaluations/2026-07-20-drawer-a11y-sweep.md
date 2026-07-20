# Drawer / chrome a11y sweep — 2026-07-20

**Wave:** B05 · **Scope:** drawer + dock chrome icon buttons (max ~8 files)

## Changed (code)

| File | Change |
|------|--------|
| `DrawerHubAccordion.tsx` | `aria-label` on hub expand/collapse trigger |
| `DrawerQuickActions.tsx` | `aria-label` on icon quick-action buttons |
| `NavigationDrawer.tsx` | `aria-label` on Vardag/Valv rows + recent chips |
| `DrawerModeToggle.tsx` | `aria-label` on back-to-Vardag control |
| `HubDropdownNav.tsx` | `aria-label` on listbox options (icon + label) |
| `MabraHistoryView.tsx` | `aria-label` + `aria-pressed` on period filter chips |

## Already OK (no change)

- `DesignPackCenterHeader` menu button — `aria-label="Öppna meny"`
- `ExecutiveDockBar` / `DockNavButton` — `aria-label={label}`
- `FloatingDock` center compass — `aria-label` with Valv long-press hint
- `FyrenWidgetBar`, `FyrenHeaderQuickToggle`, `KompisHeaderVaultButton`, `SosMainTrigger`
- `ResurserOverlay` close button

## Remaining (future sweep)

- Hub module tab bars outside drawer (`HubTabBar` partial coverage)
- Valv internal icon-only toolbars
- Sandbox / Theme Lab chrome (lower priority)
- Basta-design variant dock (separate lock doc)

## Verification

- Manual: VoiceOver / TalkBack on G85 — drawer open → hub accordion → Valv row
- Automated: `npm run build` (no a11y-specific smoke required for this wave)
