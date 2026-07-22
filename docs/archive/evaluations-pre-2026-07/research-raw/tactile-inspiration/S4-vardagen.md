# FP-TI-S4 — EKONOMI-skärm (Vardagen-zon)

| Fält | Värde |
|------|-------|
| **Tag** | `FP-TI-S4` |
| **Datum** | 2026-06-18 |
| **Scope** | Sandbox endast — mockdata, ingen Firestore i FP-TI-lab |
| **Specialist** | `specialist-vardagen-builder` |
| **Kanonbild** | [`docs/design/references/FP-TI-REF-executive-5screen-canonical.png`](../../../design/references/FP-TI-REF-executive-5screen-canonical.png) (skärm 2) |
| **Prod-mål (efter PMIR)** | `/vardagen?tab=ekonomi` |

---

## 1. Skärmstruktur (top → bottom)

| # | Sektion | Klass (föreslagen) | Höjd (min) |
|---|---------|-------------------|------------|
| 1 | Header | `.design-freeport__executive-top` | `44px` |
| 2 | Översikt + diagram | `.design-freeport__exec-card` + `.design-freeport__exec-chart` | `220px` |
| 3 | Konton | `.design-freeport__exec-section` | `3×52px` + header `32px` |
| 4 | Transaktioner | `.design-freeport__exec-list` | `4×48px` + header `32px` |
| 5 | Bottom nav | `.design-freeport__exec-bottom-nav` | `72px` |

Sidomarginal: `16px`. Sektions-gap: `16px`.

---

## 2. Header

| Egenskap | Värde |
|----------|-------|
| Titel | «EKONOMI», Cinzel `1.75rem`, `#d4af37`, `letter-spacing: 0.22em` |
| Ikon höger | Diagram `20×20px`, stroke `#d4af37`, `2px` |
| Padding bottom | `8px` |

---

## 3. Översikt-kort

### 3.1 Saldo

| Egenskap | Värde |
|----------|-------|
| Etikett | «TOTALT SALDO», `0.625rem`, `#78716c`, `letter-spacing: 0.2em` |
| Belopp | `2rem` (32 px), `#f5f5f4`, font-weight `700` |
| Mock-värde (ref) | `124 560 kr` |
| Valutatecken | suffix `kr`, mellanslag tusental |

### 3.2 Linjediagram

| Egenskap | Värde |
|----------|-------|
| ViewBox | `0 0 320 140` |
| Yta höjd | `140px` |
| Linje | `#d4af37`, `stroke-width: 2` |
| Area gradient | stop0 `rgba(212,175,55,0.22)` @ 0%, stop1 `rgba(212,175,55,0)` @ 100% |
| Bakgrund | `linear-gradient(180deg, #1a1a1a, #0a0a0a)` |
| X-axel | Apr, Maj, Jun, Jul, **Aug**, Sep — `10px` font |
| Aktiv månad | `#d4af37`; övriga `#78716c` |
| Aktiv månad offset | Aug = månad 5 av 6 |

### 3.3 Kort-chrome

```css
.design-freeport__exec-economy-overview {
  padding: 1.125rem;
  border-radius: 14px;
  border: 2px solid rgba(212, 175, 55, 0.28);
  background: linear-gradient(165deg, #1e1e1e 0%, #121212 100%);
  box-shadow: 0 12px 40px rgba(0,0,0,0.52), inset 0 1px 0 rgba(249,228,152,0.12), 0 3px 0 rgba(122,92,47,0.65);
}
```

---

## 4. Konton-lista

| Rad | Ikon | Namn | Saldo (mock) |
|-----|------|------|--------------|
| 1 | bank `32×32` | Företagskonto | `89 200 kr` |
| 2 | wallet | Privatkonto | `24 360 kr` |
| 3 | piggy | Sparkonto | `11 000 kr` |

| Egenskap | Värde |
|----------|-------|
| Radhöjd | `52px` |
| Ikon-cirkel | `32×32px`, border `2px rgba(212,175,55,0.28)` |
| Namn | `0.9375rem` `#f5f5f4` 600 |
| Saldo höger | `0.875rem` `#d4af37` |
| Footer-länk | «Visa alla >», `0.6875rem`, `#d4af37`, högerjusterad |
| Footer margin-top | `12px` |

---

## 5. Senaste transaktioner

| Rad | Avatar | Titel | Meta | Belopp |
|-----|--------|-------|------|--------|
| 1 | ICA röd | ICA Supermarket | `Idag 14:32` | `-342 kr` `#f5f5f4` |
| 2 | Netflix | Netflix | `Igår` | `-149 kr` |
| 3 | Lön | Lön | `28 aug` | `+24 500 kr` `#10b981` |
| 4 | Spotify | Spotify | `27 aug` | `-119 kr` |

| Egenskap | Värde |
|----------|-------|
| Radhöjd | `48px` |
| Avatar | `36×36px`, `border-radius: 8px` |
| Titel | `0.875rem` 600 |
| Meta | `0.75rem` `#78716c` |
| Belopp | `0.875rem` 600, höger |
| Positiv färg | `#10b981` |
| Negativ färg | `#f5f5f4` (ej röd — ref visar neutral) |

---

## 6. Evolution / kapacitet (prod-koppling, ej i ref)

| Kapacitet | UI-beteende |
|-----------|-------------|
| Nivå 1 (låg) | Endast saldo + 1 transaktion |
| Nivå 2 | Saldo + diagram + 3 konton |
| Nivå 3 | Full vy enligt ref |

Sandbox: checkbox «låg kapacitet» trimmar till Nivå 1.

---

## 7. Sandbox-implementering

| Fil | Status |
|-----|--------|
| `FreeportEkonomiLab.tsx` | **Planerad** — ej i repo än |
| Mock JSON | `sandbox/fixtures/fp-ti-economy.json` (planerad) |
| Tema | `data-fp-theme="tactile-obsidian"` obligatorisk |

---

## 8. Acceptanskriterier

1. Saldo `124 560 kr` renderas med `2rem` vit text.
2. Diagramhöjd exakt `140px` ± `2px`.
3. Minst 3 konton-rader `52px` höjd.
4. Positiv transaktion i `#10b981`.
5. Ingen Firestore-read i sandbox-panel.
6. Visuell diff mot kanon skärm 2 ≤ 2 % (S15).
