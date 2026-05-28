# Navigation UX — detaljer (2026-05-28)

**SSOT:** [`navTruth.ts`](../../src/modules/core/navigation/navTruth.ts) · **Kanon drawer:** [`references/MENU-DRAWER-KANON.md`](./references/MENU-DRAWER-KANON.md) · **Chrome:** [`CHROME-POLICY.md`](./CHROME-POLICY.md)

## Lager (utan dubbel sanning)

| Lager | Fil | Ansvar |
|-------|-----|--------|
| 1 | `navTruth.ts` | Labels, paths, drawer-rader, Valv-grupper |
| 2 | `hubTabs.tsx` + `useHubTab` | Hub-underflikar (`?tab=`) |
| 3 | `tabRegistry.ts` | Hjärtat/Valv TabBar, `getMainVaultTabBarItems` |
| 4 | `appNavigation.ts` | Hem-kluster, Fyren-chips, legacy-redirects |
| 5 | `AppRoutes.tsx` | Topp-routes + bokmärkes-redirects |

## Lättnavigerbara menyer (implementerat)

- **En källa per hub:** Familjen, Vardagen, Hamn, Planering m.fl. läser flikar via `useHubTab` — inte parallella konstanter.
- **Accordion-drawer:** Hub-rad expanderar underflikar; aktiv rad = guld streck (MENU-DRAWER-KANON).
- **Valv-läge:** Separat drawer-träd efter PIN — ingen Valv-växlare i publikt läge.
- **Legacy-redirects:** `/kompasser`, `/valv`, `/kunskap`, `/ekonomi` → kanoniska paths (bokmärken trasiga inte).
- **Drogfrihet:** Flik `?tab=kunskap` behåller path men label **Stöd & resurser** (ej Valv Kunskap).

## Mac / Cursor

| Åtgärd | Kortkommando |
|--------|----------------|
| Öppna fil (t.ex. navTruth) | `Cmd + P` → `navTruth.ts` |
| Inline-agent (prompt) | `Cmd + I` |
| Agent-chatt | `Cmd + L` |

## Nästa UX-förbättringar (produkt, ej kod här)

- Hub-specifika `footerSlot` i `HubPageShell` för en primär handling per flik.
- `MaterialPackShortcuts` synlig endast när Life OS-preset har material för hubben.
- Valfri "Senast besökt"-rad i drawer (max 3, från `sessionStorage`, Zero Footprint-vänlig).
