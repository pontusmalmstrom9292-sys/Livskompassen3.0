# FP-TI-S14 — Executive primitives (komponentkatalog)

| Fält | Värde |
|------|-------|
| **Tag** | `FP-TI-S14` |
| **Datum** | 2026-06-18 |
| **Scope** | Sandbox endast — prefix `design-freeport__exec-*` |
| **Kanonbild** | [`docs/design/references/FP-TI-REF-executive-5screen-canonical.png`](../../../design/references/FP-TI-REF-executive-5screen-canonical.png) |
| **CSS-fil** | `src/styles/design-freeport.css` |

---

## Primitiver (15 st)

### 1. `design-freeport__exec-card`

| Prop | Värde |
|------|-------|
| Padding | `1.125rem` (18 px) |
| Radius | `14px` |
| Border | `2px solid rgba(212,175,55,0.28)` |
| Background | `linear-gradient(165deg, #1e1e1e, #121212)` |
| Shadow | elevation-2 + bevel (S12 §3) |

**Användning:** översikt, ankare, reflektionsfoto-wrapper.

---

### 2. `design-freeport__exec-list-row`

| Prop | Värde |
|------|-------|
| Min-height | `52px` |
| Gap | `14px` |
| Padding | `12px 16px` |
| Chevron | `>` `16px` `#d4af37` auto-left |

**Användning:** RESURSER, Inställningar, konton.

---

### 3. `design-freeport__exec-btn-gold`

| Prop | Värde |
|------|-------|
| Min-height | `52px` |
| Gradient | `#e8c84a → #d4af37 → #9a7b2f` |
| Text | `#000`, `0.8125rem`, 600, uppercase |
| Shadow | `0 4px 0 #7a5c2f` |

**Användning:** «+ Ny anteckning», primära CTAs.

---

### 4. `design-freeport__exec-btn-danger`

| Prop | Värde |
|------|-------|
| Min-height | `52px` |
| Gradient | `#7f1d1d → #000000` |
| Text | `#ffffff`, `0.875rem` |

**Användning:** Logga ut (S7).

---

### 5. `design-freeport__exec-screen-title`

| Prop | Värde |
|------|-------|
| Font | Cinzel 600 |
| Size | `1.75rem` (28 px) |
| Spacing | `0.22em` |
| Color | `#d4af37` |
| Transform | uppercase |

**Användning:** HEM, EKONOMI, RESURSER, DAGBOK, INSTÄLLNINGAR.

---

### 6. `design-freeport__exec-section-label`

| Prop | Värde |
|------|-------|
| Font | Inter 600 |
| Size | `0.625rem` (10 px) |
| Spacing | `0.2em` |
| Color | `#78716c` |
| Transform | uppercase |

**Användning:** «KONTON», «SENASTE TRANSAKTIONER», grupp-rubriker.

---

### 7. `design-freeport__exec-bottom-nav`

| Prop | Värde |
|------|-------|
| Height | `72px` |
| Position | fixed bottom |
| Background | gradient + `blur(12px)` |
| Max-width | `390px` |

**Barn:** `__exec-bottom-nav-item`, `__exec-bottom-nav-fab`.

---

### 8. `design-freeport__exec-bottom-nav-fab`

| Prop | Värde |
|------|-------|
| Size | `56×56px` |
| Offset | `margin-top: -24px` |
| Mark | D1 `1.75rem` `#000` |

---

### 9. `design-freeport__exec-nav-icon`

| Prop | Värde |
|------|-------|
| Size | `20×20px` |
| Stroke | `1.5px` |
| Color | `#78716c` (inaktiv) / `#d4af37` (aktiv) |

---

### 10. `design-freeport__exec-chart`

| Prop | Värde |
|------|-------|
| Height | `140px` |
| Line | `#d4af37` `2px` |
| Fill | `rgba(212,175,55,0.18)` fade |

---

### 11. `design-freeport__exec-amount`

| Prop | Värde |
|------|-------|
| Size | `2rem` |
| Weight | 700 |
| Color | `#f5f5f4` |

**Modifier:** `--positive` → `#10b981`; `--negative` → `#f5f5f4`.

---

### 12. `design-freeport__exec-date-pill`

| Prop | Värde |
|------|-------|
| Size | `44×44px` min |
| Radius | `999px` |
| Active bg | `#d4af37` |
| Active text | `#000000` |

---

### 13. `design-freeport__exec-search`

| Prop | Värde |
|------|-------|
| Height | `48px` |
| Radius | `14px` |
| Placeholder | `0.875rem` `#78716c` |
| Inset glow | `inset 0 0 8px rgba(212,175,55,0.06)` |

---

### 14. `design-freeport__exec-resource-overlay`

| Prop | Värde |
|------|-------|
| Position | fixed inset `0` |
| Background | `#000000` |
| z-index | `40` |
| Padding bottom | `96px` (nav + search) |

---

### 15. `design-freeport__exec-surface--active`

| Prop | Värde |
|------|-------|
| Border | `rgba(212,175,55,0.48)` |
| Glow | `0 0 0 2px rgba(212,175,55,0.32)` + inner (S12 §7) |

**Användning:** vald nav, aktiv datum, vald tile.

---

## Kompositionsmatris

| Skärm | Primitiver |
|-------|------------|
| HEM | 5, 1, 2, 3, 7, 8 |
| EKONOMI | 5, 1, 10, 11, 2, 6 |
| RESURSER | 5, 14, 2, 13, 7 |
| DAGBOK | 5, 12, 1, 2, 3 |
| INSTÄLLNINGAR | 5, 6, 2, 4, 7 |

---

## Implementationsstatus

| Klass | Finns i CSS |
|-------|-------------|
| `__exec-bottom-nav` (+ fab) | **Nej** — TSX refererar, CSS saknas |
| `__executive-top` / `__screen-title` | Delvis (`design-freeport__screen-title`) |
| Övriga `__exec-*` | **Nej** — W1 leverans |

**Smoke:** utöka `smoke_design_freeport.mjs` med `design-freeport__exec-card` efter W1.
