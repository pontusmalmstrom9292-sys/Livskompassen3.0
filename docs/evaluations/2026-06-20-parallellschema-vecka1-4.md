# Parallellschema vecka 1–4 — Copilot Pro + Cursor

**Datum:** 2026-06-20  
**Regel:** En aktiv kodzon i taget. Copilot/Cursor parallellt inom samma PR är OK.

| Vecka | Parallellt spår | Copilot Pro | Cursor |
|-------|-----------------|-------------|--------|
| 1 | CI grön + copilot-instructions | Auto-review på | Fas 0–1 (denna leverans) |
| 2 | Figma B2 dock | Review UI PR | specialist-theme-lab + figma MCP |
| 3 | Ingest våg 4 (om PMIR) | **Nej** — ADK-only | livskompassen-synapser-adk |
| 4 | Städning + backlog | Stäng gamla Dependabot | yolo-vakt slutaudit |

## Vecka 1 status

- [x] PR #54 CI verify branch
- [x] `.github/copilot-instructions.md` + 4 path instructions
- [x] Subagents: copilot-bridge, mcp-guardian, parallel-orchestrator
- [x] Pipeline v2: smoke:mdc + copilot-sync pack
- [x] Cursor Automations prefill docs

## Vecka 2 gate

Figma B2 dock **efter** grön `smoke` på main.
