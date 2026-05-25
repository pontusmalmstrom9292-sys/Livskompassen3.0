# Design Master — Obsidian Calm (Riktning A)

**Status:** Låst 2026-05-21  
**Canonical källa för:** all UI i Livskompassen v2  
**Kod:** [`src/modules/core/ui/tokens.ts`](../../src/modules/core/ui/tokens.ts), [`src/index.css`](../../src/index.css), [`tailwind.config.js`](../../tailwind.config.js)

---

## 1. Filosofi

- **Obsidian Calm / Nordic Dusk (mörk):** djup obsidian-bas, glass-ytor, sparsamma accenter
- **Progressive disclosure:** ett fält, ett val, ett steg
- **Neuroinkluderande:** låg arousal, hög läsbarhet, deterministisk feedback
- Blueprint v1.1 (lugn, enkelhet, inga grafer) gäller som **UX** — inte ljus off-white-palett

---

## 2. Färgpalett

| Token | Hex / värde | Användning |
|-------|-------------|------------|
| `bg` | `#020617` | Sidbakgrund |
| `surface` | `#0f172a` | Kort, paneler |
| `surface2` | `#1e293b` | Hover, aktiv nav |
| `surface3` | `#334155` | Subtil elevation |
| `text` | `#F1F5F9` | Primär text |
| `textMuted` | `#94A3B8` | Sekundär text |
| `textDim` | `#64748B` | Hints, labels |
| `accent` | `#FDE68A` | Tactical Amber — rubriker, aktiv pill, primär accent |
| `accentSecondary` | `#818CF8` | Electric Indigo — Fortsätt, sekundära actions |
| `success` | `#2DD4BF` | Cyber Emerald — spara, klar, bekräftelse |
| `warning` | `#A16207` | Varning |
| `danger` | `#DC2626` | Fara, fel |
| `glass` | `rgba(15, 23, 42, 0.6)` | Frosted card |
| `glassHero` | `rgba(15, 23, 42, 0.72)` | Hero / wizard wrapper |
| `border` | `rgba(255,255,255,0.06)` | Standard kant |
| `borderStrong` | `rgba(255,255,255,0.10)` | Glass card kant |
| `accentGlow` | `rgba(253, 230, 138, 0.15)` | Aktiv nav, subtil glow |

### Accent-hierarki

1. **Guld** — valt state, rubriker, "du är här"
2. **Indigo** — nästa steg, Fortsätt-knappar
3. **Emerald** — spara, klar, WORM-bekräftelse

---

## 3. Typografi

| Roll | Font | Vikt |
|------|------|------|
| Rubriker | **Outfit** | 400–600 (light till medium) |
| Brödtext | **Inter** | 400–500 |
| Siffror | Inter + `tabular-nums` | — |

Ingen count-up på siffror — direkt textuppdatering.

**Runtime storlekar:** [`docs/design/TYPE-SCALE.md`](../design/TYPE-SCALE.md) · `HubPageShell` · `typeScale.ts`.

---

## 4. Komponentmönster

### Glass card

```
rounded-2xl border border-white/10 bg-[#0f172a]/60 backdrop-blur-xl
```

### Pill / chip (humör, filter)

- Idle: `border-white/10 text-slate-400`
- Active: `border-[#FDE68A]/50 bg-[#FDE68A]/10 text-[#FDE68A]`

### Knappar

| Variant | Stil |
|---------|------|
| Fortsätt | `border-[#818CF8]/40 text-[#818CF8]` |
| Spara / Klar | `border-[#2DD4BF]/40 text-[#2DD4BF]` |
| Primär guld | `border-[#FDE68A]/40 text-[#FDE68A]` |
| Ghost | `border-white/10 text-slate-400` |

### Stegindikator

4 steg: Humör → Text → Bekräfta → Klar  
- Aktiv: guld border/bg  
- Komplett: emerald check  
- Framtida: muted

### BentoCard

Använd [`BentoCard`](../../src/modules/core/ui/BentoCard.tsx) — titel + ikon + glass-yta.

---

## 5. Bakgrund

- Obsidian gradient `#020617` → `#0f172a`
- Subtila blur-blobs: guld + indigo (låg opacitet), bakom innehåll
- Brus-textur tillåten (låg opacitet)
- **SubSynapticBackground:** WebGL/Canvas när inkopplad — inte på knappar

---

## 6. Förbjudet

Se [`design-brief.md`](design-brief.md). Nature themes, regnbåge, ljusa bakgrunder, count-up.

---

## 7. Modul-accents (sekundärt)

| Modul | Extra accent |
|-------|----------------|
| Speglar | Indigo `#6366F1` för AI-synapser |
| Barnen | Lavendel `#818CF8` + guld `#FDE68A` |
| Dagbok | Guld/indigo/emerald enligt hierarki ovan |

Moduler följer alltid bas-paletten; modul-accent är tillägg, inte ny palett.

---

## 8. Alternativ (ej valda)

| Riktning | Status |
|----------|--------|
| B — Copper Dark Glass | Arkiverad referens i [`DESIGN.md`](../../DESIGN.md) |
| C — Nordic Dusk Dark | Ej vald |

---

## 9. Referens för externa AI

All modul-spec ska säga: *"Visuell design enligt docs/specs/design-master.md (Obsidian Calm, riktning A)."*

---

## 10. Modulrecept

Delade primitiver: [`src/modules/core/ui/`](../../src/modules/core/ui/index.ts)

| Komponent | Användning |
|-----------|------------|
| `BentoCard` | Alla moduler — glass-yta |
| `StepIndicator` | Wizard (dagbok, valv sköld, dossier) |
| `PinGate` | Valv, Barnen |
| `TimelineEntry` | Dagbok, Valv, Barnen, Dossier preview |
| `TabBar` | Kunskap, Ekonomi |
| `MetricTile` / `SaldoHero` | Ekonomi (inga grafer) |
| `StatusBadge` | WORM, locked, risk, AI |
| `AlertBanner` | Varning, export, info |
| `EmptyState` | Tomma listor |

Knapp-alias: se `BUTTON_VARIANTS` i [`tokens.ts`](../../src/modules/core/ui/tokens.ts).

### Ekonomi (`/ekonomi`)

- `SaldoHero` + `MetricTile` + `TimelineEntry` för transaktioner
- `tabular-nums` på alla belopp
- Emerald vid sparad transaktion; **inga diagram**

### Dossier-Generator (planerad)

- `StepIndicator` (välj källor → preview → export)
- `TimelineEntry` + `StatusBadge` (worm) + `AlertBanner` (integritet)
- Export-knapp: `btn-pill--success`

### Verklighetsvalvet (utökning)

- Inmatningstyp: `chip--active` grid
- Trestegs-sköld: `StepIndicator` + `input-glass`
- Magkänsel: chip-grid (planerat `BodySignalChip`)
- Emerald = WORM sparad

### Kunskap / Minne

- `TabBar` + `Tidshjulet` (guld/indigo noder)
- AI-svar: `glass-card--ai`

### Speglar

- `accent-ai` endast i denna modul
- Fortsätt: `btn-pill--secondary`

### Notiser (planerad)

- Diskret `AlertBanner` info — max 2–3/dag
