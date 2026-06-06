# LivSuper — cursor-plan (launcher-modell)

**Datum:** 2026-06-06  
**Status:** Fas 1 **done** 2026-06-06 (launcher live) · Fas 2–3 open  
**Metod:** Cursor-native — **launcher**, inte nested shell  
**Kanon:** [`2026-06-01-superhub-IA-spec.md`](./2026-06-01-superhub-IA-spec.md) · [`MENU-DRAWER-KANON.md`](../design/references/MENU-DRAWER-KANON.md) · [`PLANERING-PROJEKT-HYBRID.md`](../design/PLANERING-PROJEKT-HYBRID.md)

---

## Beslut (2026-06-06)

**Launcher — inte embed-shell.** Användaren backade från `VardagenShellPage` (flikar i flikar). Liv och göra = **en dropdown** på `/vardagen`; tunga moduler öppnas på **egen fullsid-route**.

| Modell | Status |
|--------|--------|
| ~~Embed-shell (`VardagenShellPage`)~~ | **AVVISAD** — tab-helvete |
| **Launcher (`LivLauncherPage`)** | **Fas 1 live** |
| `LivSuperModule` variants | DEFER Fas 3+ |

---

## Målbild

```
/vardagen (LivLauncherPage)
  ├── Dropdown: Kompass | Ekonomi | MåBra | Handling | Projekt | Arbetsliv
  ├── Kompass + Ekonomi → visas inline (en shell)
  └── Övrigt → navigate('/mabra' | '/planering' | '/projekt' | '/arbetsliv')
```

**Drawer:** «Liv och göra» → `/vardagen` (Fas 1: etikett uppdaterad i navTruth)

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

## Fas 2 (DEFER)

- «← Liv» tillbaka-länk i header på MåBra / Planering / Arbetsliv
- Stora launcher-kort (valfritt UI-polish)

---

## Fas 3 (DEFER)

- `VardagenShellPage.tsx` — markera deprecated eller radera
- Drogfrihet primärt under Familj (superhub-spec)

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

## Prompt för Cursor (Fas 2)

```
LivSuper Fas 2: lägg till diskret «← Liv och göra» i HubPageShell headerAside på MabraPage, PlaneringPage, ArbetslivHubPage — länk till /vardagen. Ingen ny TabBar. Smoke PASS.
```
