# ADR: Design Riktning B — varmare mörk hub/kluster

**Status:** Godkänd (2026-05-23)  
**Kontext:** Inkorg [`2026-05-23-inkorg-skarmdumpar.md`](../evaluations/2026-05-23-inkorg-skarmdumpar.md), UX-analys §1 [`2026-05-23-UX-navigation-analys.md`](../evaluations/2026-05-23-UX-navigation-analys.md), referensenergi `nav-01-horizon-dashboard.png` / `dashboard-01-dashboard-oversikt.png`.

## Beslut

- **Behåll** mörk Obsidian-bas (`#020617` → `#0f172a`), Outfit/Inter, Variant C-navigation (1 kompass-hub + Modulhub 2×2, Fyren 3s) — oförändrat.
- **Inför Riktning B** för **hub- och klusterytor** (hem-scroll, Modulhub-panel, kompass-satelliter): varmtonade kortytor per kluster (`gold` / `indigo` / `lavender` / `emerald`), tydligare ikonplattor och subtil hörnglow — mindre platt “corporate glass”.
- **Ej** ljus tema, nature themes, 5-ikon Shield-dock, eller ändring av Valv/Måbra/Barnen-sidor i denna fas.

## Avgränsning (Chat 1)

| Område | Åtgärd |
|--------|--------|
| `tokens.ts`, `index.css`, `ClusterGrid`, `CompassHubOrb`, `ModuleHubPanel` | Varmare tiles |
| `VaultPage`, `MabraPage`, `barnens_livsloggar`, `functions/` | **Ej rörd** |
| Global `glass-card` / modul-specifika sidor | Oförändrat tills senare chat |

## Konsekvenser

- Kanon: [`docs/specs/design-master.md`](../specs/design-master.md) + [`.context/design-language.md`](../../.context/design-language.md) beskriver A+bas + **B för hub/kluster**.
- Tokens: `CLUSTER_TILE` i [`src/modules/core/ui/tokens.ts`](../../src/modules/core/ui/tokens.ts); CSS-variabler `--tile-*` i [`src/index.css`](../../src/index.css).
- Riktning A (slate-only glass) arkiveras som **bas**; B är tillägg på navigationskort, inte ny accent-hierarki (guld → indigo → emerald kvar).

## Referens

- Mock (mönster only): [`gemini-cognitive-exoskeleton-App.tsx`](../evaluations/artifacts/gemini-cognitive-exoskeleton-App.tsx) Horizon Grid kvadranter
- Skärmdumpar: [`artifacts/screenshots-inkorg-2026-05-23/`](../evaluations/artifacts/screenshots-inkorg-2026-05-23/)
