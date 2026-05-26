# Pre-Merge Impact Report (PMIR) — theme-pack-j → main

**Datum:** 2026-05-26  
**Gren:** `theme-pack-j` → **`main`**  
**HEAD:** `de9a856e` — feat: Valv drawer, Inkast Lite, Life Hub presets och rutiner  
**Agent / session:** Masterplan landning (öppna planer)

---

## Följer med till main

- [x] **Drawer Vardag/Valv** — `DrawerModeToggle`, `DrawerHubAccordion`, `navTruth.ts`, `MENU-DRAWER-KANON.md`
- [x] **Valv-baksida** — `VaultKunskapsbankPanel`, `VaultForensicPanel`, `vaultTabs.ts`, redirects från publik kunskap
- [x] **Inkast Lite Fas 0–1** — `InkastLiteCard`, `submitInkastLite`, `functions/src/lib/submitInkastLite.ts`
- [x] **Life Hub Fas A+B** — `src/modules/core/lifeOs/` (presets, rutiner, hub-hints)
- [x] **Fyren hub-kontextrad (W4)** — `hubContextBar.ts`, `FyrenSmartWidgetBar` (4 slots + Mer)
- [x] **Projekt minimal** — `/projekt/ny`, `ProjektNyPage` (Firestore P1 **ej** full)
- [x] **Widget** — WH1 inspelning, Android stamp widget stub, theme pack J
- [x] **Stämpelklocka** — `StampClockHomeSection`, hooks
- [x] Låst UX — `npm run smoke:locked-ux`: **PASS** (på grenen före merge)
- [x] Build — `npm run build`: **PASS** (på grenen före merge)

**Diff mot main:** ~118 filer, +6184 / −984 rader (uppskattning vid PMIR-skrivning).

---

## Försvinner (vid gren-radering utan merge)

| Vad | Detalj |
|-----|--------|
| Gren (lokal + remote) | `theme-pack-j` om raderad utan merge |
| Commits som **inte** mergas | 3 commits ovan `main` (theme-pack-j-spåret) |
| Kod kvar **endast** på grenen | Allt i tabellen «Följer med» — **inget unikt** om merge görs |

---

## Regelanalys (läst — inte gissad)

| Lager | Källor | Status |
|-------|--------|--------|
| **System** | `.context/system-plan.md`, `grunder-kanon.mdc` U1–U5 | **PASS** — tre silos oförändrade; Inkast Lite ny callable, ej cross-RAG |
| **Design** | `locked-ux-features.md`, Barnfokus, Valv Mönster/Orkester, drawer-kanon | **PASS** — smoke:locked-ux verifierar |
| **Säkerhet** | `.context/security.md`, Sacred, Zero Footprint | **PASS** — `firestore.rules` **ej** ändrad i denna diff (verifierat via git diff scope) |
| **Innehåll U6** | `innehall-register.mdc` | **PASS** — inga nya FACT-kort i prod utan bank |

**Risk att notera:** Merge är stor; manuell smoke #1–7 på device rekommenderas efter merge.

---

## Smoke (på grenen före merge — 2026-05-26)

| Kommando | Resultat |
|----------|----------|
| `npm run build` | **PASS** |
| `npm run smoke:locked-ux` | **PASS** |
| `npm run smoke:orkester` | Ej körd i landning — kör på `main` efter merge |

## Smoke (på `main` efter merge — fyll i vid merge)

| Kommando | Resultat |
|----------|----------|
| `npm run build` | PASS / FAIL |
| `npm run smoke:locked-ux` | PASS / FAIL |
| `npm run smoke:orkester` | PASS / FAIL / skip |

---

## Rekommendation

- [x] Merge till `main` + push `origin` — **efter användarens OK**
- [ ] Merge **utan** gren-radering
- [ ] Cherry-pick specifika commits: ___
- [ ] **Avbryt** — anledning: ___

**Ej merge i denna session** — väntar på *"godkänn merge"*.

---

## Godkännande

**Användaren:** ☐ godkänn merge · ☐ avbryt  
**Datum:** ___________

---

Se även: [`2026-05-26-session-landning.md`](./2026-05-26-session-landning.md) · [`MERGE-IMPACT-RAPPORT.md`](../MERGE-IMPACT-RAPPORT.md)
