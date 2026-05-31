# Hub-analys: Kompass (Hem · Inställningar · Drawer · Fyren)

**Datum:** 2026-05-31  
**Git:** `main` (dirty worktree)  
**Scope:** `/`, `/installningar`, sidomeny, dock/Fyren-widget

---

## Syfte & route

Kompass-hubben är appens **navigations- och identitetsankare**: Hem som startpunkt, Inställningar för konto/tema, hamburger-drawer som sanning för alla hubbar, och Fyren (3 s long-press) som enda väg till Valv utan direktlänk.

| Entry | Route | Primär komponent |
|-------|-------|------------------|
| Hem Kompass | `/` | `HomePage` |
| Inkast (deep) | `/#inkast-lite` | `InkastLiteCard` |
| Inställningar | `/installningar`, `?tab=allmant\|drogfrihet` | `InstallningarPage` |
| Drawer | global (header) | `NavigationDrawer` |
| Fyren → Valv | dock / modulhub | `openValvViaFyren` → `/dagbok?tab=bevis` |

Sanning för labels och paths: `navTruth.ts` rader 72–414 (`hem`, `installningar`).

---

## Användarresa ×3

### 1. Morgon på Hem
Användaren öppnar appen → `/` visar `HomeHeroKanon` (check-in), valfritt `StampClockHomeSection`, `InkastLiteCard`, fäst planeringslista (`PlaneringHomePinCard`) och adaptiva minneskort. Ingen auth krävs för hero; inloggade ser fler block.

### 2. Justera konto och tema
Meny → **Inställningar** → flik **Allmänt**: auto-tema per modul, stämpel på Hem, Life Hub-preset. Konto via låsikon i header (`InstallningarPage` rad 41–42). Drogfrihet-räknare nollställs under flik **Drogfrihet** (känsligt val isolerat).

### 3. Öppna Valv via Fyren
I dock/modulhub: håll **Hjärtat** 3 s → WebAuthn → `setVaultGate()` → navigera till Dagbok Bevis. Drawer byter till **Valv**-sektion när session är öppen (`NavigationDrawer` rad 64–68).

---

## Kod vs spec

| Aspekt | Spec / kanon | Kod (verifierat) | Match? |
|--------|--------------|------------------|--------|
| Drawer två lägen | Vardag vs Valv; ingen Valv-växlare publikt | `NavigationDrawer` 22–24, 64–68; `MENU-DRAWER-KANON.md` | ✅ |
| Hub-ordning drawer | Dagbok → … → Inställningar | `NAV_TRUTH` 71–398 | ✅ |
| Snabbåtgärder i drawer | Ej i drawer — Fyren/hub | Kanon rad 18; inga `quick-grid` i drawer | ✅ |
| Fyren = WebAuthn, inte PIN i UI | Sacred + deploy-regler | `valvFyrenGate.ts` 13–28 | ✅ |
| Hem planerings-pin | Widget W1 / hybrid | `PlaneringHomePinCard` 9–26 | ✅ |
| Aktiv rad guld | COLOR-POLICY | `DrawerHubAccordion` (smoke) | ✅ |

---

## Navigationsproblem

1. **Dubbel widget-rad:** `MainLayout` monterar både `FyrenSmartWidgetBar` och `FyrenWidgetBar` (rad 86–87) — risk för visuell överlapp på små skärmar.
2. **Inställningar vs konto:** Konto ligger i header-lås, inte i Inställningar-fliken — kan feltolkas som “inställningar saknas”.
3. **`hem_inkast` i navTruth** har path `/#inkast-lite` men `inDrawer: false` — inkast nås via Hem/Fyren, inte drawer (avsiktligt men svårupptäckt).
4. **Valv-drawer från vilken route:** När Valv är upplåst visas Valv-menyn även utanför `/dagbok` — korrekt per kanon men kan förvirra om användaren glömmer att stänga session.

---

## Locked UX

| Feature | Register | Kod |
|---------|----------|-----|
| Sidomeny Vardag/Valv | `MENU-DRAWER-KANON.md`, `locked-ux-features.mdc` | `navTruth.ts`, `NavigationDrawer.tsx` |
| Fyren 3 s + biometri | Sacred / smoke | `valvFyrenGate.ts` 13–28, `VaultPage.tsx` 180–191 |
| Fyren widget bar | `WIDGET-BAR-SPEC.md` | `FyrenSmartWidgetBar`, `MainLayout` 86–87 |
| Planering home pin | Planering hybrid | `PlaneringHomePinCard.tsx` |
| D1 LivskompassMark i drawer | `locked-icons.md` | `NavigationDrawer` (LivskompassMark import rad 9) |

---

## Smoke

| Script | Relevans |
|--------|----------|
| `npm run smoke:locked-ux` | Fyren, drawer Vardag+Valv, widget, navTruth |
| `npm run smoke:design-modules` | drawerHint, drawerNav |
| `npm run build` | Hem + layout chunk |

Baseline 2026-05-31: alla PASS (`2026-05-31-hub-baseline.md`).

---

## Ombyggnadsidéer P1–P3

**P1 (låg risk):** En enda Fyren-widget-rad på Hem; dokumentera “konto = låsikon” i Inställningar-lead.  
**P2 (medel):** Synka `hem_inkast` synlighet med Fyren quick action (`fyrenHomeQuick` finns redan på andra hubbar i `navTruth` 87).  
**P3 (större):** Enhetlig “Kompass-system”-hub som samlar Inställningar + Life preset + nätverkschip utan att bryta drawer-kanon.

---

## diff-scope

| Fil / område | Typisk diff |
|--------------|-------------|
| `src/modules/core/pages/HomePage.tsx` | Hem-innehåll, preset-gating |
| `src/modules/core/pages/InstallningarPage.tsx` | Flikar, toggles |
| `src/modules/core/layout/NavigationDrawer.tsx` | Drawer-läge, badges (vävare) |
| `src/modules/core/navigation/navTruth.ts` | Hub-labels, ordning |
| `src/modules/core/layout/MainLayout.tsx` | Fyren/dock |
| `src/modules/core/auth/valvFyrenGate.ts` | Valv-gate |
| `docs/design/references/MENU-DRAWER-KANON.md` | Kanon vid drawer-ändring |

**Ej i scope:** Valv-innehåll (VaultPage), hub-specifikt innehåll (Dagbok, Familjen, …).
