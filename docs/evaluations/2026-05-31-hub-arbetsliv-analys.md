# Hub-analys: Arbetsliv (Stämpel · Tid · Logg)

**Datum:** 2026-05-31  
**Git:** `main` (dirty worktree)  
**Scope:** `/arbetsliv`, Valv-forensik för frånvaro/lön

---

## Syfte & route

**Arbetsliv** samlar **publik** jobb-vardag: stämpelklocka, tid/flex och ekonomilogg. Känslig frånvaro och lönespec ligger bakom Valv (forensik-flikar), inte i publik hub.

| Flik | Route | Panel |
|------|-------|-------|
| Stämpel | `/arbetsliv?tab=stampla` (default) | `StampClockPage` |
| Tid & flex | `/arbetsliv?tab=tid` | `EconomyTidPanel` |
| Logg | `/arbetsliv?tab=logg` | `EconomyLogPanel` |

Legacy: `/stampla` → redirect (`AppRoutes.tsx` 88). Valv: `arbetsliv_franvaro`, `arbetsliv_lon` (`vaultTabs.ts` 40–47).

Nav: `navTruth.ts` 257–287. Smoke: `scripts/smoke_arbetsliv_hub.mjs`.

---

## Användarresa ×3

### 1. Stämpla in/ut
Arbetsliv → **Stämpel** → `StampClockPage`. Widget alternativ: Inställningar toggle “Stämpelklocka på Hem” (`InstallningarPage` 59–74). Standard = Arbetsliv + hemskärms-widget (copy i `ArbetslivHubPage` 52–55).

### 2. Flex och tid
Flik **Tid & flex** → `EconomyTidPanel` — jobbrelaterad tid, inte privat veckopeng (länk till Vardagen ekonomi i footer-kort, rad 66–77).

### 3. Frånvaro/lön via Valv
Deep link `/arbetsliv?tab=franvaro` eller `lon` → `legacyTabRedirects` till `/dagbok?tab=bevis&vaultTab=…` (`ArbetslivHubPage` 22–27). Kräver Fyren-session.

---

## Kod vs spec

| Aspekt | Spec | Kod | Match? |
|--------|------|-----|--------|
| Publik stämpel/tid/logg | Hub design | `ArbetslivHubPage` 30–41 | ✅ |
| Frånvaro/lön i Valv | Layered Defense | `legacyTabRedirects` 24–25 | ✅ |
| Avgränsning privat ekonomi | Copy + länk | `BentoCard` 66–77 | ✅ |
| drawer arbetsliv | smoke_arbetsliv | `drawerNav.ts` + navTruth | ✅ |
| Forensik tab IDs | vaultTabs | `arbetsliv_franvaro`, `arbetsliv_lon` | ✅ |

---

## Navigationsproblem

1. **Frånvaro/lön osynliga i publik TabBar** — användare måste veta Valv-menyn eller gamla länkar.
2. **StampClockPage copy** nämner Valv Lön (rad 211 i grep) — bra men lätt att missa utan Fyren.
3. **Theme delad med Vardagen** (`J-vardagen-orbit`) — visuellt lika hubbar, olika domän.
4. **Widget vs hub** — tre ställen (Hem toggle, widget, Arbetsliv) för stämpel.

---

## Locked UX

| Feature | Notering |
|---------|----------|
| Stämpelklocka | admin/stampla modul |
| Widget stamp | smoke widget routes |
| Valv lön/frånvaro | forensik zone — ej publik |

Ingen separat “locked” rad i register för Arbetsliv utöver planering/widget-grannar.

---

## Smoke

```bash
npm run smoke:arbetsliv
npm run smoke:locked-ux
npm run build
```

`smoke:arbetsliv` verifierar hub, route, drawer, zon, locked register (`smoke_arbetsliv_hub.mjs` rad 48–52).

---

## Ombyggnadsidéer P1–P3

**P1:** Diskret “Jobbdata i Valv”-länk under Stämpel-fliken (gated copy, ingen auto-nav).  
**P2:** Egen themeId för Arbetsliv (skilj från Vardagen visuellt).  
**P3:** En Valv-forensik entry “Arbetsliv” som grupperar frånvaro+lön i UI.

---

## diff-scope

| Område | Filer |
|--------|-------|
| Hub shell | `ArbetslivHubPage.tsx` |
| Stämpel | `StampClockPage.tsx`, `stampla/*` |
| Tid/logg | `EconomyTidPanel.tsx`, `EconomyLogPanel.tsx` |
| Valv forensik | `VaultForensicPanel.tsx`, `vaultTabs.ts` |
| Nav | `navTruth.ts`, `drawerNav.ts` |
| Smoke | `scripts/smoke_arbetsliv_hub.mjs` |

**Backend:** stamp/lön callables om ingest ändras — functions scope.
