# Designomtagning — Master Audit (5 agenter)

**Datum:** 2026-06-07  
**Status:** Syntes klar — tre stilar specificerade i `docs/design/redesign-proposals/`  
**Input:** `docs/design/redesign-audit/AGENT-0{1-5}-*.md`

---

## Agent-mall (referens)

Varje agent-rapport följer samma struktur:

1. Inventering — skärmar/komponenter med filsökvägar  
2. Nuvarande stil — tokens, klasser, avvikelser  
3. Smärtpunkter — inkonsistens, hårdkodade färger, dubbla primitives  
4. Ikon/knapp/meny — tabell element → nu → problem → förslag  
5. Referensbilder — `docs/design/galleri/`  
6. Krav för 3 stilar — funktionellt låst vs visuellt fritt  
7. Mockup-skärmar — wire-spec per område  

---

## Tvärgående findings (Top 20 design debt)

| # | Problem | Bevis | Agenter |
|---|---------|-------|---------|
| 1 | **Ingen silo-glow** på huvudkort trots `BentoCard glow` prop | 0× `glow=` i evidence + diary | 02, 03, 05 |
| 2 | **Indigo/teal som primär chrome** bryter COLOR-POLICY | `ValvChatPanel`, `aurora` panel, drawer sub-links, Speglar CTA | 01, 02, 03 |
| 3 | **Tre kortprimitiver** — `calm-card`, `glass-card`, `elongated-module` | Blandat inom samma zon | 02, 03, 05 |
| 4 | **109 hex + ~135 rgba** hårdkodade i chrome CSS | `index.css`, `design-packs.css` | 01 |
| 5 | **Dubbla BentoCard-sökvägar** — shared vs core re-export | 6 importvägar | 01 |
| 6 | **`Button.tsx` oanvänd** — ~140 filer använder `btn-pill--*` direkt | `tokens.ts` drift | 01 |
| 7 | **4-zon dock** vs DOCK-KANON 3 zoner | `FloatingDock.tsx` | 01 |
| 8 | **`FyrenSmartWidgetBar` stub** (`return null`) | `FyrenSmartWidgetBar.tsx` | 01, 04 |
| 9 | **Nav-drift** `/liv`, `/vardagen?tab=mabra` | `tabRegistry`, hero config | 04 |
| 10 | **`rounded-3xl` calm-card** vs kanon `rounded-xl/2xl` | `obsidian-calm-2.css` | 01, 02 |
| 11 | **Snabb vs Reflektera humör-UI** — select vs grid | `JournalQuickMode` | 02 |
| 12 | **Planering 4 nav-lager** — TabBar + modulväljare + drawer + dropdown | `PlaneringPage` | 04 |
| 13 | **Valv indigo chat** — AI känns fel silo | `ValvChatPanel.tsx` | 03 |
| 14 | **Kompis copy "PIN"** — gate är WebAuthn/Fyren | `KompisHubPage` | 03 |
| 15 | **`.familjen-hub` CSS oanvänd** | `index.css` L4546+ | 05 |
| 16 | **Emerald barn-chips** vs indigo Familjen-silo | `familjen-child-chip` | 05 |
| 17 | **Barnporten `prompt()`** vs kanon hero mockups | `BarnportenPage` | 05 |
| 18 | **Legacy dead code** — `VardagenPage`, `DockHubBand`, drawer quick-grid CSS | Flera | 01, 04 |
| 19 | **DEFAULT_THEME_ID drift** — D1 vs I-stone vs COLOR-POLICY prod | `themeRegistry.ts` | 01 |
| 20 | **Spec-drift** — FAMILJEN-HUB-SPEC, MENU-DRAWER `/liv`, Dagbok Bevis-flik | docs vs kod | 02, 03, 05 |

---

## Gemensam komponentmatris (18 primitives)

Alla tre stilar **måste** definiera exakt utseende för:

| # | Primitive | Chrome-filer | Zon-exempel |
|---|-----------|--------------|-------------|
| 1 | Button primary | `index.css` `.btn-pill--accent` | Spara, Öppna Valv |
| 2 | Button secondary | `.btn-pill--secondary` | Fortsätt, Spegla |
| 3 | Button ghost | `.btn-pill--ghost` | Avbryt, Stäng |
| 4 | Button success | `.btn-pill--success` | Bekräfta, Klart |
| 5 | Card default | `BentoCard` / `calm-card` | Hub-innehåll |
| 6 | Card hero | `glass-hero` | Hem hero |
| 7 | Card row | `UiCard--row` | Launcher, listor |
| 8 | TabBar | `TabBar`, `HubTabBar` | Valv zoner, Göra |
| 9 | DrawerRow | `NavigationDrawer` | Vardag/Valv rader |
| 10 | DockOrb | `FloatingDock` center | Kompass + hold ring |
| 11 | Input | `input-glass` | Textarea, sök |
| 12 | Modal | `Modal.tsx` | Källmodal, PIN |
| 13 | PinGate | `PinGate`, `VaultLockedGate` | Valv gate |
| 14 | EmptyState | `EmptyState.tsx` | Arkiv tom |
| 15 | MetricTile | `MetricTile` | Ekonomi, frekvens |
| 16 | HubHeader | `HubPageShell` | Eyebrow/title/lead |
| 17 | WidgetChip | `FyrenWidgetBar` | W1–W4 actions |
| 18 | Chip filter | `.reflektion-prompt-chip` | Humör, kategori |

---

## Ikonstrategi per stil

| Stil | ID | Ikonfamilj | D1/M2 |
|------|-----|------------|-------|
| **A — Nordic Precision** | `R-A-nordic-precision` | Linje 1.5px, isblå stroke, silver fill | Behåll D1/M2 tills upplåsning |
| **B — Ember Sanctuary** | `R-B-ember-sanctuary` | Fyllda koppar/brons, mjuka hörn | Förslag: varm kompass-variant (kräver locked-icons OK) |
| **C — Aurora Prism** | `R-C-aurora-prism` | Glas + norrsken gradient stroke | Förslag: iridescent M2 aura |

**Prod-regel:** D1 (`LivskompassMark`) och M2 (`KompisMark`) förblir låsta tills `.context/locked-icons.md` uppdateras med explicit godkännande.

**Chrome-ikoner (24 st):** drawer L2 (12), dock (4), widget (4), header (4) — genereras via nytt script `npm run icons:proposals-v6` (specificerat i blueprints).

---

## Tre stilriktningar (finaliserade)

| ID | Namn | Känsla | Primär accent | Sekundär | Typografi |
|----|------|--------|---------------|----------|-----------|
| **A** | Nordic Precision | Kall, kirurgisk, låg arousal | `#94a3b8` silver + `#38bdf8` isblå | Minimal guld `#c9a227` endast aktiv | Inter-first; Cinzel endast hub eyebrow |
| **B** | Ember Sanctuary | Varm kvällshamn, trygg | `#d4af37` guld + `#f59e0b` amber glow | Koppar `#b87333` | Cinzel rubriker + Inter bröd |
| **C** | Aurora Prism | Futuristisk glas, norrsken | `#2dd4bf` teal + `#818cf8` indigo | Glass blur, vit text | Cinzel display + JetBrains Mono data |

**Obs:** Stil A/B/C bryter med nuvarande Obsidian Calm-kanon medvetet — användaren valde fria stilar.

---

## Funktionella lås (alla stilar)

| Lock | Källa |
|------|-------|
| Barnfokus-frågor + knappcopy | `locked-ux-features.md` |
| Valv Mönster + Orkester + Kunskapsbank + Aktörskarta | `locked-ux-features.md` |
| P3 Kanban tre kolumner | `PLANERING-PROJEKT-HYBRID.md` |
| Drawer Vardag + Valv-struktur | `MENU-DRAWER-KANON.md` |
| PIN/WebAuthn gate | security |
| Barnporten HITL → Valv | `BARNPORTEN-SPEC.md` |
| Inkast G10 confirm | `2026-06-06-inkast-lockdown` |
| 3-zonsrouting | `navTruth.ts` |

---

## 18 skärmar × 3 stilar (mockup-register)

| # | Skärm | Agent-källa |
|---|--------|-------------|
| 1 | Hem / Adaptive kompass | 01, 04 |
| 2 | Drawer (Vardag) | 01 |
| 3 | Drawer (Valv unlocked) | 01, 03 |
| 4 | Dock + widget | 01, 04 |
| 5 | Hjärtat — Dagbok | 02 |
| 6 | Hjärtat — Speglar | 02 |
| 7 | Valv — Logga | 03 |
| 8 | Valv — Mönster | 03 |
| 9 | Valv — Orkester | 03 |
| 10 | Valv — Kunskapsbank | 03 |
| 11 | Kompis hub | 03 |
| 12 | Vardagen launcher | 04 |
| 13 | Planering Kanban | 04 |
| 14 | MåBra hub | 04 |
| 15 | Familjen — Barnfokus | 05 |
| 16 | Familjen — Trygg Hamn | 05 |
| 17 | Barnporten | 05 |
| 18 | Capture / Inkast | 04 |

**Leverans:** `docs/design/redesign-proposals/gallery/index.html` + per-stil HTML i `style-a/`, `style-b/`, `style-c/`

---

## Nästa steg (efter ditt val)

1. Välj stil A, B eller C (eller hybrid)  
2. Säg *"Implementera stil X"* — agent följer `STYLE-X-IMPLEMENTATION-BLUEPRINT.md`  
3. Theme Lab preview → `GODKÄND:` i `VARIANTS.md`  
4. Smoke + deploy hosting  

---

## Källfiler

- [AGENT-01-chrome-system.md](../design/redesign-audit/AGENT-01-chrome-system.md)
- [AGENT-02-hjartat.md](../design/redesign-audit/AGENT-02-hjartat.md)
- [AGENT-03-valvet-kompis.md](../design/redesign-audit/AGENT-03-valvet-kompis.md)
- [AGENT-04-vardagen.md](../design/redesign-audit/AGENT-04-vardagen.md)
- [AGENT-05-familjen.md](../design/redesign-audit/AGENT-05-familjen.md)
