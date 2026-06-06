# LivSuper — cursor-plan (launcher-modell)

**Datum:** 2026-06-06  
**Status:** Fas 1–3 **done** · Drogfrihet→Familj **done** 2026-06-06 (smoke PASS)  
**Metod:** Cursor-native — **launcher**, inte nested shell  
**Kanon:** [`2026-06-01-superhub-IA-spec.md`](./2026-06-01-superhub-IA-spec.md) · [`MENU-DRAWER-KANON.md`](../design/references/MENU-DRAWER-KANON.md) · [`PLANERING-PROJEKT-HYBRID.md`](../design/PLANERING-PROJEKT-HYBRID.md)

---

## Beslut (2026-06-06)

**Launcher — inte embed-shell.** Användaren backade från `VardagenShellPage` (flikar i flikar). Liv och göra = **stora kort** på `/vardagen`; tunga moduler öppnas på **egen fullsid-route**.

| Modell | Status |
|--------|--------|
| ~~Embed-shell (`VardagenShellPage`)~~ | **RADERAD** 2026-06-06 |
| **Launcher (`LivLauncherPage`)** | **Fas 1–3 live** |
| `LivSuperModule` variants | DEFER |

---

## Målbild

```
/vardagen (LivLauncherPage)
  ├── Stora kort: Kompass | Ekonomi | MåBra | Handling | Projekt | Arbetsliv
  ├── Kompass + Ekonomi → visas inline (en shell)
  └── Övrigt → navigate('/mabra' | '/planering' | '/projekt' | '/arbetsliv')
```

**Drawer:** «Liv och göra» → `/vardagen`

**Tillbaka:** `LivBackLink` på MåBra · Planering · Arbetsliv → `/vardagen`

---

## Fas 1 — leverans (done)

- [x] `LivLauncherPage` + `livLauncherRoutes.ts`
- [x] `/vardagen` → launcher (kompass + ekonomi inline)
- [x] `/mabra`, `/planering`, `/arbetsliv`, `/drogfrihet` → direktmount (AuthGate)
- [x] Legacy `/liv?tab=mabra` etc. → rätt fullsid-route
- [x] `GoraHubTabBar` → `/planering?tab=…` (inte vardagen)
- [x] Drawer-label «Liv och göra»
- [x] Smoke PASS (build · locked-ux · design-modules · arbetsliv)

**Nyckel-filer:**
- [`src/modules/shell/LivLauncherPage.tsx`](../../src/modules/shell/LivLauncherPage.tsx)
- [`src/modules/core/routing/AppRoutes.tsx`](../../src/modules/core/routing/AppRoutes.tsx)
- [`src/modules/core/navigation/GoraHubTabBar.tsx`](../../src/modules/core/navigation/GoraHubTabBar.tsx)

---

## Fas 2 — leverans (done 2026-06-06)

- [x] `LivBackLink` — «← Liv och göra» i header på MåBra · Planering · Arbetsliv
- [x] `LivLauncherGrid` — stora Obsidian Calm-kort (guld/smaragd botten-glow)
- [x] Dropdown ersatt av kortgrid på `/vardagen`
- [x] CSS i `obsidian-calm-2.css` (`.liv-launcher-grid`, `.liv-launcher-card`)
- [x] Smoke PASS

**Nyckel-filer:**
- [`src/modules/shell/LivLauncherGrid.tsx`](../../src/modules/shell/LivLauncherGrid.tsx)
- [`src/modules/shell/LivBackLink.tsx`](../../src/modules/shell/LivBackLink.tsx)
- [`src/styles/obsidian-calm-2.css`](../../src/styles/obsidian-calm-2.css)

---

## Fas 3 — leverans (done 2026-06-06)

- [x] `VardagenShellPage.tsx` raderad
- [x] Exports rensade (`shell/index.ts`, `dailyLife/index.ts`)
- [x] `AppRoutes` mountar endast `LivLauncherPage` på `/vardagen`
- [x] Smoke PASS (negativ guard: ingen `VardagenShellPage`)

## Drogfrihet → Familjen (done 2026-06-06)

- [x] Flik `drogfrihet` i `FamiljenPage` (embedded `DrogfrihetHubPage`)
- [x] `/drogfrihet` → redirect `/familjen?tab=drogfrihet` (underflik via `drogfrihetTab`)
- [x] Borttagen `vardagen_drogfrihet` i `navTruth`
- [x] Smoke PASS

---

## MUST NOT

- Koppla in `VardagenShellPage` utan embedded-stripping
- Slå ihop Handling + Projekt
- Ta bort P3 Kanban eller MåBra-guard

---

## Smoke

```bash
npm run build
npm run smoke:locked-ux
npm run smoke:design-modules
npm run smoke:arbetsliv
```

---

## Prompt för Cursor (DEFER — Drogfrihet)

```
Flytta Drogfrihet primärt under Familjen enligt superhub-IA-spec. Behåll /drogfrihet som legacy-redirect. Smoke PASS.
```
