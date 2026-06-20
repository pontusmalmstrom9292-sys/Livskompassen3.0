# Backlog — PMIR krävs före kod (2026-06-20)

Parkerade efter merge-våg 2026-06-20. **Ingen implementation utan explicit Pontus-OK.**

| ID | Ämne | Varför parkerad | Nästa steg |
|----|------|-----------------|------------|
| **BP-DRUG** | Drogfrihet supermodul (12-steg KBT) | Ny modul — ej Fas 19-plan | Deep Research + PMIR (chatt 08b51de6) |
| **BP-PIPE** | Cursor pipeline `9dad4f43a` | Orphan vs `135b5fcbd` på main; `smoke:predeploy` nätverksblock | Diff commits; retry smoke; separat PR |
| **BP-THEME** | PR #12 Style C Aurora Prism | Theme Lab Phase 1 — äldst öppen PR | PMIR om Theme Lab är aktiv prioritet |
| **BP-PLAY** | Playwright UI gate (`cursor/mcp-playwright-ui-gate-7e2d`) | E2E infra — ej merge-våg | PMIR + CI budget |

## Redan på main (stäng inte om)

- M3.0-C / `secureExport` / `VIT_HUB_PRINT_STYLES`
- Ingest våg 2–3 + widget synapse
- `pr-smoke-gate.yml` + branch protection
