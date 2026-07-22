# Frontend YOLO Polish — Masterplan v2

**Datum:** 2026-06-19  
**Status:** Planering (read-only) — efter merge Valv/Hem/MåBra + Hem Layout A  
**Agenter:** ux-guardian, theme-lab, valv-builder, explore

---

## Nuläge på `main`

| Våg | Leverans | Smoke |
|-----|----------|-------|
| A1 | Valv Kunskapsbank — chat-first, `CalmCollapsible` | PASS |
| A2 | Hem — adaptive cards, "Mer för dig" | PASS |
| A3 | MåBra hub — 5 collapsibles + skeleton | PASS |
| B | Hem Layout A — ankare, rutnät, brass/calm | PASS |
| Skill | `livskompassen-memory-agents` U1-tabell | pushad |

**Mönster:** `CalmCollapsible` + primär yta först + sekundärt bakom fold.

**Deploy:** Kräver Mac (`firebase login` saknas i Cloud Agent).

---

## Parallell analys — sammanfattning

### UX-guardian (Hem post-merge)

- **Locked UX:** PASS — Barnfokus, Valv, Planering, Barnporten, drawer orörda.
- **Top 5 polish-gap Hem:**
  1. Preset-shortcuts (`home_snabbval`) inte kopplade till Layout A
  2. Inkast-strip säger "Senaste" men visar ingen preview
  3. Token-drift (`#10b981`, indigo focus vs gold)
  4. Mobil — fast asymmetriskt grid utan stack-breakpoint
  5. `CalmCollapsible` saknar full `calm-card`-behandling

### Theme-lab (Hem Layout A vs kanon)

- **Struktur:** matchar HEM-LAYOUT-A-KANON (ankare → grid → strip).
- **Prod (brass):** saknar `brass-glass--hero`; intro för busy (tagline + sub + eyebrow).
- **Calm fallback:** gold CTA istället för teal pill; emerald ikoner vs kanon.
- **Wave A2 Hem (8 punkter):** hero modifier, intro collapse, calm tokens, mobile stack.

### Valv-builder (Wave A2.x)

| Våg | Tab | Primär synlig | Collapsible |
|-----|-----|---------------|-------------|
| A2.1 | logga | Inkast, granska, lista | Manuell post, Drive-hint |
| A2.2 | sok | Chat | Extended hints |
| A2.3 | monster | Frekvens + rescan | Månad, kategorier |
| A2.4 | orkester | Trio + Brusfilter | ADK, docs, SMS-sök |
| A2.5 | dossier | Wizard kärna | Valfria filter, timeline preview |
| A2.6 | aktorskarta | Lista + add (tom) | Seed-lista |
| A2.7 | docs | Kanon markdown | — |

**Risk A2.4:** Orkester — collapsible får inte unmounta Brusfilter-state.

### Explore (master queue)

Rekommenderad ordning efter deploy-verify:

1. Valv Samla (A2.1) — högsta daglig trafik bevis
2. Vardagen Kompasser + Ekonomi
3. Valv Pansaret in-panel (A2.3–A2.4)
4. Hem Layout A token/mobile (Wave A2)
5. Familjen / Planering / Hamn (Fas 22-gates)

---

## Smoke per våg (minimum)

```bash
npm run build
npm run smoke:locked-ux
npm run smoke:design-modules
```

**Valv Samla extra:** `smoke:valv-mode`, `smoke:vault-worm`, `smoke:inbox`, `smoke:weaver-hitl`  
**Valv Orkester extra:** `smoke:orkester`, `smoke:grans`, `smoke:valv-security`

---

## PMIR-gate (före kod)

Varje våg kräver kort preflight i `docs/evaluations/` + explicit Pontus-OK.

**STOP-regler:**
- Dölj/merge Mönster + Orkester
- Flytta P3 Kanban från `/planering`
- Barnporten kanon-UI redesign
- `firestore.rules` utan separat order

---

## Nästa steg (ett i taget)

### Steg 0 — Deploy (Mac, Pontus)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
git pull origin main
npm run build
firebase deploy --only hosting
```

Hard refresh → `/`, Valv Kunskapsbank, MåBra hub.

### Steg 1 — Efter visuell OK

Svara *"kör A2.1"* för Valv Samla polish (preflight + implementation).

Alternativ: *"kör Hem A2"* för Layout A token/mobile-pass.

---

## Agent-ID:n (resume)

| Agent | ID |
|-------|-----|
| ux-guardian | debb47e9-696c-4caf-b4e2-65db3efd3917 |
| theme-lab | c5cf9332-584a-4a35-9bfe-16622b0ea82c |
| valv-builder | 48eddcfb-026e-45bc-8e59-25de7b34f00a |
| explore | df9460b4-8a94-42f2-9135-9f8f470311af |
