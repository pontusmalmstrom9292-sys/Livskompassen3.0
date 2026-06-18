# Module Help (?-widget)

**Status:** Kanon 2026-06-18 · progressive disclosure för silo, sparning och exempel.

## Mål

Liten **?** i modulheadern — **dold som standard**. Svarar på:

1. Vad gör jag här? (kort exempel)
2. Var hamnar det? (collection / silo)
3. Vad flyttas inte automatiskt? (WORM, HITL, Zero Footprint)

## Komponenter

| Fil | Roll |
|-----|------|
| `src/modules/core/ui/ModuleHelpHint.tsx` | UI — popover, Esc stänger |
| `src/modules/core/help/moduleHelpRegistry.ts` | Innehåll per modul + valfritt `mode` |
| `src/modules/core/help/ModuleHelpFromRegistry.tsx` | Tunn wrapper |

## Placering

- Flex-rad i supermodul-header: titel vänster, **?** höger (`justify-between`)
- `ModuleShell.headerAside` för zon-hubbar (t.ex. Familjen)
- **Aldrig** fullbredds-accordion öppen som default

## Innehållsregler (U1/U6)

- Tre silos — tydlig collection, ingen cross-RAG i copy
- Plausible deniability — inga Valv-ord i publika hubbar utan session
- WORM — «skapas en gång, ändras inte»
- HITL — barn/inkast → Valv kräver explicit godkännande
- Max 4–6 rader i popover

## Preset-gate

Hub-hints (`hub_familjen`, `hub_mabra`, `hub_hamn`) styrs av `lifeHubPresets` `materialKey` — samma som tidigare `LifeHubHubHint`.

## Smoke

`npm run smoke:design-modules` — registry + P1-montering.

## Relaterat

- [`docs/specs/hjartat-flode.md`](../specs/hjartat-flode.md) — Dagbok / Valv / Speglar dataflöde
