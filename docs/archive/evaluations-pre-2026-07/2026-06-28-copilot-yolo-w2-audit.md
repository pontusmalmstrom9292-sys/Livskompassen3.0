# Våg 2 — read-only backend audit

**Datum:** 2026-06-28  
**Scope:** Backend only — WORM, tre silos, DCAP före LLM, Zero Footprint. Inga PMIR-paths ändrade.

## Vad

| Kontroll | Status | Evidens |
|---|---:|---|
| DCAP-first routing | OK | `functions/src/lib/inboxClassifier.ts:74-255`, `functions/src/agents/kompis-supervisor.ts:31-118`, `functions/src/agents/cards/index.ts:283-313` |
| Silo-isolering | OK | `functions/src/lib/vaultRag.ts:38-75`, `functions/src/lib/childrenLogsQueryRag.ts:54-111`, `functions/src/lib/kampsparQueryRag.ts:39-111` |
| Zero Footprint logout | OK | `functions/src/callables/agents.ts:107-129`, `functions/src/lib/vaultSessionGate.ts:44-141`, `functions/src/adk/orchestrator.ts:119-121` |
| WORM write guards | OK | `functions/src/lib/wormPayload.ts:7-96`, `functions/src/lib/inboxPersist.ts:116-197, 223-250` |
| Tamper-evident hash chain | **GAP** | `functions/src/lib/wormHashChain.ts:59-116` exists, but no active WORM write path calls it |

## Varför

DCAP-routen är deterministisk i kod före LLM, och inbox-flödet fail-closed till HITL när det ska. Kunskaps-, Valv- och Barnen-silorna läses separat och de domänkritiska callablesna kräver auth/App Check där det är relevant.

Det tydligaste backend-gapet är att hashkedjan för WORM är implementerad men inte inkopplad i skrivvägarna. De faktiska WORM-skrivarna jag fann är `functions/src/lib/weaverPending.ts:81-84`, `functions/src/lib/inboxPersist.ts:129-197, 240-248`, och `functions/src/lib/recordDiscoveryMilestoneServer.ts:41-51`; ingen av dem anropar `appendToHashChain`, så tamper-evidence är ännu inte fullständig.

## Smoke-resultat

- `npm run smoke:predeploy:build` — **PASS**

## Risk

- Medel: WORM är append-only, men utan aktiv hashkedja är revisionsspåret svagare än arkitekturen utlovar.
- Ingen deploy körd.

## Deploy

none
