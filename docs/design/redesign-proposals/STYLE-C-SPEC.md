# Style C — Aurora Prism

**Theme pack ID:** `R-C-aurora-prism`  
**Panel style:** `aurora` (header + dock)  
**Status:** Proposal — Theme Lab only until `GODKÄND:` in `VARIANTS.md`  
**Datum:** 2026-06-07  
**Input:** `docs/evaluations/2026-06-07-design-redesign-master-audit.md`, AGENT-01–05

---

## 1. Design intent

Aurora Prism is a **futuristic glass** direction for Livskompassen v2. It trades Obsidian Calm’s warm gold dominance for **norrsken energy**: teal aurora bands, violet AI halos, deep void backgrounds, and frosted panels that feel like instruments in a dark observatory.

| Dimension | Aurora Prism |
|-----------|--------------|
| **Mood** | Futuristisk, låg arousal trots glöd — klinisk, inte neon-arcade |
| **Metaphor** | Norrsken genom glastak; prismatiskt ljus på mörk rymd |
| **User fit** | ADHD-safe genom hög kontrast hierarki + mono för data; inga blinkande animationer |
| **Break from prod** | Teal/violet **may** accent chrome i hub-innehåll; drawer/dock aktiv rad **fortfarande guld** (functional lock) |

---

## 2. Color system

### 2.1 Core palette

| Token | Hex / value | Role |
|-------|-------------|------|
| `--bg` | `#020617` | Deep void — app shell base |
| `--bg-dusk` | `#050b14` | Gradient terminus, hero fade |
| `--surface` | `#050b14` | Flat panels |
| `--surface-2` | `#09111e` | Cards, drawer rows |
| `--surface-3` | `#111b2d` | Hover, active chips |
| `--accent` | `#2dd4bf` | Primary CTA, aurora teal |
| `--accent-secondary` | `#818cf8` | AI/Kompis, secondary actions |
| `--accent-light` | `#99f6e4` | Icon highlights, metric up-tick |
| `--accent-ai` | `#818cf8` | Kompis bubbles, Orkester nodes |
| `--accent-glow` | `rgba(45, 212, 191, 0.22)` | Teal bloom |
| `--accent-violet-glow` | `rgba(129, 140, 248, 0.18)` | Violet bloom |
| `--success` | `#10b981` | Confirm, WORM saved |
| `--warning` | `#f59e0b` | Pending, draft |
| `--danger` | `#ef4444` | Delete, panic-adjacent |
| `--text` | `#f8fafc` | Primary copy |
| `--text-muted` | `#94a3b8` | Labels, captions |
| `--text-dim` | `#64748b` | Placeholder, disabled |
| `--border` | `rgba(45, 212, 191, 0.14)` | Default hairline |
| `--border-strong` | `rgba(129, 140, 248, 0.28)` | Focus, hero rim |
| `--glass` | `rgba(5, 11, 20, 0.55)` | Standard frosted panel |
| `--glass-hero` | `rgba(5, 11, 20, 0.72)` | Hero / PIN gate |
| `--compass-disk` | `#0d2838` | Dock center disk |

### 2.2 Aurora gradient strokes (decorative only)

```css
--aurora-stroke: linear-gradient(
  135deg,
  rgba(45, 212, 191, 0.55) 0%,
  rgba(129, 140, 248, 0.45) 45%,
  rgba(45, 212, 191, 0.35) 100%
);
--aurora-fill: radial-gradient(
  ellipse 120% 80% at 50% -20%,
  rgba(45, 212, 191, 0.12) 0%,
  rgba(129, 140, 248, 0.08) 40%,
  transparent 70%
);
--aurora-ambient: conic-gradient(
  from 210deg at 70% 10%,
  rgba(45, 212, 191, 0.06),
  rgba(129, 140, 248, 0.08),
  rgba(45, 212, 191, 0.04),
  transparent
);
```

### 2.3 Silo bottom-glow (Style C mapping)

| Silo | Glow class | Style C bottom edge |
|------|------------|---------------------|
| Vardagen / ekonomi / planering | `glow-bottom-gold` → **`glow-bottom-teal`** | `border-b-2 border-teal-400/60` + teal shadow |
| Familjen / Valv / Dagbok | `glow-bottom-blue` → **`glow-bottom-violet`** | `border-b-2 border-indigo-400/60` + violet shadow |
| MåBra / energi | `glow-bottom-green` → **`glow-bottom-mint`** | `border-b-2 border-emerald-400/50` + mint shadow |

**Rule:** Glow sits **only on bottom edge** of cards — never full rainbow border.

### 2.4 Functional lock — navigation gold

Per `COLOR-POLICY.md` and `locked-ux-features.md`:

- **Drawer active row:** `#d4af37` (gold) — not teal
- **Dock active zone label:** gold underline
- **TabBar selected tab:** gold text + gold bottom bar

Hub **content** may use teal/violet; **chrome navigation** stays gold until explicit policy revision.

---

## 3. Typography

| Role | Font | Classes | Usage |
|------|------|---------|-------|
| **Display / zone headers** | Cinzel (`font-display-serif`) | `text-xs`–`text-sm`, `uppercase`, `tracking-[0.22em]`, `text-accent-light` | HJÄRTAT, VALV, VARDAGEN eyebrows |
| **Body / UI** | Inter (`font-sans`) | `text-sm`/`text-base`, `text-text`, `leading-relaxed` | Paragraphs, drawer labels |
| **Data / metrics / timestamps** | JetBrains Mono (`font-mono`) | `text-[11px]`–`text-xs`, `tabular-nums`, `text-text-muted` | Kanban counts, ekonomi, Orkester node IDs, vault timestamps |
| **Kompis chat** | Inter body + mono for code blocks | User bubbles: `--surface-3`; Kompis: `--accent-ai/15` border |

**Forbidden:** Bold hub headlines, count-up animations, ALL CAPS body copy.

---

## 4. Glass morphism system

### 4.1 Base card — `prism-card`

Replaces `calm-card` / `glass-card` in Style C scope:

```css
.prism-card {
  position: relative;
  overflow: hidden;
  border-radius: 1rem; /* rounded-2xl */
  border: 0.5px solid var(--border);
  background: color-mix(in srgb, var(--surface-2) 65%, transparent);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
}
.prism-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  pointer-events: none;
}
.prism-card::after {
  content: '';
  position: absolute;
  inset: -40% -20% auto -20%;
  height: 60%;
  background: var(--aurora-fill);
  pointer-events: none;
  opacity: 0.6;
}
```

### 4.2 Hero glass — `prism-hero`

- Stronger blur (`blur(28px)`), `--glass-hero` fill
- Top aurora rim: 1px `--aurora-stroke` on top edge only
- Used: Hem hero, Valv PIN gate backdrop, Kompis welcome

### 4.3 Input glass — `input-prism`

- `--surface-3/80` fill, `border-[0.5px] border-border`
- Focus: `border-strong` + `box-shadow: 0 0 0 1px rgba(129,140,248,0.25)`
- Placeholder: `--text-dim`

### 4.4 Modal / sheet

- Scrim: `rgba(2, 6, 23, 0.85)` + `backdrop-blur-sm`
- Sheet: `prism-card` + bottom safe-area padding
- PIN numeric pad: mono digits, teal key press flash (150ms, no bounce)

---

## 5. Ambient background

| Layer | Spec |
|-------|------|
| Base | `linear-gradient(180deg, #020617 0%, #050b14 100%)` |
| Aurora blob 1 | Teal ellipse top-right, `blur(80px)`, opacity 0.15 |
| Aurora blob 2 | Violet ellipse mid-left, `blur(100px)`, opacity 0.12 |
| Grain | Optional 2% noise overlay — static, no animation |
| Scenic photo | **Off by default** in Style C; enable via `--design-bg-image` in lab |

`data-theme-bg="aurora"` activates blob layers in `AmbientBackground.tsx`.

---

## 6. Component bible (18 primitives)

All three redesign styles **must** define these. Style C treatments below.

### 6.1 Button primary — `.btn-pill--accent`

- Fill: `linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)`
- Text: `#020617` (dark on teal for WCAG)
- Border: `0.5px rgba(255,255,255,0.15)`
- Hover: `brightness(1.08)` — no scale transform
- Use: Spara, Öppna Valv, Bekräfta inkast

### 6.2 Button secondary — `.btn-pill--secondary`

- Fill: `transparent`
- Border: `0.5px var(--border-strong)`
- Text: `--accent-secondary`
- Hover: `bg-indigo-500/10`

### 6.3 Button ghost — `.btn-pill--ghost`

- No border; text `--text-muted`
- Hover: `bg-white/5`

### 6.4 Button success — `.btn-pill--success`

- Fill: `--success` at 85% opacity
- Text: `#020617`
- Use: WORM confirm, "Sparat till logg"

### 6.5 Card default — `BentoCard` / `prism-card`

- Default silo glow per §2.3
- Padding: `p-4` mobile, `p-5` tablet
- Title: sans semibold `text-text`; never serif in card body

### 6.6 Card hero — `prism-hero`

- Min-height 140px; compass or zone illustration centered
- Eyebrow: Cinzel `tracking-[0.26em]`

### 6.7 Card row — `UiCard--row`

- Height 56px; icon left in 40px aurora-stroke circle
- Chevron right in `--text-dim`
- Divider: `border-b border-border/50`

### 6.8 TabBar — `TabBar` / `HubTabBar`

- Track: `prism-card` flattened (`rounded-xl`)
- **Selected:** gold text + 2px gold bottom (functional lock)
- Unselected: `--text-dim`
- Valv 6-tab: mono abbreviations on xs screens optional

### 6.9 DrawerRow — `NavigationDrawer`

- Row height 48px; accordion chevron mono
- Active: gold left bar 2px + `bg-accent-gold/8` where `--accent-gold: #d4af37`
- Valv section header: Cinzel "VALV" eyebrow

### 6.10 DockOrb — `FloatingDock`

- Rail: aurora panel (`data-panel-style=aurora`)
- Center: **D1 LivskompassMark** (locked) on `--compass-disk`
- Hold ring: teal progress arc 3s → Valv
- Side orbs: frosted circles, gold active dot beneath label

### 6.11 Input — `input-prism`

- Textarea min-height 120px for journal
- Search: mono placeholder "Sök bevis…"

### 6.12 Modal — `Modal.tsx`

- `prism-card` max-w-lg; close ghost top-right
- Title Cinzel small caps

### 6.13 PinGate — `PinGate` / `VaultLockedGate`

- Shield icon: teal stroke, not indigo
- Copy: WebAuthn hint (not "PIN" alone — AGENT-03)
- Primary: teal gradient button

### 6.14 EmptyState — `EmptyState.tsx`

- Line-art icon 48px aurora stroke
- Headline sans; CTA primary teal

### 6.15 MetricTile — `MetricTile`

- Value: JetBrains Mono `text-2xl text-accent-light`
- Label: uppercase muted xs
- Sparkline optional — static SVG, no animation

### 6.16 HubHeader — `HubPageShell`

- Eyebrow: Cinzel gold/teal gradient text clip (subtle)
- Title: sans `text-xl font-medium`
- Lead: `text-text-muted text-sm`

### 6.17 WidgetChip — `FyrenWidgetBar`

- W1–W4: pill chips, frosted, teal icon stroke
- Active widget: gold ring (matches dock policy)

### 6.18 Chip filter — `.reflektion-prompt-chip`

- Unselected: `--surface-3` border `--border`
- Selected: teal fill 20% + teal border
- Humör grid: emoji + mono label below

---

## 7. Icon strategy

| Family | Spec |
|--------|------|
| **D1 LivskompassMark** | Locked — gold stack unchanged |
| **M2 KompisMark** | Locked core; optional **iridescent aura** ring in Style C lab (requires `locked-icons.md` approval) |
| **Chrome icons (24)** | 1.5px stroke; gradient stroke `url(#aurora-stroke)` on active; flat `--text-muted` idle |
| **Drawer L2 (12)** | Circle 36px frosted; icon 18px centered |
| **Dock (4)** | Match header aurora panel |
| **Widget (4)** | Teal stroke; gold when recording |
| **Header (4)** | Menu, vault, account, kompis — mono-compatible grid |

Generate proposals: `npm run icons:proposals-v6 -- --style aurora-prism` (specified in blueprint).

---

## 8. Eighteen screens — full specification

Format: 390×844 CSS px, safe-area respected. Mockups: `gallery/style-c/screens.html`.

### Screen 01 — Hem / Adaptive kompass

| Field | Spec |
|-------|------|
| **Route** | `/` |
| **Header** | Aurora panel; brand lockup; Kompis shortcut violet halo |
| **Hero** | `prism-hero` — compass rose, "Dagens riktning" mono timestamp |
| **Body** | CaptureSuperModule top; 2×2 adaptive BentoCards with silo glows |
| **Dock** | Visible; widget bar W1 default |
| **Background** | Aurora blobs + void gradient |

### Screen 02 — Drawer (Vardag)

| Field | Spec |
|-------|------|
| **State** | Drawer open 68vw; Valv section **hidden** |
| **Sections** | VARDAG → Hjärtat, Vardagen, Familjen accordions |
| **Rows** | UiCard--row pattern; active = gold |
| **Backdrop** | Blur scenic/aurora 40% |

### Screen 03 — Drawer (Valv unlocked)

| Field | Spec |
|-------|------|
| **State** | `vaultOpen` — Vardag + VALV sections |
| **Valv rows** | Logga, Sök, Mönster, Orkester, Dossier, Kunskapsbank, Aktörskarta |
| **Footer** | "Lås Valvet nu" ghost button |
| **Accent** | Violet eyebrow on VALV section header only |

### Screen 04 — Dock + widget

| Field | Spec |
|-------|------|
| **Focus** | Bottom 40% of viewport — dock rail + FyrenWidgetBar expanded |
| **Dock** | 4 zones; center D1; teal hold ring visible |
| **Widgets** | W1 projekt, W2 voice, W3 inkast, W4 barn — frosted chips |
| **Panel** | `data-panel-style=aurora` on rail |

### Screen 05 — Hjärtat — Dagbok

| Field | Spec |
|-------|------|
| **Route** | `/dagbok?tab=reflektion` |
| **TabBar** | Reflektion · Speglar (Bevis hidden unless vault session) |
| **Content** | Journal textarea `input-prism`; humör chip grid |
| **CTA** | Primary teal "Spara reflektion" |
| **Glow** | Violet bottom on main card (Hjärtat silo) |

### Screen 06 — Hjärtat — Speglar

| Field | Spec |
|-------|------|
| **Route** | `/dagbok?tab=speglar` |
| **Content** | Speglings coach panel; secondary CTA indigo "Spegla tillbaka" |
| **Tone** | Low arousal; no chat bubbles — structured cards |
| **Glow** | Violet silo |

### Screen 07 — Valv — Logga

| Field | Spec |
|-------|------|
| **Route** | `/dagbok?tab=bevis&vaultTab=logga` |
| **Gate** | Passed — show log feed |
| **Rows** | Evidence cards mono timestamp; teal "Ny post" FAB |
| **Glow** | Violet |

### Screen 08 — Valv — Mönster

| Field | Spec |
|-------|------|
| **Route** | `vaultTab=monster` |
| **Content** | Pattern scan results; graph nodes mono IDs |
| **Locked** | Mönster panel must remain — `VaultMonsterPanel` |
| **Visual** | Network diagram teal/violet edges on void |

### Screen 09 — Valv — Orkester

| Field | Spec |
|-------|------|
| **Route** | `vaultTab=orkester` |
| **Content** | Agent cards grid; ADK synapse status mono |
| **Locked** | `VaultOrkesterPanel` |
| **Accent** | `--accent-ai` for agent badges |

### Screen 10 — Valv — Kunskapsbank

| Field | Spec |
|-------|------|
| **Route** | `vaultTab=kunskapsbank` |
| **Content** | RAG search; citation cards with mono `[kb:]` refs |
| **Locked** | No public `/vardagen?tab=kunskap` |
| **Glow** | Violet + teal search highlight |

### Screen 11 — Kompis hub

| Field | Spec |
|-------|------|
| **Route** | `/kompis` |
| **Gate** | WebAuthn/Fyren — copy must not say numeric PIN only |
| **Chat** | User slate bubble; Kompis violet-tinted glass bubbles |
| **Avatar** | M2 KompisMark with optional aura ring |
| **Input** | Bottom fixed `input-prism` + teal send |

### Screen 12 — Vardagen launcher

| Field | Spec |
|-------|------|
| **Route** | `/vardagen?tab=kompasser` |
| **Layout** | Module launcher grid/list — UiCard--row |
| **Modules** | Kompasser, MåBra, Handling, Arbetsliv, Ekonomi, Drogfrihet |
| **Glow** | Teal on planning/economy rows |

### Screen 13 — Planering Kanban

| Field | Spec |
|-------|------|
| **Route** | `/planering` or `/vardagen?tab=handling` |
| **Locked** | 3 columns: Att göra · Väntar · Klart |
| **Cards** | Compact prism-cards; mono due dates |
| **Glow** | Teal column headers |

### Screen 14 — MåBra hub

| Field | Spec |
|-------|------|
| **Route** | `/vardagen?tab=mabra` |
| **Content** | Frågekort stack; ACT/KBT entry rows |
| **Glow** | Mint green bottom |
| **Tone** | Calm; no gamification badges |

### Screen 15 — Familjen — Barnfokus

| Field | Spec |
|-------|------|
| **Route** | `/familjen?tab=reflektion` |
| **Locked** | `BarnfokusFraganPanel`; button "Spara till {alias}s logg" |
| **Content** | Question card; child selector chips |
| **Glow** | Violet silo |

### Screen 16 — Familjen — Trygg Hamn

| Field | Spec |
|-------|------|
| **Route** | `/familjen?tab=hamn` |
| **Content** | BIFF/Grey Rock tools; template cards |
| **Tone** | Steady; indigo secondary for "Analysera meddelande" |
| **Glow** | Violet |

### Screen 17 — Barnporten

| Field | Spec |
|-------|------|
| **Route** | `/familjen?tab=barnporten` |
| **Locked** | No dock; child shell; HITL Valv bridge |
| **Layout** | 2×2 large touch tiles — full sheets not `prompt()` |
| **Palette** | Slightly warmer void `#0a1218` but same glass language |

### Screen 18 — Capture / Inkast

| Field | Spec |
|-------|------|
| **Route** | Inkast modal / `/inkast` |
| **Content** | G10 confirm; silo picker; sourceRef preview |
| **CTA** | Teal confirm; ghost cancel |
| **Glow** | Teal hero rim |

---

## 9. Motion & accessibility

| Rule | Value |
|------|-------|
| Transitions | `150–200ms ease-out` — opacity, border-color only |
| Parallax | Forbidden |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables aurora blob drift |
| Contrast | Body text ≥ 4.5:1 on `--surface-2`; teal buttons use dark text |
| Touch targets | Min 44×44px — Barnporten 56px |
| Focus rings | Violet 1px outline offset 2px |

---

## 10. Functional locks (unchanged by Style C)

See `docs/evaluations/2026-06-07-design-redesign-master-audit.md` § Funktionella lås:

- Barnfokus copy + question pool  
- Valv tabs: Mönster, Orkester, Kunskapsbank, Aktörskarta  
- P3 Kanban three columns  
- Drawer Vardag/Valv split  
- WebAuthn gate semantics  
- Barnporten HITL → Valv  
- Inkast G10 confirm  
- 3-zone routing  
- D1/M2 locked icons  

---

## 11. Anti-patterns (Style C)

- Full rainbow borders on cards  
- Turquoise/indigo as **drawer active** state  
- Animated norrsken loops > 0.5 Hz  
- Replacing D1 with line-only compass  
- Light mode surfaces  
- Streak/XP/gamification  
- Numeric "PIN" copy on Kompis gate  

---

## 12. Deliverables cross-reference

| Artifact | Path |
|----------|------|
| This spec | `docs/design/redesign-proposals/STYLE-C-SPEC.md` |
| Implementation | `docs/design/redesign-proposals/STYLE-C-IMPLEMENTATION-BLUEPRINT.md` |
| 18 mockups | `docs/design/redesign-proposals/gallery/style-c/screens.html` |
| Master audit | `docs/evaluations/2026-06-07-design-redesign-master-audit.md` |

---

## 13. Approval gate

1. Review mockups in browser (local static or hosted preview)  
2. Theme Lab: select `R-C-aurora-prism` on `/dev/theme-lab`  
3. User comment: `GODKÄND: R-C-aurora-prism` in `docs/design/themes/VARIANTS.md`  
4. Only then: implement blueprint Phase 2 (prod CSS merge)  

Until approval: **lab-only** theme pack; prod remains ember/Obsidian Calm.
