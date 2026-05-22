# Systemkontroll — B — 2026-05-22

**Trigger:** Byggpass Sacred + Layered Defense  
**Källor:** `.context/security.md`, `firestore.rules`, `functions/src/index.ts`, `src/modules/core/auth/useZeroFootprint.ts`, `src/modules/core/security/killSwitch.ts`, `src/modules/verklighetsvalvet/components/VaultPage.tsx`, `docs/SMOKE_CHECKLIST.md`

## Sammanfattning

WORM och silo-RAG är **starka**. Layered Defense har **PARTIAL** på L3 (CMEK ops), L4 (Zero Footprint), L5 (client RAG injection). Inga mock-auth i runtime. DCAP-prompt delvis utanför `sharedRules.ts`.

## 1) Layered Defense L1–L7

| Lager | Status | Bevis |
|-------|--------|-------|
| L1 Identitet | **PASS** | `firestore.rules` L4–18; callables kräver `context.auth` |
| L2 WORM | **PASS** | `reality_vault`, `journal`, `children_logs`, `dossier_snapshots` L33–118 |
| L3 CMEK | **GAP (ops)** | `scripts/setup_gcp_cmek.sh` — ej verifierat i app |
| L4 Zero Footprint | **PARTIAL** | `useZeroFootprint.ts` — endast idle 5 min, ej blur |
| L5 AI-gräns | **PARTIAL** | Auth inte LLM; **client ragContext** till Vertex cache |
| L6 Silo | **PASS** | Tre separata RAG-callables; Weaver dokumenterat undantag |
| L7 Kill Switch | **PASS** | `useShakeToKill.ts`, `invalidateSession` |

## 2) Sacred Features (7)

| # | Feature | PASS/GAP | Smoke |
|---|---------|----------|-------|
| 1 | Verklighetsvalvet | **GAP** (client gate) | #2, #11, #16–17 |
| 2 | Sanningens Sköld | **PASS** | WORM rules |
| 3 | Morgonkompassen | **PASS** | #5 |
| 4 | Dossier-Generator | **PASS** | smoke:dossier |
| 5 | Speglings-Systemet | **PASS** | #9, #14–15 |
| 6 | Zero Footprint | **PARTIAL** | #12 |
| 7 | Kill Switch | **PASS** | #13 |

## 3) Tre silor

| Silo | Callable | Collection | Cross-RAG |
|------|----------|--------------|-----------|
| Kunskap | `knowledgeVaultQuery` | `kampspar`, `kb_docs` | **Nej** |
| Valv | `valvChatQuery` | `reality_vault` | **Nej** |
| Barnen | `childrenLogsQuery` | `children_logs` | **Nej** |

**Undantag:** `weaveJournalEntry` taggar journal → metadata (ej användar-chat-RAG).

## 4) WORM collections (rules)

`checkins`, `journal`, `reality_vault`, `children_logs`, `kb_docs`, `kampspar`, `transactions`, `dossier_snapshots` (client create:false), `entity_profiles`, `system_synapses`, `dcap_alerts`, `mabra_sessions` — update/delete false eller begränsat.

**Undantag:** `mabra_progress` tillåter client update (L81–92).

## 5) Förbjudet som hittats

| Problem | Fil |
|---------|-----|
| Client `ragContext` injection | `functions/src/index.ts` L86 |
| Webhook `ownerId` spoof | `functions/src/index.ts` L181–186 |
| DCAP prompt inline | `functions/src/agents/DCAP.ts` |
| WebAuthn ej server-verifierad | `src/modules/core/auth/webauthn.ts` |
| Ingen `email_verified` i rules | `firestore.rules` |
| Postman mock WebAuthn (legacy) | `livskompassen-api.postman_collection.json` |

## Rekommenderat nästa steg

P0: Server-side RAG i `analyzeMessage` — ta bort `data.ragContext`.

## Blocker

—
