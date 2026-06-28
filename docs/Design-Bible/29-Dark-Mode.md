# Kapitel 29 — Mörkt läge & Tema

> **Status:** Kanon · Design Authority Decision (DAD) v1.0 APPROVED  
> **Beslut:** **Executive Midnight är appens enda produktionstema.** Det *är* mörkt läge.  
> **Källor:** `design-calm.mdc` · `premium-ui.mdc` · `themeRegistry.ts` · `chameleon-ui-modularity.mdc`

---

## 1. Syfte

Detta kapitel fastslår att Livskompassen **inte** har ett separat "light/dark toggle" som produktbeslut. Executive Midnight **är** den officiella mörka identiteten. Variation sker via **theme packs** (I-stone-familjen) i kontrollerad form — inte via ett ljust tema.

---

## 2. Executive Midnight = Dark Mode

### 2.1 Visuell identitet (DAD)

| Element | Beskrivning |
|---------|-------------|
| Bakgrund | Mörk marinblå / svart sten (`--bg`, `--bg-dusk`) |
| Accenter | Varm guld (`--accent`, `--accent-light`) |
| Material | Glas, djup, lager, subtila reflektioner |
| Känsla | Trygghet, lugn, exklusivitet — **inte** neon/gaming/SaaS |

### 2.2 Teknisk implementering

| Fil | Roll |
|-----|------|
| `src/styles/executive-chrome.css` | Header, dock, kompass-chrome |
| `src/styles/obsidian-calm-2.css` | Bas-tokens (legacy filnamn — tema är Executive Midnight) |
| `docs/design/references/` | Referensbilder |
| `docs/design/galleri/KOMPASS-LOCKED-kanon.png` | Låst kompass |

**Color scheme meta:** Appen ska deklarera mörk bas (`color-scheme: dark`) — ingen system-light override som bländar användaren.

---

## 3. Inget ljust tema

### 3.1 Produktbeslut

AI och utvecklare får **inte** utan uttryckligt beslut (PMIR + Pontus OK):

- Introducera ett globalt **light theme**
- Lägga till användar-toggle "Ljust/Mörkt" i produktion
- Byta Executive Midnight till Material 3 light / standard SaaS-vit

### 3.2 Varför

- **Neuroanpassning:** Mörk, dämpad yta minskar visuell överbelastning (ADHD/GAD).
- **DAD:** Designen är låst som "exklusiv personlig kompass" — inte generisk produktivitetsapp.
- **Kontrastkanon:** Guld-på-marin är optimerat för premiumkänsla; light skulle kräva full redesign, inte en CSS-toggle.

### 3.3 Undantag — Skymningsläge

`DimModeToggle` ("Skymningsläge") är **inte** light mode — det är en **dämpning** inom mörk palett (lägre luminans/intensitet). Behåll inom Executive Midnight-familjen.

---

## 4. Theme packs — I-stone-varianter

**Kanon:** `src/modules/core/theme/themeRegistry.ts` · Theme Lab `/dev/theme-lab`

Theme packs byter **CSS-variabler** och bakgrundstextur — inte app-logik. Produktion använder godkänd pack; experiment stannar i Theme Lab.

### 4.1 I-stone-familjen (urval)

| ID | Label | Karaktär |
|----|-------|----------|
| `I-stone` | Architect Stone | Svart sten, guld klocka — **referens** |
| `I-alchemical` | Alchemical Gold | Marmor, glödande guld |
| `I-skymning` | Nordic Skymning | Aurora glass, modul-scoped mint |
| `I-skymning-darkest` | Nordic Skymning (Darkest) | Minimal belastning, djupsvart |
| `I-stone-draft-twilight` | (draft) | Theme Lab-utkast |

Plus produktionspack: `THEME_PACK_MIDNIGHT_EXECUTIVE`, `THEME_PACK_OBSIDIAN_DEPTH`, `THEME_PACK_E_PROD`, m.fl. — se full registry.

### 4.2 Regler för packs

- Nya pack **endast** via `themeRegistry.ts` + `THEME-PACK-TEMPLATE.ts`.
- Preview i Theme Lab — **inte** nya prod-routes per pack.
- `useDesignPack()` / `useDesignPackCenterTitle()` — chrome läser aktiv pack.
- **Silo-glow:** Undvik färgade glow-linjer per silo — Executive Midnight enhetlighet (`design-calm.mdc`).

### 4.3 I-stone vs Executive Midnight

- **Executive Midnight** = designauthority (DAD) — helhetsbeslut om header, dock, kompass, home.
- **I-stone** = konkret theme pack-ID i registry — "Architect Stone" som teknisk implementation av sten+guld.

Begreppen överlappar medvetet; DAD är auktoritet, I-stone är default pack-referens.

---

## 5. Theme Lab & Design Freeport

### 5.1 Theme Lab (`/dev/theme-lab`)

Workflow:

1. Prototyp ny pack eller justera tokens.
2. Jämför mot `I-stone` preview-bilder (`/design/themes/I-architect-vault/`).
3. Extrahera godkända tokens → `src/styles/` eller ny registry-post.
4. Smoke: `npm run smoke:locked-ux` (obsidian-depth, theme pack, mockup, kanonbilder).

### 5.2 Design Freeport (sandbox)

- **Fri styling:** `src/modules/sandbox/**`, `/dev/design-freeport*`, `design-freeport.css`.
- Gäller **inte** DAD-regler — men får **inte** smitta in i prod utan extrahering till tokens.
- Smoke: `npm run smoke:design-freeport`.

---

## 6. Bakgrundstexturer

Theme packs kan sätta `background`:

- `texture-stone`, `texture-marble`, `aurora`, m.fl.
- Texturer är **dekorativa lager** — ska inte påverka läsbarhet/kontrast (se kapitel 28).

---

## 7. Förbjudna temaförändringar (DAD)

Utan uttryckligt godkännande får AI **inte**:

| Förbjudet | Varför |
|-----------|--------|
| Byta Executive Midnight-temat | DAD CRITICAL |
| Ersätta glasestetiken | Signaturmaterial |
| Ersätta gulddetaljer | Varumärkesaccent |
| Neon / gaming / cyberpunk | Bryter mot lugn & premium |
| Material 3-standardutseende | Generic SaaS — nej |
| Light mode i prod | Se §3 |

---

## 8. Implementationschecklista

- [ ] Alla färger via CSS-variabler (`var(--surface)`, `text-accent`) — inte hex i `features/`
- [ ] `useDesignPack()` för chrome som ska följa aktiv pack
- [ ] Inga hårdkodade `bg-white` i nya komponenter (legacy städas vid touch)
- [ ] `color-scheme: dark` bevarad
- [ ] Theme-experiment endast i Theme Lab / sandbox

---

## 9. Pekare

| Resurs | Sökväg |
|--------|--------|
| DAD kanon | `.cursor/rules/design-calm.mdc` |
| Theme registry | `src/modules/core/theme/themeRegistry.ts` |
| useDesignPack | `src/modules/core/design/useDesignPack.ts` |
| Theme Lab | `src/modules/core/pages/ThemeLabPage.tsx` |
| Color policy | `docs/design/COLOR-POLICY.md` |
| Tillgänglighet kontrast | `28-Accessibility.md` |
| Kodstandard tokens | `31-Code-Standards.md` |

---

*SLUT KAPITEL 29*
