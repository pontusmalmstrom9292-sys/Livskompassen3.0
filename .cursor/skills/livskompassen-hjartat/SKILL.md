---
name: livskompassen-hjartat
description: Hjärtat — Dagbok emotions, Speglar routing, journal WORM. Yttre lugnet layer only.
---

# Hjärtat skill (U14)

## When to use

- Daily mood, energy, reflection in Dagbok
- When to escalate to Speglar vs Måbra vs Hamn
- `journal_woven` opt-in to kampspar (G7)

## Layer: yttre lugnet

Dagbok = low-stakes emotional log. **Not** forensic valv. **Not** BIFF.

## Routing table

| User signal | Route |
|-------------|-------|
| "Jag känner …" idag | Dagbok |
| Gaslighting, memory doubt | `/speglar` |
| Heart racing, panic | U11 Måbra |
| Ex message pasted | U9 Hamn |
| Evidence / LVU doc | Fyren valv |

## Runtime

| Piece | Path |
|-------|------|
| Dagbok | `src/modules/dagbok/` |
| Speglar | `src/modules/speglings_system/` |
| Vävaren | `weaverAgent.ts` → `reality_vault` (async, valv layer) |
| Synapse | `journalWovenSynapse.ts` (opt-in) |

## MUST

- Progressive disclosure in UI
- Opt-in only for journal → kampspar

## MUST NOT

- Auto-ingest journal to RAG without checkbox
- Orkestern batch features (G19–G21) unless `kör [GAP]`

## Related

- Agent: `.cursor/agents/livskompassen-hjartat` (U14)
- Architecture: `docs/specs/ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md`
