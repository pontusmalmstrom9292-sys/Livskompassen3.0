---
applyTo: "src/**/*.tsx"
---

# Frontend / Obsidian Calm UI

- Use design tokens: `bg-surface`, `text-accent`, `border-border` — no raw hex in `src/modules/features/**`.
- Hub views: `hub-view-lock` + `calm-scroll-island` for scroll islands.
- Cards: `calm-card` / `glass-card` + silo glow (`glow-bottom-gold|blue|green`).
- Chameleon pattern for multi-mode input — not new top-level routes per micro-feature.
- Locked UX files: see `.context/locked-ux-features.md` — do not remove Barnfokus, Valv Mönster/Orkester, drawer deniability.
- Smoke: `npm run smoke:locked-ux`, `npm run smoke:design-modules`
