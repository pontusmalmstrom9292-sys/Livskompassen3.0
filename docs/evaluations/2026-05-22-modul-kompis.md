# Modul — kompis

**Route:** `/vardagen?tab=kunskap` | **Collections:** `kampspar`, `kb_docs` | **Callables:** `knowledgeVaultQuery`, `ingestKampsparEntry`, inbox-*

## PASS

- Tidshjulet G13 live `subscribeKampsparEntries`
- `knowledgeVaultService.ts` — Kunskap-silo RAG
- InboxQueueCard G10 HITL
- EntityRegistryCard G9
- G11 mock `Kampspar` isolerad UI-only

## GAP

- `analyzeMessage` kan ta client `ragContext` via Safe Harbor/Hamn-flöde
- Opt-in minne-ingest trauma-policy — **open** i system-plan

## Sacred / säkerhet

Kunskap-silo **PASS**. DCAP + routing via supervisor.

## Rekommenderat

`npm run smoke:kunskap`, `smoke:inbox`, `smoke:entities`.
