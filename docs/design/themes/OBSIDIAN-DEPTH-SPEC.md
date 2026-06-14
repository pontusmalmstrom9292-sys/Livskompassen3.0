# Obsidian Depth — låst designspec

**Status:** **LÅST** 2026-06-14  
**ID:** `OD-obsidian-depth`  
**Evolution av:** Obsidian Calm 2.0  
**Mockup:** `/dev/obsidian-depth`  
**Register:** [`.context/locked-obsidian-depth.md`](../../.context/locked-obsidian-depth.md)

---

## Beslut

Pontus godkände den **fylligare 3D-versionen** som kanonisk referens för:

- Glassmorphism på bento-kort
- Taktil 3D (inre highlights, mjuka skuggor, grafit→obsidian-gradient)
- Guldaccenter **endast** (`#d4af37`)
- Mobil-first bento-layout (header, 4 kort, flytande dock, primär CTA)

**Fortsatt arbete (ej låst här):** knappar, sidomeny, Fyren-widget och övrig chrome förfinas separat — utan att ersätta eller förenkla Obsidian Depth-skalet.

**Ej prod-default ännu.** Välj i Theme Lab → **Använd i appen** för helapp-preview.

---

## Filer (MUST NOT ta bort utan produkt-OK)

| Fil | Roll |
|-----|------|
| `src/styles/obsidian-depth-mockup.css` | Låsta 3D-klasser + `data-theme` bridge |
| `src/modules/core/pages/ObsidianDepthMockupPage.tsx` | Interaktiv referensmockup |
| `src/modules/core/theme/themePackObsidianDepth.ts` | Theme Pack tokens |
| `docs/design/theme-lab/obsidian-depth-*.png` | Kanonbilder |

---

## Tokens

| Token | Värde |
|-------|-------|
| Obsidian bas | `#020617` |
| Grafit | `#0a1019` |
| Surface | `#050b14` / `#09111e` / `#111b2d` |
| Guld accent | `#d4af37` |
| Guld dim | `#9a7b2f` |
| Guld glow | `rgba(212, 175, 55, 0.28)` |
| Glas | `rgba(9, 17, 30, 0.55)` + `backdrop-blur(20px)` |

---

## Komponenter (låst yta)

| Klass | Beskrivning |
|-------|-------------|
| `.od-depth__bento-card` | Frosted bento, 3D hover/press |
| `.od-depth__cta` | Metallisk guld-CTA med fysisk tryck |
| `.od-depth__dock` / `__dock-inner` | Flytande botten-nav |
| `.od-depth__header` | Cinzel-hälsning + mark |

När `html[data-theme='OD-obsidian-depth']`: `.calm-card` / `.glass-card` får samma djup-behandling via bridge i CSS.

---

## Smoke

```bash
npm run smoke:obsidian-depth
```

Ingår i `npm run smoke:locked-ux`.

---

## Godkännande

| Datum | Beslut |
|-------|--------|
| 2026-06-14 | **LÅST** — spara fylligare 3D; fortsätt förfiningsarbete på knappar/menyer separat |
