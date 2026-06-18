# FP-TI-S12 — Material: guld-djup & bevel (CSS)

| Fält | Värde |
|------|-------|
| **Tag** | `FP-TI-S12` |
| **Datum** | 2026-06-18 |
| **Scope** | Sandbox endast — klasser under `.design-freeport[data-fp-theme='tactile-obsidian']` |
| **Kanonbild** | [`docs/design/references/FP-TI-REF-executive-5screen-canonical.png`](../../../design/references/FP-TI-REF-executive-5screen-canonical.png) |
| **Mål** | Skeuomorf djup utan spel-UI (inga neonkanter, inga XP-barer, inga bounce-animationer) |

---

## 1. Designprinciper (mätbara gränser)

| Regel | Gräns |
|-------|-------|
| Max samtidiga skugglager per yta | 3 (drop + inset + guld-botten) |
| Border-radius intervall | `8px`–`16px` — aldrig `>20px` på kort |
| Animation | `350ms ease` max; `0ms` vid `prefers-reduced-motion` |
| Blur på kort | `0` — fyllda metalliska ytor, inte glassmorphism |
| Blur på nav | `12px` (`backdrop-filter`) |
| Kontrast guld mot `#000` | ≥ 4.5:1 för text ≥ `0.75rem` |

---

## 2. Token-block (infoga i `tactile-obsidian`)

```css
.design-freeport[data-fp-theme='tactile-obsidian'] {
  --fp-gold-highlight: #f9e498;
  --fp-gold-mid: #d4af37;
  --fp-gold-shadow: #9a7b2f;
  --fp-gold-deep: #7a5c2f;
  --fp-gold-fill: linear-gradient(165deg, #252525 0%, #1e1e1e 35%, #121212 100%);
  --fp-gold-rim: linear-gradient(180deg, rgba(249,228,152,0.55) 0%, rgba(212,175,55,0.28) 40%, rgba(122,92,47,0.35) 100%);
  --fp-bevel-top: inset 0 1px 0 rgba(249, 228, 152, 0.35);
  --fp-bevel-bottom: 0 3px 0 rgba(122, 92, 47, 0.65);
  --fp-inner-glow: inset 0 0 12px rgba(212, 175, 55, 0.08);
  --fp-outer-glow: 0 0 0 2px rgba(212, 175, 55, 0.32);
}
```

---

## 3. Kort — fylld panel (standard)

```css
.design-freeport__exec-card {
  padding: 1.125rem;
  border-radius: 14px;
  border: 2px solid rgba(212, 175, 55, 0.28);
  background: var(--fp-gold-fill);
  box-shadow: 0 12px 40px rgba(0,0,0,0.52), var(--fp-bevel-top), var(--fp-bevel-bottom);
}
```

| Egenskap | Värde |
|----------|-------|
| Min-höjd listkort | `72px` |
| Hover | `border-color: rgba(212,175,55,0.55)`; `transform: translateY(-2px)` |
| Active/pressed | `box-shadow: inset 0 3px 8px rgba(0,0,0,0.42), var(--fp-inner-glow)`; `transform: translateY(0)` |

---

## 4. Listrad — horisontell bevel

```css
.design-freeport__exec-list-row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-height: 3.25rem;
  padding: 0.75rem 1rem;
  border-radius: 14px;
  border: 2px solid rgba(212, 175, 55, 0.28);
  background: linear-gradient(165deg, #1e1e1e 0%, #121212 100%);
  box-shadow: 0 6px 20px rgba(0,0,0,0.38), inset 0 1px 0 rgba(249,228,152,0.12);
}
```

---

## 5. Guld gradient-knapp (primär)

```css
.design-freeport__exec-btn-gold {
  min-height: 3.25rem;
  padding: 0 1.25rem;
  border-radius: 14px;
  border: 2px solid rgba(249, 228, 152, 0.45);
  background: linear-gradient(180deg, #e8c84a 0%, #d4af37 45%, #9a7b2f 100%);
  color: #000000;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  box-shadow: 0 4px 0 #7a5c2f, 0 8px 24px rgba(212,175,55,0.28);
}
```

---

## 6. FAB — central kompass

```css
.design-freeport__exec-bottom-nav-fab {
  width: 3.5rem;
  height: 3.5rem;
  margin-top: -1.5rem;
  border-radius: 999px;
  border: 2px solid rgba(249, 228, 152, 0.55);
  background: linear-gradient(165deg, #e8c84a 0%, #d4af37 50%, #9a7b2f 100%);
  box-shadow: 0 8px 24px rgba(212,175,55,0.32), 0 4px 0 #7a5c2f, inset 0 2px 0 rgba(255,255,255,0.25);
}
```

Mark (D1): `width: 1.75rem; height: 1.75rem; color: #000000`.

---

## 7. Inner glow — aktiv/fokus

```css
.design-freeport__exec-surface--active {
  border-color: rgba(212, 175, 55, 0.48);
  box-shadow: var(--fp-elevation-1), inset 0 1px 0 rgba(255,255,255,0.07), inset 0 0 12px rgba(212,175,55,0.12), 0 0 0 2px rgba(212,175,55,0.32);
}
```

---

## 8. Diagram-yta (EKONOMI)

| Egenskap | Värde |
|----------|-------|
| Höjd | `140px` (`8.75rem`) |
| Bakgrund | `linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)` |
| Linje | `stroke: #d4af37; stroke-width: 2px` |
| Area fill | `rgba(212, 175, 55, 0.18)` → `transparent` |

---

## 9. Logout — röd gradient

```css
.design-freeport__exec-btn-danger {
  min-height: 3.25rem;
  border-radius: 14px;
  border: 2px solid rgba(127, 29, 29, 0.65);
  background: linear-gradient(180deg, #7f1d1d 0%, #000000 100%);
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 6px 20px rgba(127, 29, 29, 0.35);
}
```

---

## 10. Förbjudet (spel-UI-filter)

| Förbjudet | Ersättning |
|-----------|------------|
| Neon `#00ff00` glow | `--fp-accent-glow` guld |
| `border-radius: 24px+` | max `16px` |
| `animation: pulse` / bounce | endast `opacity` / `translateY(±2px)` |
| Glass `backdrop-filter` på kort | solid gradient fill |
| Streak/XP-progressbar | kapacitetsband utan siffra (S6) |

---

## 11. Implementationsstatus

| Klass | Status |
|-------|--------|
| `--fp-card-fill` tactile-obsidian | Finns i `design-freeport.css` |
| `.design-freeport__exec-card` | **Saknas** |
| `.design-freeport__exec-btn-danger` | **Saknas** |
| FAB bevel | Delvis via `.design-freeport__bottom-nav-fab` |
