# Design System v2 — temajämförelse

**Genererat:** 2026-05-23  
**Syfte:** Välj **ett** tema (A–D) innan tokens implementeras i `src/modules/core/ui/tokens.ts`.

## Teman

| ID | Mapp | Känsla | Palett |
|----|------|--------|--------|
| **A** | [A-sacred-compass](./A-sacred-compass/) | Premium livskompass, guld-emblem | Guld, teal, amber glöd |
| **B** | [B-obsidian-elevated](./B-obsidian-elevated/) | Obsidian Calm med djup | `#020617`–`#0f172a`, emerald, indigo |
| **C** | [C-nordic-aurora](./C-nordic-aurora/) | Klinisk lugn, frostad glass | Indigo, emerald, minimal guld |
| **D** | [D-tactical-harbor](./D-tactical-harbor/) | Grey Rock, max kontrast | Slate, amber endast på CTA |
| **E** | [E-aurora-obsidian-compass](./E-aurora-obsidian-compass/) | **Hybrid:** mörk Aurora + Obsidian-menyer + guld-kompass + appikon | [THEME-E-SPEC.md](./E-aurora-obsidian-compass/THEME-E-SPEC.md) |

**Referens Tema A (original):** guld-kompass med rutiner · budget · personlig utveckling.

**Tema E** = C (mörkare aurora) + B (glass-menyer) + A (kompass + ikon). **OBS:** E innehåller blå/grön aurora — **ersatt av F/G/H** (se [COLOR-POLICY.md](../COLOR-POLICY.md)).

## Nya teman (utan blå/turkos) — 2026-05-23

| ID | Mapp | Fokus |
|----|------|-------|
| **F** | [F-guld-pansar](./F-guld-pansar/) | Valv-typografi, Pansaret, BIFF, widget, appikon |
| **G** | [G-varm-hamn](./G-varm-hamn/) | Barnfokus, KBT, varm espresso |
| **H** | [H-grafit-greyrock](./H-grafit-greyrock/) | Grey Rock, hub, Kompis, minimal |

**Bildspel:** [slideshow/index.html](../slideshow/index.html)

## Moduler (7 skärmar per tema)

| Fil | Modul | Design-ID |
|-----|-------|-----------|
| `00-hero-livskompass.png` | Livskompass-nav | D2 |
| `01-kompis.png` | Kompis AI-livsarkitekt | D1 |
| `02-trygg-hamn-hub.png` | Trygg hamn-hub | D3–D8 |
| `03-barnfokus.png` | Barnfokus + minnesankare | D11–D14 |
| `04-biff-triage.png` | BIFF-Detektor + Triage | D22–D23 |
| `05-pansaret-valv.png` | Det Juridiska Pansaret | D16–D20 |
| `06-kbt-transformator.png` | KBT-Transformatorn | D29 |

## Galleri

Öppna **[index.html](./index.html)** i webbläsaren (dubbelklicka eller `open docs/design/themes/index.html`).

## Nästa steg

1. Välj tema: **A**, **B**, **C** eller **D**.
2. Meddela i Cursor: `valt tema X` → uppdatering av `.context/design-language.md` + tokens.
3. Därefter: `kör planen` (P1-moduler i valt tema).

## Oförändrat (alla teman)

- Ett steg i taget, låg sensorisk noise
- Locked UX: Middagsfrågan, Valv Mönster/Orkester
- Ingen natur-tapet (skog/djur/regnbåge)
