# FP-TI-S5 — RESURSER-lista + Familjen-zon

| Fält | Värde |
|------|-------|
| **Tag** | `FP-TI-S5` |
| **Datum** | 2026-06-18 |
| **Scope** | Sandbox endast |
| **Specialist** | `specialist-familjen-hamn-builder` |
| **Kanonbild** | [`docs/design/references/FP-TI-REF-executive-5screen-canonical.png`](../../../design/references/FP-TI-REF-executive-5screen-canonical.png) (skärm 3 + Familjen-rad) |
| **Prod** | `/familjen?tab=reflektion\|hamn\|…` |

---

## 1. RESURSER — fullskärms overlay

### 1.1 Layout

| Egenskap | Värde |
|----------|-------|
| Bakgrund | `#000000` solid |
| Header höjd | `56px` |
| Titel | «RESURSER», Cinzel `1.75rem`, `#d4af37` |
| Stäng | `×` `24×24px`, `#d4af37`, höger `16px` |
| List container padding | `0 16px` |
| Rad-gap | `8px` |
| Sökfält | `48px` höjd, `14px` radius, `16px` från nav |

### 1.2 Listposter (låst ordning)

| # | Etikett | Ikon (lucide) | Prod-path |
|---|---------|---------------|-----------|
| 1 | Hem | `Home` | `/` |
| 2 | Ekonomi | `Wallet` | `/vardagen?tab=ekonomi` |
| 3 | Planering | `Calendar` | `/vardagen?tab=handling` |
| 4 | Resurser | `LayoutGrid` | (self — disabled i lista) |
| 5 | MåBra | `Heart` | `/vardagen?tab=mabra` |
| 6 | Dagbok | `BookOpen` | `/hjartat?tab=reflektion` |
| 7 | Familjen | `Users` | `/familjen?tab=reflektion` |
| 8 | Valvet | `Lock` | `/valvet?vaultTab=logga` |
| 9 | Inställningar | `Settings` | `/installningar` |

### 1.3 Rad-spec

```css
.design-freeport__exec-resource-row {
  min-height: 3.5rem; /* 56px */
  padding: 0 1rem;
  border-radius: 14px;
  border: 2px solid rgba(212, 175, 55, 0.28);
  background: linear-gradient(165deg, #1e1e1e 0%, #121212 100%);
}
```

| Del | Mått |
|-----|------|
| Ikon vänster | `24×24px`, `#d4af37` |
| Label | `0.9375rem`, `#f5f5f4`, 600 |
| Chevron | `16px`, `#d4af37`, `margin-left: auto` |

### 1.4 Sökfält

| Egenskap | Värde |
|----------|-------|
| Placeholder | «Sök i resurser» |
| Font | `0.875rem` `#78716c` |
| Ikon | `Search` `18×18px` vänster `12px` inset |
| Border | `2px rgba(212,175,55,0.28)` |
| Inset glow | `inset 0 0 8px rgba(212,175,55,0.06)` |

---

## 2. Familjen-zon (efter navigering)

### 2.1 FP-TI chrome på Familjen

| Element | Spec |
|---------|------|
| Skärmtitel | «FAMILJEN» (eller «BARNFOKUS» i delegate) |
| Glow-silo | Indigo **ej** i FP-TI — enbart guld `#d4af37` (sandbox-undantag) |
| Delegate | `FamiljenBarnfokusDelegate` via `FreeportFamiljenHub` |

### 2.2 Barnfokus-kort (låst UX)

| Egenskap | Värde |
|----------|-------|
| Fråga | `0.9375rem` `#f5f5f4` |
| Svar textarea | min-höjd `96px`, border `2px rgba(212,175,55,0.28)` |
| CTA | «Spara till {alias}s logg», `.design-freeport__exec-btn-gold` |
| Pool | `BARNFOKUS_QUESTIONS` — oförändrad |

### 2.3 Trygg Hamn (BIFF)

| Egenskap | Värde |
|----------|-------|
| Route | `/familjen?tab=hamn` |
| Input | SMS-klistra, `min-height: 120px` |
| Output | 3 BIFF-förslag, `0.875rem`, kort `14px` radius |
| Zero Footprint | Ingen persistent RAG i sandbox ribbon |

---

## 3. Valv-rad — deniability

| Tillstånd | Beteende |
|-----------|----------|
| `vaultSessionOpen=false` | Rad 8 **ej i DOM** |
| `vaultSessionOpen=true` | Rad 8 synlig, lås-ikon `#d4af37` |

Smoke: `npm run smoke:plausible-deniability` gäller prod; sandbox mockar gate.

---

## 4. Sandbox-filer

| Fil | Roll |
|-----|------|
| `ExecutiveResourcesOverlay.tsx` | **Planerad** — 9-raders lista |
| `FreeportFamiljenHub.tsx` | Finns — hub + delegate |
| `ExecutiveExactBottomNav.tsx` | Öppnar overlay på `resurser` |

---

## 5. Acceptans

1. 9 rader `56px` ± `2px`.
2. Valvet dold utan PIN-mock.
3. Familjen-rad navigerar till barnfokus-delegate i sandbox.
4. Sökfält `48px` höjd, `16px` ovanför nav.
5. Ingen indigo glow i FP-TI Familjen-panel.
