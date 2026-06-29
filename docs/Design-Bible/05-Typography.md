# Chapter 05 — Typography

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [04-Color-System.md](./04-Color-System.md)  
> **Next chapter:** [06-Spacing-System.md](./06-Spacing-System.md)

---

## Purpose

Typography establishes **hierarchy, identity, and readability** on dark glass surfaces. Livskompassen uses a three-role font stack — display, heading, body — tuned for long reading sessions, executive chrome labels, and low cognitive load. This chapter binds font choices to tokens so no module invents its own scale.

---

## Philosophy

### Type is calm authority, not marketing shout

The user reads journals, evidence summaries, and short actionable labels under fatigue. Type must:

- **Feel premium** — Cinzel and Outfit carry crafted, intentional character
- **Stay readable** — Inter body at comfortable sizes and line heights
- **Separate roles clearly** — display ≠ heading ≠ body; never three competing bold styles on one card
- **Support scanning** — uppercase executive labels with generous letter-spacing for wayfinding

### Three voices, one system

| Voice | Font | When |
|-------|------|------|
| **Display / identity** | Cinzel | App title, home greeting, vault chrome |
| **Heading / structure** | Outfit | h1–h6, section titles, hub names |
| **Body / workhorse** | Inter | Paragraphs, lists, form inputs, metadata |

`midnight-gold-tokens.json` and Tailwind `fontFamily` confirm: display = Cinzel, heading = Outfit, body = Inter.

### Not Material Type Scale

No Roboto, no Material headline/body/label roles, no all-caps button font by default. Executive labels are uppercase **by role**, not globally.

---

## Visual Rules

### Font stack (canonical)

From `src/design-system/tokens/css/variables.css` and `tailwind.config.js`:

| Token | Stack | Tailwind |
|-------|-------|----------|
| `--ds-font-chrome` | `'Cinzel', 'Outfit', serif` | `font-display-serif` |
| `--ds-font-display` | `'Cormorant Garamond', Georgia, serif` (fallback) / theme override | `font-display` |
| `--ds-font-body` | `'Inter', system-ui, sans-serif` | `font-sans` |
| Base headings | `'Outfit', sans-serif` | default h1–h6 in `index.css` |
| Body default | `'Inter', sans-serif` | `body` in `index.css` |

**Executive Midnight home chrome** uses Cinzel for identity (`font-display-serif`, `.home-greeting__title`).

### Size scale (`--ds-font-size-*`)

| Token | Size | Typical role |
|-------|------|--------------|
| `--ds-font-size-2xs` | `0.625rem` (10px) | Eyebrow, micro labels |
| `--ds-font-size-xs` | `0.75rem` (12px) | Chips, timestamps, dock labels |
| `--ds-font-size-sm` | `0.875rem` (14px) | Body default, list items |
| `--ds-font-size-md` | `1rem` (16px) | Emphasized body, input text |
| `--ds-font-size-lg` | `1.125rem` (18px) | Subheadings |
| `--ds-font-size-xl` | `1.25rem` (20px) | Hub title (`textStyles.titleHub`) |
| `--ds-font-size-2xl` | `1.5rem` (24px) | Section heroes |
| `--ds-font-size-3xl` | `1.875rem` (30px) | Display moments (rare) |

Tailwind preset: `text-hub-title` = `1.25rem`, weight 300, line-height 1.35.

### Line height

| Token | Value | Use |
|-------|-------|-----|
| `--ds-line-height-tight` | 1.2 | Display single lines |
| `--ds-line-height-snug` | 1.35 | Hub titles |
| `--ds-line-height-normal` | 1.5 | Body paragraphs |
| `--ds-line-height-relaxed` | 1.625 | Long journal prose |

### Letter-spacing (executive labels)

Design-system tokens in `variables.css`:

| Token | Value | Use |
|-------|-------|-----|
| `--ds-letter-spacing-tight` | `0.02em` | Display titles (calm home greeting) |
| `--ds-letter-spacing-normal` | `0.08em` | Subtle label emphasis |
| `--ds-letter-spacing-wide` | `0.16em` | Section labels, toolbar caps |
| `--ds-letter-spacing-wider` | `0.22em` | Chrome titles, executive section labels |
| `--ds-letter-spacing-widest` | `0.24em` | Eyebrows (`textStyles.eyebrow`, Tailwind `text-eyebrow`) |

**Executive Midnight locked ranges** (from `executive-chrome.css`):

- App identity / home header h1: **`0.22em`**
- Hero section labels / `.home-layout-a__section-label`: **`0.18em`**
- Calm home labels: **`0.14em`**
- Dagbok tyst läge chrome: **`0.22em`**

Rule: executive uppercase labels stay within **0.18em–0.22em** unless using `widest` (0.24em) for micro eyebrows only.

### Weight

| Token | Value | Use |
|-------|-------|-----|
| `--ds-font-weight-regular` | 400 | Body |
| `--ds-font-weight-medium` | 500 | Emphasis, buttons |
| `--ds-font-weight-semibold` | 600 | Section titles |
| `--ds-font-weight-bold` | 700 | Rare strong callouts |

Hub titles often use **light (300)** for premium feel — see `text-hub-title`.

### Color pairing (with Ch. 04)

| Role | Color token |
|------|-------------|
| Display / chrome title | `--accent` or `--text` |
| Section label | `--text-dim` or `--accent` at 18% tracking |
| Body | `--text` |
| Secondary | `--text-muted` |
| De-emphasized / eyebrow | `--text-dim` |

---

## Sizing

### Minimum readable sizes (mobile G85)

| Context | Min size | Notes |
|---------|----------|-------|
| Body copy | 14px (`sm`) | Never 12px for paragraphs |
| Metadata | 12px (`xs`) | OK for timestamps |
| Eyebrow | 10px (`2xs`) | Uppercase + widest tracking only |
| Dock label | 12px | Under icon, one line |
| Input text | 16px preferred | Prevents iOS zoom-on-focus |

### Maximum display size on phone

Home display (Cinzel greeting): cap at `--ds-font-size-2xl` on viewports ≤520px to avoid orphan words.

---

## Spacing

Typography spacing = margin + line box + tracking:

- Section label → title: `--ds-space-2` (8px)
- Title → body: `--ds-space-3` (12px)
- Paragraph gap: `--ds-space-4` (16px)
- Hub header title → toolbar: `--ds-space-5` (20px)

Uppercase labels need **extra horizontal breathing room** — add `padding-inline: 0.05em` when tracking ≥0.18em to avoid clipped serifs on Cinzel.

---

## States

| State | Typography behavior |
|-------|---------------------|
| Default | Colors per role table |
| Hover (link) | `color: var(--accent)`; no size change |
| Active / pressed | Optional `font-weight-medium`; no scale |
| Focus | Visible ring on control — text unchanged |
| Disabled | `--text-dim`, `opacity: 0.6` |
| Loading skeleton | Fixed line-height preserved — no layout shift |
| Error inline | `--danger` at body size — not smaller |

---

## Examples

### Executive home header

```html
<h1 class="font-display-serif tracking-[0.22em] uppercase text-accent">
  Livskompassen
</h1>
```

### Hero section label

```html
<span class="home-layout-a__section-label text-[0.625rem] uppercase tracking-[0.18em] text-text-dim">
  Dagens Reflektion
</span>
```

### Hub title (design-system preset)

```tsx
<h2 className={textStyles.titleHub}>Hjärtat</h2>
```

### Body paragraph

```html
<p class="text-sm leading-relaxed text-text">Journal entry body…</p>
```

### Eyebrow (zone context)

```html
<span class="text-eyebrow text-text-dim">VARDAGEN · MÅBRA</span>
```

---

## Accessibility

- **Minimum 4.5:1** contrast for body (`--text` on `--surface-2`).
- **Large text** (≥18px regular or ≥14px bold): 3:1 minimum for `--text-muted`.
- Do not convey state by font alone — pair with icon or `aria-live`.
- Screen readers: avoid `letter-spacing` on critical content that breaks pronunciation — executive labels are decorative wayfinding; keep `aria-label` plain language on controls.
- Support **200% text zoom** without clipping — use relative `rem` sizes only.
- `-webkit-font-smoothing: antialiased` on body (set in `index.css`).

---

## Animations

Typography animates rarely:

| Effect | Allowed | Token |
|--------|---------|-------|
| Opacity fade on morph | Yes | `--ds-duration-morph` (350ms) |
| Color transition on hover | Yes | 150ms |
| Font-size bounce | **No** | — |
| Letter-spacing animate | **No** | — |
| Blur-in headline | Hero only | `--ds-duration-slow` |

Chameleon mode morph may cross-fade delegates — text size stays constant across modes.

---

## Code Examples

### Tailwind + DS tokens

```tsx
<p className="font-sans text-[length:var(--ds-font-size-sm)] leading-[var(--ds-line-height-normal)] text-text">
  Body copy
</p>
```

### textStyles import

```tsx
import { textStyles } from '@/design-system/tokens/typography';

<span className={textStyles.eyebrow}>KUNSKAP</span>
<h2 className={textStyles.titleHub}>Valvet</h2>
<span className={textStyles.label}>SEKTION</span>
```

### Executive label (CSS)

```css
.exec-section-label {
  font-family: var(--ds-font-chrome);
  font-size: var(--ds-font-size-2xs);
  font-weight: var(--ds-font-weight-medium);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-dim);
}
```

### Global heading base (already in index.css)

```css
h1, h2, h3, h4, h5, h6 {
  font-family: 'Outfit', sans-serif;
}
```

---

## Do

- Use Cinzel (`font-display-serif`) for identity and executive chrome
- Use Outfit for structural headings (h1–h6)
- Use Inter for body, forms, and metadata
- Apply 0.18–0.22em tracking on executive uppercase labels
- Use `textStyles` presets and `--ds-font-size-*` tokens
- Keep hub titles light weight (300) where specified

## Don't

- Mix Arial, system-ui-only stacks, or Roboto in production modules
- Use Cinzel for long body paragraphs
- Apply 0.22em tracking to sentence-case body text
- Hardcode `font-size: 13px` or arbitrary pixel values
- Use more than two font families on one card
- Shrink body below 14px to fit layout — truncate or disclose instead

---

## Future Improvements

1. **Font loading strategy** — subset Cinzel/Outfit weights; `font-display: swap` audit
2. **Unified display token** — align Cormorant fallback vs Cinzel chrome in one `--ds-font-display` story
3. **Responsive type ramp** — fluid `clamp()` for home greeting only
4. **i18n line-height** — Swedish compound words may need `line-height-relaxed` on narrow tiles
5. **Figma text styles** — sync `midnight-gold-tokens.json` with full size/tracking scale
6. **Tabular nums utility** — expand `.tabular-nums` usage in Ekonomi module

---

*End of Chapter 05*
