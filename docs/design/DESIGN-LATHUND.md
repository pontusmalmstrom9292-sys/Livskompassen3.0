# Design-lathund — teman, bilder, flik-idéer (1 sida · utskrift)

**Version:** 2026-05-24 · **Gren:** `main`

---

## 1. Två lager — bild vs kod

| Lager | Vad | Var |
|-------|-----|-----|
| **Kör i appen** | Theme Pack I (skins, CSS) | `src/modules/core/theme/themeRegistry.ts` |
| **Välj tema lokalt** | Förhandsvisa alla skins | http://localhost:5173/dev/themes |
| **Bilder & idéer** | Mockups, flik-skärmar, lab-teman | `docs/design/` (denna lathund) |

**Regel:** Ändra **prod**-tema i kod (`themeRegistry`) — lab-teman A–O är referensbilder tills du aktivt flyttar in dem.

---

## 2. Öppna i webbläsaren (dubbelklicka HTML)

| Galleri | Fil |
|---------|-----|
| **Alla teman A–O** | `docs/design/themes/index.html` |
| **Widget, planering, skärmar** | `docs/design/galleri/index.html` |
| **Bildspel / idéer** | `docs/design/slideshow/index.html` |
| **Barnporten-infografik** | `docs/design/barnporten/infographic.html` |
| **Kompakt tema per modul** | `docs/design/compact/index.html` |
| **Ikoner v3 (50)** | `docs/design/icons-proposals/2026-05-26-v3-chassis/preview.html` · `npm run icons:proposals-v3` |
| **Ikoner — låst B1/D1/M2** | `docs/design/ICON-STYLE-GUIDE.md` · Android: `npm run android:icons` |
| **Ikoner — välj resten** | `docs/design/icons-proposals/2026-05-26-remaining/preview.html` |

---

## 3. Tema I — produktion (Architect Vault)

| Vad | Mapp |
|-----|------|
| **Spec** | `docs/design/themes/I-architect-vault/THEME-I-SPEC.md` |
| **Pack-format (5 skins)** | `docs/design/themes/I-architect-vault/THEME-PACK-FORMAT.md` |
| **PNG (design)** | `docs/design/themes/I-architect-vault/*.png` |
| **PNG (app preview)** | `public/design/themes/I-architect-vault/` |

**Skins i kod:** stone · alchemical gold · nordic skymning · trygg hamn (+ fler i `themeRegistry.ts`)

---

## 4. Lab-teman (referens — sparade sedan innan)

| Tema | Mapp | Typisk användning |
|------|------|------------------|
| E | `themes/E-aurora-obsidian-compass/` | Äldre prod-referens, guld kompass |
| F | `themes/F-guld-pansar/` | Valv / WORM-känsla |
| G | `themes/G-varm-hamn/` | Hamn |
| H | `themes/H-grafit-greyrock/` | Grey Rock |
| J–O | `themes/J-brutalist-sten/` … `O-ultra-grey-calm/` | Experiment |

**Jämförelsetabell:** `docs/design/themes/THEME-COMPARISON.md`

**Namngivning PNG per modul (i varje temamapp):**

| Fil | Modul / idé |
|-----|-------------|
| `00-hero-livskompass.png` | Hem |
| `01-kompis.png` | Kunskap / Kompis |
| `02-trygg-hamn-hub.png` | Hamn |
| `03-barnfokus.png` | Familjen / Barnfokus |
| `04-biff-triage.png` | BIFF |
| `05-pansaret-valv.png` | Valv |
| `06-kbt-transformator.png` | MåBra / KBT |
| `widget-bar*.png` | Fyren / widget |

---

## 5. Modul- & flik-idéer (galleri)

| Område | Mapp / fil |
|--------|------------|
| **Index 18+ bilder** | `docs/design/galleri/` |
| **Sidomeny (LÅST)** | `references/MENU-DRAWER-KANON.png` + `.md` |
| **Hem kompass (LÅST)** | `galleri/KOMPASS-LOCKED-kanon.png` |
| **Familjen-skärm** | `galleri/skarmar/familjen.png` |
| **Valv** | `galleri/skarmar/valv-pansaret.png` |
| **Hamn** | `galleri/skarmar/hamn-biff.png` |
| **Planering P1–P4** | `galleri/planering/` |
| **Planering varianter** | `galleri/planering-variants/` |
| **Widget W1–W4** | `galleri/widget/` · **v2:** `galleri/widget/v2/` |
| **Barnporten** | `galleri/barnporten/` |
| **Planering+Projekt (beslut)** | `PLANERING-PROJEKT-HYBRID.md` |

**Hela design-index:** `docs/design/README.md`

---

## 6. Specs (text — inte bara bilder)

| Modul | Spec |
|-------|------|
| Planering | `PLANERINGSSIDA-SPEC.md`, `planering/PLANERING-P3-KANBAN-SPEC.md` |
| Widget / Fyren | `WIDGET-BAR-SPEC.md`, `HOMESCREEN-WIDGETS-SPEC.md` |
| Familjen / Barnfokus | `FAMILJEN-BARNFOKUS-FRAGOR-SPEC.md`, `FAMILJEN-HUB-SPEC.md` |
| Barnporten | `BARNPORTEN-SPEC.md` |
| Färger | `COLOR-POLICY.md` (ingen turkos text) |
| Typografi | `TYPE-SCALE.md` · `typeScale.ts` |
| Chrome / sidfötter | `CHROME-POLICY.md` · `HubPageShell.tsx` |
| Nav sanning | `navTruth.ts` |

---

## 7. Flikar i kod (Familjen-exempel)

Route: `/familjen` → `src/modules/barnens_livsloggar/`

| Fil | Flik / funktion |
|-----|-----------------|
| `FamiljenPage.tsx` | Hub |
| `familjen/FamiljenReflektionTab.tsx` | Reflektion + Barnfokus |
| `familjen/FamiljenLivsloggTab.tsx` | Livslogg |
| `familjen/FamiljenKunskapHubTab.tsx` | Kunskap |
| `BarnfokusFraganPanel.tsx` | Låst frågekort |

---

## 8. Relaterade lathundar

| Fil | Innehåll |
|-----|----------|
| `docs/KOMPASS-MINNESKARTA.md` | Git, moduler, silos |
| `docs/GIT-LATHUND.md` | Main trunk |
| `docs/MODUL-FUNKTIONS-REGISTER.md` | Route → mapp → callable |

---

*Skriv ut · `Cmd+P` · lägg bredvid `KOMPASS-MINNESKARTA.md`*
