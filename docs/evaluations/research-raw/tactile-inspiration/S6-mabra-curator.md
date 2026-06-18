# FP-TI-S6 — Reflektionskort utan gamification (DAGBOK-skärm)

| Fält | Värde |
|------|-------|
| **Tag** | `FP-TI-S6` |
| **Datum** | 2026-06-18 |
| **Scope** | Sandbox endast |
| **Specialist** | `specialist-mabra-curator` |
| **Kanonbild** | [`docs/design/references/FP-TI-REF-executive-5screen-canonical.png`](../../../design/references/FP-TI-REF-executive-5screen-canonical.png) (skärm 4) |
| **Innehållskanon** | U6 — `content_class: REFLECTION`, ingen FACT utan bank |

---

## 1. DAGBOK-skärm — visuell spec

### 1.1 Datumväljare

| Egenskap | Värde |
|----------|-------|
| Radhöjd | `64px` |
| Dag-cell bredd | `44px` min |
| Aktiv cell | bakgrund `#d4af37`, text `#000000`, `border-radius: 999px` |
| Inaktiv | `#a8a29e`, `0.75rem` |
| Aktiv exempel | «20 Sön» (ref) |
| Horisontell scroll | `gap: 8px`, padding `0 16px` |

### 1.2 Dagens reflektion (foto-kort)

| Egenskap | Värde |
|----------|-------|
| Höjd | `200px` |
| Border-radius | `14px` |
| Bild | `object-fit: cover` |
| Overlay | `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%)` |
| Text | `0.9375rem` `#ffffff`, `line-height: 1.55`, max `3` rader |
| Mock-text | «Solnedgång över havet. Tacksam för dagen och för barnens skratt.» |

### 1.3 Historiklista

| Egenskap | Värde |
|----------|-------|
| Rader | 4 st |
| Radhöjd | `44px` |
| Ikon | `20×20px` (bok / lås / dokument) |
| Datum | `0.75rem` `#78716c` höger |

### 1.4 CTA

| Egenskap | Värde |
|----------|-------|
| Text | «+ Ny anteckning» |
| Höjd | `52px` |
| Klass | `.design-freeport__exec-btn-gold` outline-variant |
| Border | `2px #d4af37`, bakgrund `transparent` |

---

## 2. MåBra-reflektion (utan gamification)

### 2.1 Förbjudet i FP-TI

| Element | Anledning |
|---------|-----------|
| Streak-räknare | Mabra-SPEC / U6 |
| XP / nivå | «DONE IS BETTER» — kognitiv last |
| Badge / achievement | Spel-UI (S12 §10) |
| Count-up animation | design-calm förbud |
| Leaderboard | — |

### 2.2 Tillåtet — reflektionskort

| Korttyp | `content_class` | Visuell spec |
|---------|-----------------|--------------|
| Humör check-in | REFLECTION | 5 ikoner `40×40px`, ingen poäng |
| Frågekort (Vit) | REFLECTION | `bankId` obligatorisk i prod |
| Andningsövning | REFLECTION | timer `3:00`, ingen «streak» |
| Kapacitetsband | — | text-only, `0.625rem` etikett |

### 2.3 Kapacitetsband (sandbox)

```css
.design-freeport__capacity-band {
  padding: 0.75rem 0.875rem;
  border-radius: 14px;
  border: 2px solid rgba(212, 175, 55, 0.28);
  background: linear-gradient(165deg, #1e1e1e, #121212);
}
```

| Band | Copy (mock) |
|------|-------------|
| Låg | «Ett steg i taget. Andas ut.» |
| Medel | «Välj ett läge som passar din energi.» |
| Hög | «Frågekort och reflektion tillgängliga.» |

**Ingen siffra** i bandet — endast text.

---

## 3. Frågekort-layout (FP-TI)

| Egenskap | Värde |
|----------|-------|
| Kortbredd | 100% - `32px` margin |
| Fråga | `0.9375rem` `#f5f5f4` |
| Hint | `0.75rem` `#78716c` |
| Svar | textarea `min-height: 80px` |
| Knappar | «Spara» guld / «Hoppa över» ghost `2px` border |

---

## 4. Speglar — Zero Footprint

| Egenskap | Värde |
|----------|-------|
| Ribbon | `.design-freeport__ephemeral-ribbon` |
| Färg | `#a5b4fc` text, **endast** speglar-läge |
| Persistens | `0` — rensas vid blur |

---

## 5. Sandbox-koppling

| Fil | Roll |
|-----|------|
| `FreeportMabraHub.tsx` | Layout picker + capacity band |
| `FreeportHjartatHub.tsx` | Dagbok delegate |
| `DagbokReflektionDelegate` | Chameleon live |

---

## 6. Acceptans

1. Inga streak/XP DOM-noder i FP-TI panel.
2. Foto-kort `200px` ± `4px`.
3. Aktiv datum-cirkel `44×44px`, `#d4af37`.
4. Frågekort har `bankId` i prod-wire (ej sandbox mock).
5. `npm run smoke:innehall` PASS vid prod-ändring.
