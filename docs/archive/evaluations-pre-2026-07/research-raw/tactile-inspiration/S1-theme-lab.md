# S1 — Theme Lab (FP-TI-S1)

**Modell:** specialist-theme-lab  
**Status:** ✅ Klar (sandbox)  
**Datum:** 2026-06-18  
**Scope:** `/dev/design-freeport*` + `src/styles/design-freeport.css` — prod Obsidian Calm orörd

---

## Sammanfattning

Tactile Mid-Depth Theme Lab levererad i Design Freeport-sandboxen. Fem jämförbara riktningar (A–E) via `data-fp-theme` på `.design-freeport`. **Riktning D (Skiffer sammet)** är primär referens som `tactile-slate`.

| Tema | ID | Accent | Särdrag |
|------|-----|--------|---------|
| A Varm koppar | `tactile-warm` | `#b36b3e` | Hover: `translateY(-1px)` only på zon/supermod |
| B Neutral krom | `tactile-chrome` | `#7d8a99` | Baslinje, silveraccent |
| C Kall glas | `tactile-cold` | `#4a90e2` | `blur(20px)` på header + hub-card |
| **D Skiffer sammet** | **`tactile-slate`** | **`#8b7d9e`** | **Outfit rubriker, inset 0.04, glass `.78`, radius 10/14px** |
| E Obsidian lager | `tactile-obsidian` | `#c9a227` | Cinzel zon, Inter delegates, bottom accent-glow |

---

## Delade `--fp-*` tokens (`.design-freeport`)

```css
--fp-elevation-0: none;
--fp-elevation-1: 0 4px 16px rgba(0,0,0,.28);
--fp-elevation-2: 0 8px 32px rgba(0,0,0,.45);
--fp-inset-top: inset 0 1px 0 rgba(255,255,255,.05);
--fp-inset-pressed: inset 0 2px 4px rgba(0,0,0,.35);
--fp-border-width: 1px;
--fp-border-bevel: 1px solid var(--fp-border);
--fp-hover-lift: -1px;
--fp-press-depth: 0;
--fp-transition: 350ms ease;
--fp-morph-ms: 350ms;
--fp-blur: 16px;
--fp-blur-strong: 20px;
--fp-font-display / --fp-font-body;
--fp-tracking-label / --fp-tracking-title;
--fp-radius-sm: 8px; --fp-radius: 12px; --fp-radius-lg: 16px;
--fp-glow-zone: 0 4px 20px -2px var(--fp-accent-glow);
```

Per-tema overrides (t.ex. D: radius 10/14, inset 0.04, Outfit display).

---

## Riktning D — Skiffer sammet (`tactile-slate`)

| Krav | Implementation |
|------|----------------|
| Accent `#8b7d9e` | `--fp-accent` |
| Inset + soft shadow | `--fp-inset-top: inset 0 1px 0 rgba(255,255,255,.04)` + `--fp-shadow: elevation-2 + inset-top` |
| Glass | `rgba(17,27,45,.78)` |
| Outfit display, Inter body | `--fp-font-display: Outfit, Inter…` |
| Radius 10/14px | `--fp-radius: 10px`, `--fp-radius-lg: 14px` |

---

## Chameleon-regler (§3)

| Element | Regel |
|---------|-------|
| Shell | `linear-gradient(165deg, surface-2 → surface)` + `--fp-shadow` |
| Viewport | `--fp-inset-top` + `--fp-surface` bakgrund |
| Aktiv mode-btn | `border accent-dim` + `box-shadow: 0 0 0 1px accent-glow` |
| Hover | **Antingen** `border-strong` **eller** `translateY(-1px)` — aldrig båda + scale |
| Warm (A) | Endast `translateY(-1px)` på zon/supermod |
| Morph | 350ms, opacity max 0.35, ingen layout-animation |
| `prefers-reduced-motion` | morph 0ms, border-only transitions |
| `focus-visible` | 2px solid `accent-dim` |

---

## Filer

| Fil | Roll |
|-----|------|
| `src/styles/design-freeport.css` | Tokens + teman A–E + chameleon/phone |
| `src/modules/sandbox/freeportThemes.ts` | Switcher + localStorage |
| `src/modules/sandbox/components/FreeportChromeShell.tsx` | `data-fp-theme` på root |
| `src/modules/sandbox/DesignFreeportPage.tsx` | Huvudsida `/dev/design-freeport` |

---

## Verifiering

| Check | Resultat |
|-------|----------|
| `npm run smoke:design-freeport` | PASS |
| `npm run build` | PASS |
| Prod MainLayout | Orörd — route utanför MainLayout |
| Android backdrop-filter | UNVERIFIED (FP-TI-S1-005) |

---

## Backlog-koppling

| ID | Status |
|----|--------|
| FP-TI-S1-001 | SANDBOX — tactile-slate |
| FP-TI-S1-002 | SANDBOX — delade elevation/inset/blur |
| FP-TI-S1-003 | SANDBOX — chameleon glow + reduced-motion |
| FP-TI-S1-004 | SANDBOX — tactile-obsidian jämförelse |
| FP-TI-S1-005 | IDÉ — Android backdrop prestanda |

---

## Nästa steg (Pontus)

5 min sandbox-test: öppna `http://localhost:5173/dev/design-freeport`, byt chip A→E, testa Chameleon-fliken + Hem v3. Välj favoritriktning innan eventuell prod-promote.
