# Session landning — 2026-05-26

**Gren:** `theme-pack-j` → **`main`** (merged 2026-05-26)  
**Verifiering på main:** `npm run build` PASS · `npm run smoke:locked-ux` PASS · `npm run smoke:orkester` PASS  
**PMIR:** [`2026-05-26-pmir-theme-pack-j.md`](./2026-05-26-pmir-theme-pack-j.md) — **merge utförd**

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
| **Fyren hub-kontextrad** | **done** | `hubContextBar.ts` + `FyrenSmartWidgetBar` (4 slots + Mer) |
| **Fyren W1 rutnät 4×2** | **cancelled** | Life Hub + drawer räcker; se galleri nedan |
| **Widget inspelning WH1** | **done** | `/widget/inspelning` → `tyst_inspelning` |
| **Header blur (minimal)** | **done** | `.header-glass-btn` utan backdrop-filter (`index.css`) |

---

## Plan-register (masterplan 2026-05-26)

| Planfil | Status | Åtgärd / nästa steg |
|---------|--------|---------------------|
| `valv-baksida_drawer` | **completed** | — |
| `en_chatt_kvarvarande` | **completed** | block 4 cancelled |
| `komihåg_kopplingssystem` | **completed** | Fas A+B i kod; C–D öppna |
| `hub-kontextrad_4_knappar` | **completed** | W1 cancelled |
| `inkast_life_os` | **partial** | Fas 0–1 done → **ny chatt** fas 2 |
| `måbra_daglig_mix` | **open** | **ny chatt** |
| `header_utan_blur` | **partial** | `remove-btn-blur` done; övrigt cancelled/deferred |
| `p0_ux_inkorg_build` | **cancelled** | Ersatt av Inkast Lite |
| `måbra_hub_utbyggnad` | **cancelled** | Superseded → `måbra_daglig_mix` |
| `kunskapsvalv_ux_v2` | **deferred** | `VaultKunskapsbankPanel` done; gap-analys före rest |
| `valv-tier_+_3_hubbar` | **deferred** | B1–B2 done; B3–E superseded/deferred |
| `grunder_och_systemordning` | **deferred** | GCP U6 cancelled tills vidare |
| `github_branch-städning` | **ny chatt** | Efter merge till `main` |
| `moln_autorun_kostnad` | **ny chatt** | Ops vid behov |
| `öppna_planer_master` | **executed** | Denna landning (planfil ej redigerad) |

---

## Öppna planer (bygg inte igen)

| Plan | Nästa kommando |
|------|----------------|
| Inkast Fas 2–5 | `kör inkast fas 2` |
| MåBra Daglig Mix | `kör måbra daglig mix` |
| Projekt P1 full | `kör projekt P1` |
| Life OS Fas C | `kör kopplingar C` |
| Fyren polish (ej W1) | `kör fyren kontextrad finish` |
| Header polish (rest) | `kör header utan blur` (endast om full plan) |
| Merge | `godkänn merge` efter PMIR-granskning |

Kanon komihåg: [`LIFE-OS-KOPPLINGAR-KOMIHAG.md`](../design/LIFE-OS-KOPPLINGAR-KOMIHAG.md) Fas C–D.

---

## Ny chatt — färdiga prompter

### Steg 1 — Landning (om ej körd)

```text
Kör PLAN-LANDNING Steg 1:
1) PMIR för merge theme-pack-j → main (ingen merge utan mitt OK)
2) Uppdatera .context/system-plan.md Life OS-rader (Fas A+B klart)
3) Utöka docs/evaluations/2026-05-26-session-landning.md med Plan-register
4) Stäng/annullera plan-todos enligt masterplan
5) Valfritt: header blur bort på .header-glass-btn
Bygg INTE om drawer, Inkast Lite, lifeOs. smoke PASS.
```

### Steg 2A — Snabb produkt (välj ett)

```text
Läs docs/evaluations/2026-05-26-session-landning.md — bygg INTE drawer/Inkast/lifeOs om de finns.
Uppgift: kör projekt P1
smoke:locked-ux PASS. Uppdatera plan-todos till completed när klart.
```

```text
Läs docs/evaluations/2026-05-26-session-landning.md — bygg INTE drawer/Inkast/lifeOs om de finns.
Uppgift: kör fyren kontextrad finish
smoke:locked-ux PASS.
```

```text
Läs docs/evaluations/2026-05-26-session-landning.md — bygg INTE drawer/Inkast/lifeOs om de finns.
Uppgift: kör kopplingar C
smoke:locked-ux PASS.
```

### Steg 3 — Inkast Pro

```text
kör inkast fas 2 — läs inkast_life_os plan + G10 backend. Fas 0–1 redan klart. Deploy vid behov. Ny chatt för fas 3+.
```

### Steg 4 — MåBra Daglig Mix

```text
kör måbra daglig mix — hela planen i faser. Ingen Kunskap-RAG, inga streaks. Uppdatera Mabra-CONTENT-BANK först via curator.
```

---

## Fyren galleri vs kod

| Variant | Bild | Kod idag |
|---------|------|----------|
| W1 Rutnät 4×2 | `fyren-widget-variants-1-4.png` #1 | **Cancelled** — Hem har Life Hub + drawer |
| W2 Peek | #2 | Delvis — Mer-panel (anteckning/inspelning) |
| W3 Favorit-rad | #3 | **Ja** — 4 hub-slots i `FyrenSmartWidgetBar` |
| W4 Kontext Planering | #4 | **Ja** — `hubContextBar` på hubs |

---

## Chattar du kan stänga

| UUID | Tema | Stäng? |
|------|------|--------|
| `79d85947` | Valv-baksida drawer | **Ja** |
| `e641cde2` | Helhetsindex meny | **Ja** |
| `9636ac16` | Widget WH1 | **Ja** |
| `97db30d3` | Inkast (fas 0–1) | **Ja** — fas 2 = ny chatt |
| `0b3b6c72` | MåBra curator | **Ja** — Daglig Mix = ny chatt |
| `14d11746` | Landning + masterplan | **Ja** efter merge-beslut |

---

## Chatt-referenser (arkiv)

| UUID | Tema |
|------|------|
| `79d85947` | Valv-baksida drawer |
| `e641cde2` | Helhetsindex meny |
| `97db30d3` | Inkast Life OS |
| `0b3b6c72` | MåBra curator + header/Fyren planer |
| `9636ac16` | Widget WH1 |
| `14d11746` | Session landning + öppna planer master |
