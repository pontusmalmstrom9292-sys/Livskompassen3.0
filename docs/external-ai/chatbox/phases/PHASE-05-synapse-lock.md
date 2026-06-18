# PHASE-05 — Synapse-lås

**Modell:** Chatt 1: Grok 4.20 Reasoning · Chatt 2: GPT-5.5  
**Repomix:** `chatbot-pack-security.md` + synapse-filer

---

## Chatt 1 — Analys (Grok 4.20)

```
UPPDRAG: SYNAPSE-LOCK-SPEC — dokumentera och härda synapse-kedjan.

1. Tabell: trigger → handler → silo (alla 4 triggers)
2. Edge cases: bevis utan vault session, trauma/LVU → inbox_queue
3. Idempotens: hashPayload i stateStore — inga dubbla WORM-poster
4. DCAP → dcap_alert → paralysBrytarenSynapse

LEVERANS: SYNAPSE-LOCK-SPEC.md — INGEN kod i chatt 1.
```

## Chatt 2 — Kod (GPT-5.5, ny chatt)

```
UPPDRAG: Implementera luckor från SYNAPSE-LOCK-SPEC (bifoga spec från chatt 1).

Fullständig kod endast för identifierade luckor.
MUST NOT: fjärde trigger, cross-RAG, auto kb_docs för bevis.

VERIFY: npm run smoke:orkester
```

**→ CHECKPOINT-5** — snapshot `synapser` om LOCK.
