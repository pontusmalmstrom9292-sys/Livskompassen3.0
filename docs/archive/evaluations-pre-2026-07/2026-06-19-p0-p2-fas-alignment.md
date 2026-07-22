# P0–P2 ↔ Fas 20–22 alignment (2026-06-19)

| Masterplan våg | Fas 20–22 motsvarighet | Beslut |
|----------------|------------------------|--------|
| P0.1 evolution_ledger Admin-only | Överlappar Fas 20.6 tri-gate / evolution | Implementerad här — ingen dubbel PR |
| P0.2 Zero Footprint purge | Fas 20.2 JWT vault lock | Kompletterar 20.2 (RAM + Speglar) |
| P0.3–P0.4 prompt-konsolidering | Fas 22.7 Valv coach hygiene | Kör före 22.7 deploy |
| P1.1 kampspar ingest | Fas 22.5 FACT ingest | Samma Kunskap-silo — koordinera seed |
| P1.3 reprocessVaultInboxQueue | Fas 20.4 Inkast polish | Ny callable — deploy med inbox |
| P1.4 dcap_alerts UI | Fas 21.9 Hamn polish | Valv forensik — ej Barnporten UI |
| P2.1 Grans orchestrator | Fas 22.4 Hamn wizard | Backend-only — säker |
| P2.3 barnporten scheduler | Fas 21+ evolution | `scheduledBarnportenAgeEval` |
| P2.5 planning_kanban tri-gate | Fas 20.3 planering tokens | UI gate — behåll P3 Kanban locked UX |

**Regel:** Ingen parallell Fas-våg startas utan att denna tabell uppdateras.
