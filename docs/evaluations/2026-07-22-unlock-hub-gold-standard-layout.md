# Unlock — Hub Gold Standard layout (presentation only)

```yaml
approved: yes
date: 2026-07-22
scope: hub-gold-standard-layout
authority: Pontus plan-approve «Gold Standard: Hub-layout + Companion parity (C + Ethereal Blue)»
decision_1: C
decision_2: ethereal-blue
```

## Purpose

Unlock **presentation / layout-skin** on locked Superhub surfaces so hub cards can visually mirror Companion Gold Standard mockups (Dagbok, Fyren, Fokus, Familjen) without replacing SuperModules or changing data flows.

Companion web/Android visual deepen stays under **allowed polish** (`companion-os-lock.mdc`) unless interact/WIS contracts change — those remain locked.

## Covered locked UX (§)

| § | Surface | Unlock allows |
|---|---------|---------------|
| §11 | MåBra Superhub | Insight/capacity card skin (Ethereal Blue rings, guldrim) |
| §12 | Familjen Superhub / Barnfokus | Avatar-row + schema densitet + action-rad skin |
| §15 | Planering Superhub | Fokus presentation (progress, nästa steg, timer UI) |
| §17 | Superdagbok / Hjärtat | Hero, mood-rad, CTA guldrim, streak-footer feel |
| §5 | Fyren Edge | Visual chrome polish only — no capture-path change |
| §23 | Companion OS | Kap 6 deepen (allowed polish); no pack removal |

## MUST change (allowed)

- CSS / design-system: `gs-hub-card`, guldrim, specular, Ethereal Blue progress
- Density, typography (caps/tracking), hero/atmosphere surfaces
- Widget pack visual parity vs `widget_bible.md` Kap 6
- Android companion drawables/layouts (gold fixed on API 31+)

## MUST NOT change

- Superhub modes, delegates, save-handlers, tabs
- WORM / `firestore.rules` / Sacred / DCAP
- Barnfokus question pool / P3 Kanban / dock-header DAD
- Companion WIS interact contract (record/toggle still in-widget)
- New Companion widgets from 20-grid (Ekonomi, Väder, Vanor, …)
- Global teal/cyan accents — use Ethereal Blue `#7BA3C9` / `--cw-ethereal` only for living progress

## Re-lock

After smoke PASS (`smoke:companion-widgets`, `smoke:locked-ux`, `smoke:design-modules` + zone smokes): keep features locked; this unlock is presentation-scoped and expires when Gold Standard wave is marked done in `docs/TODO.md`.

## Smoke

```bash
npm run smoke:companion-widgets
npm run smoke:locked-ux
npm run smoke:design-modules
```
