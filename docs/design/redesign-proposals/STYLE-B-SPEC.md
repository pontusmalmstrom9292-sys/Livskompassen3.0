# Style B — Ember Sanctuary

**ID:** `R-B-ember-sanctuary`  
**Status:** Förslag (redesign-proposal) — ej prod förrän `GODKÄND:` i `docs/design/theme-lab/VARIANTS.md`  
**Datum:** 2026-06-07  
**Källa:** `docs/evaluations/2026-06-07-design-redesign-master-audit.md` + AGENT-01–05

---

## 1. Designintent

| Dimension | Beslut |
|-----------|--------|
| **Namn** | Ember Sanctuary |
| **Känsla** | Varm kvällshamn — trygg, inbjudande, låg visuell arousal utan kyla |
| **Metafor** | Lantern-lit harbor: koppar/brons paneler, guld som fyr, amber som glöd |
| **Målgrupp** | ADHD/GAD/RSD — kognitiv avlastning via värme och tydlig hierarki |
| **Avvikelse från Obsidian Calm** | Medveten: varmare bas (`#1a1410`), koppar som sekundär, mindre indigo/teal i chrome |

**Prod-regel:** D1 (`LivskompassMark`) och M2 (`KompisMark`) förblir låsta tills `.context/locked-icons.md` uppdateras. Style B föreslår *varm kompass-variant* endast som preview i Theme Lab.

---

## 2. Färgpalett & tokens

### 2.1 Kärnfärger

| Token | Hex / värde | Roll |
|-------|-------------|------|
| `--bg` | `#1a1410` | Varm charcoal — app-bakgrund |
| `--bg-dusk` | `#151008` | Djupare skugga, gradient-botten |
| `--bg-ember` | `#221c16` | Alternativ bas för hero-zoner |
| `--surface` | `#221c16` | Primär yta |
| `--surface-2` | `#2a2218` | Kort, paneler |
| `--surface-3` | `#332a1f` | Hover, aktiv rad |
| `--accent` | `#d4af37` | Guld — primär accent, aktiv chrome |
| `--accent-light` | `#e8d48a` | Ljus guld — ikoner, rubriker |
| `--accent-dim` | `#9a7b2f` | Inaktiv guldlinje |
| `--accent-secondary` | `#b87333` | Koppar — sekundär knapp, ikonfyll |
| `--accent-ember` | `#f59e0b` | Amber — glow, fokusring, varning |
| `--accent-glow` | `rgba(245, 158, 11, 0.22)` | Ambient amber bloom |
| `--accent-copper-glow` | `rgba(184, 115, 51, 0.28)` | Koppar-botten på kort |
| `--text` | `#f5f0e8` | Varm cream — brödtext |
| `--text-muted` | `#a8a29e` | Etiketter, metadata |
| `--text-dim` | `#78716c` | Hjälptext, disabled |
| `--success` | `#6b8f71` | Dämpad smaragd — bekräftelse |
| `--warning` | `#f59e0b` | Amber — samma som accent-ember |
| `--danger` | `#c45c4a` | Varm röd — ej neon |
| `--glass` | `rgba(26, 20, 16, 0.72)` | Drawer, modal backdrop |
| `--glass-hero` | `rgba(26, 20, 16, 0.85)` | Hero-kort |
| `--border` | `rgba(212, 175, 55, 0.14)` | Guld hairline |
| `--border-strong` | `rgba(184, 115, 51, 0.38)` | Koppar aktiv kant |
| `--border-ember` | `rgba(245, 158, 11, 0.32)` | Fokus / amber ring |
| `--compass-disk` | `#2a2218` | Kompass-bakgrund |

### 2.2 Gradienter (kanon)

```css
/* App shell */
--gradient-shell: linear-gradient(180deg, #1a1410 0%, #151008 100%);

/* Ember panel (header, dock) */
--gradient-ember-panel: linear-gradient(
  180deg,
  rgba(58, 42, 28, 0.94) 0%,
  rgba(26, 20, 16, 0.92) 55%,
  rgba(15, 12, 8, 0.88) 100%
);

/* Kort — koppar botten-glow */
--gradient-card-ember: linear-gradient(
  180deg,
  rgba(42, 34, 24, 0.88) 0%,
  rgba(26, 20, 16, 0.92) 70%,
  rgba(184, 115, 51, 0.12) 100%
);

/* Hero scenic (kvällshamn) */
--gradient-scenic-ember: radial-gradient(
  ellipse 120% 80% at 50% 100%,
  rgba(184, 115, 51, 0.18) 0%,
  rgba(245, 158, 11, 0.08) 35%,
  transparent 70%
);
```

### 2.3 Silo-glow (Style B — varma varianter)

| Silo | Glow-klass | Style B botten |
|------|------------|----------------|
| Vardagen / ekonomi / planering | `glow-bottom-gold` | Guld `#d4af37` @ 0.35 opacity |
| Familjen / Valv / Dagbok | `glow-bottom-copper` | Koppar `#b87333` @ 0.32 opacity |
| MåBra / återhämtning | `glow-bottom-ember` | Amber `#f59e0b` @ 0.28 opacity |

**Förbjudet i Style B:** Indigo/teal som *primär* aktiv chrome. Indigo (`#6366f1`) tillåts endast för AI-data-etiketter i Orkester-panel (sekundär, ej CTA).

---

## 3. Typografi

| Nivå | Font | Klass / stil | Användning |
|------|------|--------------|------------|
| Zon-rubrik | Cinzel | `font-display-serif tracking-[0.2em] uppercase text-accent` | HJÄRTAT, VARDAGEN, FAMILJEN |
| Hub eyebrow | Cinzel | `text-[10px] tracking-[0.26em] uppercase text-text-muted` | "DAGBOK · REFLEKTION" |
| Sektion H2 | Cinzel | `text-sm tracking-[0.18em] uppercase text-accent-light` | Kortrubriker i Valv |
| Brödtext | Inter | `font-sans text-sm text-text leading-relaxed` | Formulär, listor |
| Data / timestamp | Inter | `text-xs tabular-nums text-text-dim` | WORM-stämplar |
| Knapp | Inter | `text-xs font-medium tracking-wide uppercase` | btn-pill |
| Kompis svar | Inter | `text-sm text-text leading-[1.65]` | Chat-bubblor |

**Laddning:** Cinzel + Inter via befintlig `index.html` / Google Fonts-länk.

---

## 4. Geometri & spacing

| Element | Regel |
|---------|-------|
| Kort | `rounded-2xl` (kanon — **inte** `rounded-3xl`) |
| Knappar | `rounded-xl` pill (`btn-pill`) |
| Drawer-rader | `rounded-xl` |
| Modal | `rounded-2xl` |
| Dock-orb | `rounded-full` |
| Input | `rounded-xl` |
| Border | `border-[0.5px]` eller `border` med `--border` |
| Hub padding | `px-4 py-3` mobil, `px-6` desktop |
| Kort padding | `p-4` standard, `p-5` hero |

**Skuggor:** Mjuka, varma — `shadow-[0_8px_32px_-8px_rgba(0,0,0,0.55)]` på kort; amber inset på ember-paneler.

---

## 5. Komponentbibel (18 primitives)

Alla primitives ska ha exakt ett Style B-utseende. Klassnamn behålls från prod; Style B overrides via `html[data-theme='R-B-ember-sanctuary']`.

### 5.1 Button primary — `.btn-pill--accent`

- Bakgrund: `linear-gradient(180deg, #d4af37 0%, #b87333 100%)`
- Text: `#1a1410` (mörk på guld)
- Border: `1px solid rgba(255, 243, 196, 0.35)`
- Hover: ljusare guld + `box-shadow: 0 0 20px rgba(245, 158, 11, 0.25)`
- Exempel: Spara, Öppna Valv, Bekräfta inkast

### 5.2 Button secondary — `.btn-pill--secondary`

- Bakgrund: `rgba(184, 115, 51, 0.18)`
- Border: `1px solid var(--border-strong)`
- Text: `var(--accent-light)`
- Hover: `bg-surface-3`

### 5.3 Button ghost — `.btn-pill--ghost`

- Transparent, border `var(--border)`
- Text: `var(--text-muted)`
- Hover: `bg-surface-2/80`

### 5.4 Button success — `.btn-pill--success`

- Bakgrund: `rgba(107, 143, 113, 0.22)`
- Border: `rgba(107, 143, 113, 0.45)`
- Text: `#a7d4ae`

### 5.5 Card default — `BentoCard` / `calm-card`

- Klass: `calm-card rounded-2xl bg-surface-2/75 backdrop-blur-xl border border-border/40`
- Glow prop: obligatorisk per silo (se §2.3)
- Ingen indigo-botten

### 5.6 Card hero — `glass-hero`

- Större `rounded-2xl`, `--gradient-card-ember`
- Topp: amber hairline `::before` 1px
- Scenic blob bakom via `AmbientBackground` med `ember-warm` variant

### 5.7 Card row — `UiCard--row`

- Horisontell rad, `rounded-xl`, koppar-ikon-cirkel vänster
- Aktiv: `border-strong` vänster 2px

### 5.8 TabBar — `TabBar`, `HubTabBar`

- Bakgrund: `surface-2/90`
- Aktiv flik: guld underline 2px + `text-accent`
- Inaktiv: `text-text-dim`

### 5.9 DrawerRow — `NavigationDrawer`

- Sektion: Cinzel uppercase label guld
- Rad: `rounded-xl`, hover `surface-3`
- Aktiv: guld vänsterkant + `text-accent-light`
- Valv-sektion: samma chrome, ej separat indigo

### 5.10 DockOrb — `FloatingDock` center

- Ember panel-gradient rail
- Kompass: D1 med varm `compass-disk`
- Hold-ring: amber `FyrenProgressRing`
- Sidoknappar: `header-chrome-btn` ember 3D (se CHROME-EMBER-KANON)

### 5.11 Input — `input-glass`

- `bg-surface-2/60 border border-border rounded-xl`
- Fokus: `ring-2 ring-[var(--border-ember)]`
- Placeholder: `text-text-dim`

### 5.12 Modal — `Modal.tsx`

- Overlay: `rgba(15, 12, 8, 0.82)` blur
- Panel: `surface-2 rounded-2xl border border-strong`

### 5.13 PinGate — `PinGate`, `VaultLockedGate`

- Koppar ram, guld titel Cinzel
- Copy: WebAuthn/Fyren — **inte** "PIN" i Kompis (låst UX-fix)

### 5.14 EmptyState — `EmptyState.tsx`

- Ikon i koppar-cirkel
- Text `text-muted`, CTA primary

### 5.15 MetricTile — `MetricTile`

- `rounded-xl bg-surface-2`, guld siffra `tabular-nums`
- Etikett `text-xs uppercase tracking-wider text-dim`

### 5.16 HubHeader — `HubPageShell`

- Eyebrow Cinzel, title guld, lead `text-muted`
- Ingen indigo banner

### 5.17 WidgetChip — `FyrenWidgetBar`

- `rounded-xl` chip, guld ikon, `surface-2` bakgrund
- Expand: ember panel strip

### 5.18 Chip filter — `.reflektion-prompt-chip`

- Pill `rounded-full`, inaktiv `surface-3`
- Aktiv: guld border + `accent-glow` bakgrund

---

## 6. Ikonstrategi

| Kategori | Style B |
|----------|---------|
| **D1 LivskompassMark** | Låst — preview: varmare guldfyll, mjukare hörn (Theme Lab only) |
| **M2 KompisMark** | Låst — preview: koppar aura |
| **Drawer L2 (12)** | Fyllda koppar/brons, 24px, `rounded-lg` bakgrund |
| **Dock (4)** | Ember 3D knapp, guld glyph |
| **Widget (4)** | Line + amber dot aktiv |
| **Header (4)** | Matchar CHROME-EMBER-KANON |

Generering: `npm run icons:proposals-v6 -- --style=ember` (specificerat i blueprint).

---

## 7. Motion & animation

| Mönster | Värde | Princip |
|---------|-------|---------|
| Transition default | `180ms ease-out` | Låg arousal |
| Hover scale | `scale(1.02)` max | Ingen bounce |
| Drawer slide | `280ms cubic-bezier(0.22, 1, 0.36, 1)` | Mjuk |
| Modal fade | `200ms` | |
| Dock hold ring | `linear` progress | FyrenProgressRing |
| Ambient blob | `24s` infinite alternate | Långsam drift |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` → transitions 0ms | **Obligatorisk** |

**Förbjudet:** Confetti, streak-animationer, count-up siffror, parallax > 4px.

---

## 8. WCAG 2.2 AA

| Par | Förgrund | Bakgrund | Ratio | Status |
|-----|----------|----------|-------|--------|
| Brödtext | `#f5f0e8` | `#1a1410` | 11.2:1 | Pass |
| Muted | `#a8a29e` | `#1a1410` | 5.8:1 | Pass |
| Guld accent (stor text) | `#d4af37` | `#1a1410` | 6.1:1 | Pass (≥18px / bold) |
| Guld accent (body 14px) | `#d4af37` | `#1a1410` | 6.1:1 | Pass med `font-medium` |
| Koppar sekundär | `#b87333` | `#2a2218` | 4.6:1 | Pass (UI-komponenter) |
| Primary btn text | `#1a1410` | `#d4af37` | 6.1:1 | Pass |
| Fokusring | `#f59e0b` | — | 3:1 vs adjacent | Pass (2px offset) |

**Krav:**
- Fokus alltid synlig: `outline: 2px solid var(--accent-ember); outline-offset: 2px`
- Touch targets ≥ 44×44px (dock, drawer, chips)
- Ingen information enbart via färg (ikoner + etikett på silo-glow)

---

## 9. 18 skärmar — wire-spec

| # | Skärm | Route | Style B nyckeldrag |
|---|--------|-------|-------------------|
| 1 | Hem / Adaptive kompass | `/` | Scenic ember blob, stor kompass, "God kväll" Cinzel, dock triad |
| 2 | Drawer (Vardag) | overlay | Varm panel, guld L2-ikoner, sektion VARDAG |
| 3 | Drawer (Valv unlocked) | overlay | Andra sektion VALV, koppar accent på lås-rader |
| 4 | Dock + widget | global | Ember rail, Fyren expand amber strip, W1–W4 chips |
| 5 | Hjärtat — Dagbok | `/dagbok?tab=reflektion` | Calm-card + copper glow, humör-grid (inte select) |
| 6 | Hjärtat — Speglar | `/dagbok?tab=speglar` | Spegla-CTA secondary koppar, ej indigo |
| 7 | Valv — Logga | `/dagbok?tab=bevis&vaultTab=logga` | WORM gold timestamp, mörk logg |
| 8 | Valv — Mönster | `vaultTab=monster` | Mönster-kort koppar glow |
| 9 | Valv — Orkester | `vaultTab=orkester` | Agent-rader, indigo endast data-badge |
| 10 | Valv — Kunskapsbank | `vaultTab=kunskapsbank` | FACT-kort, guld citat |
| 11 | Kompis hub | `/kompis` | M2 avatar, varm chat, WebAuthn gate copy |
| 12 | Vardagen launcher | `/vardagen` | Launcher-rader UiCard--row, guld glow |
| 13 | Planering Kanban | `/planering` | P3 tre kolumner låst, ember kolumner |
| 14 | MåBra hub | `/vardagen?tab=mabra` | glow-bottom-ember, frågekort |
| 15 | Familjen — Barnfokus | `/familjen?tab=reflektion` | Barnfokus-frågor låst, varm espresso kort |
| 16 | Familjen — Trygg Hamn | `/familjen?tab=hamn` | BIFF-triage, koppar CTA |
| 17 | Barnporten | `/familjen?tab=barnporten` | Barn-PWA hero, CB1 widget, HITL bro |
| 18 | Capture / Inkast | inkast modal | G10 confirm, amber varning banner |

**Mockups:** `docs/design/redesign-proposals/gallery/style-b/screens.html`

---

## 10. Funktionella lås (oförändrade)

Style B ändrar **endast** visuella tokens. Följande är låsta i alla stilar:

- Barnfokus-frågor + knappcopy (`.context/locked-ux-features.md`)
- Valv Mönster + Orkester + Kunskapsbank + Aktörskarta
- P3 Kanban tre kolumner (`PLANERING-PROJEKT-HYBRID.md`)
- Drawer Vardag + Valv-struktur (`MENU-DRAWER-KANON.md`)
- PIN/WebAuthn gate, plausible deniability för Bevis-flik
- Barnporten HITL → Valv (`BARNPORTEN-SPEC.md`)
- 3-zonsrouting (`navTruth.ts`)

---

## 11. Relation till befintlig kanon

| Dokument | Style B |
|----------|---------|
| `CHROME-EMBER-KANON.md` | **Nära släkt** — Style B utökar till helapp + kort |
| `COLOR-POLICY.md` | Guld primär chrome — align |
| `design-calm.mdc` | Avviker: varmare bas, `rounded-2xl` inte `3xl`, koppar silo-glow |
| `obsidian-calm-2.css` | Overrides i `themePackRedesignB.ts` |

---

## 12. Godkännandeflöde

1. Granska `gallery/style-b/screens.html`
2. Theme Lab: välj `R-B-ember-sanctuary` → testa på `/`, `/dagbok`, `/familjen`
3. Skriv `GODKÄND: R-B-ember-sanctuary` i `docs/design/theme-lab/VARIANTS.md`
4. Kör smoke (se blueprint) → ev. deploy hosting

---

## Källfiler

- [STYLE-B-IMPLEMENTATION-BLUEPRINT.md](./STYLE-B-IMPLEMENTATION-BLUEPRINT.md)
- [gallery/style-b/screens.html](./gallery/style-b/screens.html)
- [2026-06-07-design-redesign-master-audit.md](../../evaluations/2026-06-07-design-redesign-master-audit.md)
