# PHASE-05 — CHECKPOINT-5 handoff (ny Cursor-chatt)

**Användning:** Spara ChatBox svar 2 i `leveranser/2026-06-15-fas-05-synapse-implementation.md` → ny chatt → `@`-referera filerna → klistra prompten nedan.

---

## Filer att @-tagga i nya chatten

1. `docs/external-ai/leveranser/2026-06-15-fas-05-synapse-implementation.md` **(hela ChatBox-svaret)**
2. `docs/external-ai/leveranser/2026-06-15-fas-05-synapse-spec.md`
3. `.context/system-plan.md` (om agenten behöver fas-kontext)

---

## Prompt för Cursor (kopiera allt)

```
CHECKPOINT-5 — PHASE-05 Synapse lock (Cursor-implementering)

Pontus orkar inte klistra in fil för fil. Gå igenom HELA leveransen i:
docs/external-ai/leveranser/2026-06-15-fas-05-synapse-implementation.md

Spec (referens): docs/external-ai/leveranser/2026-06-15-fas-05-synapse-spec.md

## Ditt uppdrag

1. Läs leveransfilen noggrant — extrahera alla TypeScript-förslag (driveIngestSynapse, dcapAlertSynapse, journalWovenSynapse, synapseBus, stateStore, vaultSessionGate, m.fl.)

2. Jämför VARJE förslag mot LIVE kod i repot (grep/read functions/src/adk/, inboxPersist.ts, routeInboxToWorm). ChatBox duplicerar ofta saker som redan finns:
   - HITL → inbox_queue (requiresHumanReview, routeInboxToWorm)
   - applyInkastConfidenceGate 0.75 (CP-3)
   - hashPayload i stateStore + dcapAlertSynapse
   - hasVaultSession: false för Drive background ingest

3. Applicera ENDAST verifierade luckor — minimal diff. HOPPAR ÖVER felaktiga stubs och helomskrivningar som bryter G10/låst beteende.

4. MUST NOT:
   - Fjärde synapse-trigger
   - Cross-RAG / auto kb_docs för bevis
   - Bryta locked UX, WORM, tre silos
   - Ändra firestore.rules utan explicit PMIR

5. Om spec är godkänd: kopiera/uppdatera docs/external-ai/SYNAPSE-LOCK-SPEC.md från leveranser/2026-06-15-fas-05-synapse-spec.md

6. Smoke (obligatoriskt):
   cd functions && npm run build
   npm run smoke:orkester

7. Uppdatera CHECKPOINT-LOG.md + LIFE-OS-BUILD-STATE.md (CP-5 PASS/REVISE)

8. Skriv kort docs/external-ai/leveranser/2026-06-15-fas-05-cursor-implementation.md: vilka filer ändrades, vilka ChatBox-förslag hoppades över och varför.

9. Om PASS och synapser LOCK: nämn snapshot ./scripts/snapshot_locked_module.sh synapser (Pontus kör).

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och smoke:orkester PASS.
```

---

## Pontus — två steg

1. Klistra in **hela** ChatBox-svar 2 i `docs/external-ai/leveranser/2026-06-15-fas-05-synapse-implementation.md` och spara.
2. **Ny Cursor-chatt** → `@` de två leveransfilerna → klistra prompten ovan.

Ingen manuell fil-för-fil. Agenten gör resten.
