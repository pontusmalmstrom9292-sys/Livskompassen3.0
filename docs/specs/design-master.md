# Design Master — Obsidian Calm + Riktning B (hub/kluster)

**Status:** Låst bas 2026-05-21 · **Riktning B** hub/kluster 2026-05-23 ([`ADR-design-riktning-B-varmare-mork.md`](../decisions/ADR-design-riktning-B-varmare-mork.md))  
**Canonical källa för:** all UI i Livskompassen v2  
**Kod:** [`src/modules/core/ui/tokens.ts`](../../src/modules/core/ui/tokens.ts) (`DESIGN`, `CLUSTER_TILE`), [`src/index.css`](../../src/index.css), [`tailwind.config.js`](../../tailwind.config.js)

---

## 1. Filosofi

- **Obsidian Calm / Nordic Dusk (mörk):** djup obsidian-bas (`#020617` → `#0f172a`), sparsamma accenter
- **Riktning B (hub/kluster):** varmtonade kort per kluster (`CLUSTER_TILE`), tydliga ikonplattor, subtil hörnglow — referens `nav-01-horizon-dashboard` (ej 5-ikon dock)
- **Riktning A (övriga glass-ytor):** `glass-card`, modulpaneler utanför hub — slate glass tills vidare
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
| `glassWarm` | `rgba(18, 16, 28, 0.78)` | Modulhub-panel (B) |

### Kluster-tiles (Riktning B)

| Tone | Surface | Border / glow | Ikon |
|------|---------|---------------|------|
| `gold` | `#14120e` | amber `rgba(245,158,11,0.22)` | `#fde68a` |
| `indigo` | `#0d101a` | indigo `rgba(99,102,241,0.22)` | `#a5b4fc` |
| `lavender` | `#110d14` | violet `rgba(167,139,250,0.2)` | `#c4b5fd` |
| `emerald` | `#0d1311` | emerald `rgba(16,185,129,0.22)` | `#5eead4` |

Kod: `CLUSTER_TILE` i `tokens.ts`; CSS `--tile-*` i `index.css`. Komponenter: `ClusterGrid`, `ModuleHubPanel`, `CompassHubOrb`.

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
| Barnen / Familjen | Lavendel `#818CF8` + guld `#FDE68A` |
| Dagbok / Hjärtat | Guld/indigo/emerald enligt hierarki ovan |

**Ikoner (Lucide, `appNavigation.ts`):** Hjärtat `BookOpen`, Hamn `Anchor`, Familjen `Users`, Vardagen `Compass` (hub-tile `Sprout`), Måbra `Sparkles`. Ingen separat Shield i dock — Fyren på Hjärtat.

Moduler följer alltid bas-paletten; modul-accent är tillägg, inte ny palett.

---

## 8. Riktningar

| Riktning | Status |
|----------|--------|
| A — Slate glass (global kort) | **Bas** — `glass-card`, moduler utanför hub |
| B — Varm mörk hub/kluster | **Aktiv** 2026-05-23 — ADR + tokens ovan |
| C — Nordic Dusk Dark (ljus variant) | Ej vald |

---

## 9. Referens för externa AI

All modul-spec ska säga: *"Visuell design enligt docs/specs/design-master.md (Obsidian Calm; hub/kluster enligt Riktning B)."*

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
