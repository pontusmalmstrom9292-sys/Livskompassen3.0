# Prompt 6 — Kunskapsvalvet / Minne / RAG framtidsidéer

**Datum:** 2026-06-25  
**Plattform:** Cursor (Composer)  
**Typ:** Analys — inga kodändringar  
**Perspektiv:** Knowledge architect · retrieval designer · AI systems planner

---

## Nuläge (kort)

**Kunskap-silo (U1):** Endast `kampspar` + `kb_docs` via `kampsparQueryRag.ts` → `knowledgeVaultQuery` / `askKnowledgeVaultWithRag`.

| Collection | Typisk källa | WORM |
|------------|--------------|------|
| **kampspar** | Manuell ingest, journal_woven (opt-in), seeds, filuppladdning | Append-only |
| **kb_docs** | Drive G10 (`persistKbDocFromDrive`), godkänd FACT-ingest | Append-only |

**Retrieval:** Firestore Native Vector Search (cosine) på `embedding`; citation whitelist i `parseKnowledgeVaultJson`; degraded fallback (`buildDegradedResponse`) utan hallucinerade docIds.

**Ingest:** DCAP/heuristik före LLM · `isKunskapFactApproved` (U6 content bank gate) · `journal_woven` kräver `optIn === true` · bevis → `reality_vault` ALDRIG kb_docs.

**UI:** `KnowledgeVaultChat`, `KnowledgeCitationList` → Tidshjul, `AutonomousArchivePanel`, `KunskapsvalvFileIngest`, `KampsparIngestForm` — bakom Valv PIN (`VaultKunskapsbankPanel`).

**Agent:** Livs-Arkivarien (`LIVS_ARKIVARIEN_SYSTEM_PROMPT`) · `loadKunskapEntityBundle` (metadata, ej bevis).

---

## Framtidsidéer

### 1. Retrieval-tröskel (vector distance gate)

**Problem:** Låg-relevans-träffar kan ge "säkert" AI-svar på fel underlag.

**Retrieval:** Filtrera bort chunks med `vectorDistance` över tröskel; visa "ingen tillräcklig match".

**Ingest:** Ingen direkt.

**Förorening:** **Låg** — minskar felcitat.

**MVP:** Server-side cutoff i `fetchKampsparEvidenceAnn`; UI-meddelande när 0 chunks passar.

---

### 2. Citation-only-läge (LLM av)

**Problem:** LLM kan parafrasera utanför källtext trots whitelist.

**Retrieval:** Nytt läge: returnera top-N chunks + excerpts utan genererat svar.

**Ingest:** Ingen.

**Förorening:** **Mycket låg** — bästa anti-hallucination.

**MVP:** Toggle i `KnowledgeVaultChat`: "Visa bara källor".

---

### 3. "Ska det sparas?"-wizard före ingest

**Problem:** Användare laddar upp känsligt/bevismaterial till fel silo (Minne vs Valv).

**Retrieval:** Renare index — färre felklassade dokument.

**Ingest:** Steg: fil → heuristik (bevis/FACT/reflektion) → rekommenderad destination → HITL confirm.

**Förorening:** **Medel→Låg** om DCAP före LLM.

**MVP:** Modal i `KunskapsvalvFileIngest` med tre val: Minne / Valv / Granska senare.

---

### 4. Obligatorisk `content_class` + `bankId` på FACT

**Problem:** LLM-genererad eller okuraterad fakta kan hamna i kampspar.

**Retrieval:** Bättre filter (FACT vs personligt minne).

**Ingest:** Avvisa auto-ingest utan `bankId` eller godkänd seed-tag (`kunskapContentBankGate` utökad).

**Förorening:** **Låg** — hård gate.

**MVP:** Callable-validering + smoke i `smoke:innehall`.

---

### 5. Metadata-sidecar (append-only)

**Problem:** WORM-kropp får inte uppdateras när taggar/kvalitet förbättras.

**Retrieval:** Filtrera/sortera på sidecar (`qualityScore`, `content_class`, `techniqueTags`).

**Ingest:** Ny post i `kampspar_metadata` / `kb_doc_metadata` vid ingest + kurering.

**Förorening:** **Låg** om sidecar aldrig skriver om content.

**MVP:** Sidecar med `sourceRef` + tags; read join i RAG.

---

### 6. Chunking för långa kb_docs

**Problem:** 12k-truncate i `persistKbDoc` tappar kontext; en embedding per doc svag för långa PDF.

**Retrieval:** Multi-chunk ANN med parent docId i citation.

**Ingest:** Server chunk + embed per sektion (sidor/stycke).

**Förorening:** **Medel** — duplicerade chunks kräver dedup.

**MVP:** Chunk collection read-only, parent `kb_docs` docId i citation.

---

### 7. Re-embed / stale embedding job

**Problem:** Poster utan embedding (embed-fail) är osynliga för ANN.

**Retrieval:** Högre recall.

**Ingest:** Nattjobb: hitta `embeddingDim == null`, regenerera.

**Förorening:** **Låg** — samma text, bättre index.

**MVP:** Scheduled function + admin-only trigger.

---

### 8. Inkast → Kunskap batch med FACT-gate

**Problem:** Manuell review av kunskap-routing skalar dåligt.

**Retrieval:** Mer kuraterat index.

**Ingest:** Batch UI + `isKunskapFactApproved` + annars review-kö.

**Förorening:** **Medel** utan gate — **Låg** med gate.

**MVP:** Filter inkast review på `routing=kunskap`.

---

### 9. journal_woven förhandsgranskning

**Problem:** Opt-in finns men användaren ser inte exakt vad som indexeras i Minne.

**Retrieval:** Färre oönskade reflektioner i FACT-queries.

**Ingest:** Preview card före `optIn` → redigerbar summary → synapse.

**Förorening:** **Låg** — explicit consent.

**MVP:** UI i `WeaverApprovalPanel` / ConfirmStep weave-opt-in.

---

### 10. Citation quality signals i UI

**Problem:** Användaren kan inte bedöma hur säker en träff är.

**Retrieval:** Visa rank (#1–#3), distance band (hög/medel/låg), collection.

**Ingest:** Ingen.

**Förorening:** **Låg**.

**MVP:** Badge på `KnowledgeCitationList` — "stark match" / "svag match".

---

### 11. Tidshjul deep link + highlight (förstärk)

**Problem:** Chat → källa kräver manuell letning.

**Retrieval:** Bättre verifierbarhet (läs original).

**Ingest:** Ingen.

**Förorening:** **Låg** — read-only navigation.

**MVP:** `onCitationClick` scroll + highlight (delvis finns).

---

### 12. Keyword fallback när ANN tom

**Problem:** Nya poster utan embed eller ovanliga frågor missar ANN.

**Retrieval:** Deterministisk `title`/`tags` token-match som backup — **endast Kunskap-silo**.

**Ingest:** Ingen.

**Förorening:** **Medel** — begränsa till top 5, markera "textsök".

**MVP:** Fallback i `fetchKampsparEvidenceForQuery` efter ANN=0.

---

### 13. Minneskurator (HITL tag-förslag)

**Problem:** Dålig metadata försämrar retrieval utan att ändra WORM.

**Retrieval:** Bättre filter via sidecar tags.

**Ingest:** AI föreslår taggar/kategori — sparas först efter godkännande (som Vävaren).

**Förorening:** **Medel** — måste sidecar-only, aldrig auto overwrite content.

**MVP:** "Föreslå taggar" på valfri kampspar-rad → HITL.

---

### 14. Drive ingest idempotens + ingest-status UI

**Problem:** `persistKbDocFromDrive` dedupar på `driveFileId` men användaren ser inte status.

**Retrieval:** Undviker dubletter i rank.

**Ingest:** Synlig "redan indexerad" + `createdAt` i AutonomousArchive.

**Förorening:** **Låg**.

**MVP:** Statusrad efter Drive-synapse i UI/notifikation.

---

### 15. EntityProfile som grounding-only (förstärk)

**Problem:** Entity bundle kan feltolkas som bevis i svar.

**Retrieval:** Tydligare separation i prompt + UI footnote.

**Ingest:** Entity profiles append-only (G9) — redan.

**Förorening:** **Medel** om LLM "fyller i" — **Låg** med degraded + citation-only.

**MVP:** UI-text: "Aktörer är metadata, inte bevis" under svar.

---

### 16. Silo-routing guard i chat (`barnenModuleRouteGuard`)

**Problem:** Frågor om barn/Valv i Kunskap-chat ska routas till rätt modul, inte cross-RAG.

**Retrieval:** Ingen cross-read — `moduleRoute` hint (delvis i agent).

**Ingest:** Ingen.

**Förorening:** **Hög** om cross-RAG — **Låg** med deterministisk redirect.

**MVP:** Förstärk `moduleRoute` UX: "Den frågan hör hemma i Barnen/Valv".

---

### 17. Seed import governance (ProfileSeedImport)

**Problem:** Externa AI-paket kan förorena FACT-banken.

**Retrieval:** Endast verifierade seeds sökbara som FACT.

**Ingest:** `external-ai-import-gate` + dirigent + `bankId` per seed.

**Förorening:** **Hög** utan gate — **Låg** med PMIR + register.

**MVP:** Block ingest utan `seed-approved` tag + manifest timestamp.

---

### 18. "Glöm index" / tombstone (metadata only)

**Problem:** WORM kan inte raderas men irrelevanta poster stör retrieval.

**Retrieval:** Exkludera `tombstone: true` i ANN query.

**Ingest:** Sidecar tombstone — **inte** delete WORM (PMIR).

**Förorening:** **Låg** — användaren avindexerar, bevarar audit.

**MVP:** "Dölj från sök" knapp → metadata flag.

---

## Bästa framtida roadmap — tre steg

### Steg 1 — Verifierbar retrieval (låg risk, 4–8 veckor)

**Mål:** Användaren litar på vad som citeras.

| Leverans | Idéer |
|----------|-------|
| Distance gate + quality badges | #1, #10 |
| Citation-only-läge | #2 |
| Tidshjul deep link | #11 |
| Entity grounding copy | #15 |
| Silo redirect UX | #16 |

**Exit:** `smoke:kunskap` + manuell test: inga citat utan whitelist docId.

---

### Steg 2 — Ren ingest & metadata (medel risk, 2–4 månader)

**Mål:** Rätt material i rätt silo med kuraterad metadata.

| Leverans | Idéer |
|----------|-------|
| "Ska det sparas?"-wizard | #3 |
| FACT gate + bankId | #4 |
| Metadata-sidecar + tombstone | #5, #18 |
| journal_woven preview | #9 |
| Inkast kunskap batch | #8 |
| Seed governance | #17 |
| Re-embed job | #7 |

**Exit:** Ingen auto-ingest utan gate; sidecar smoke; INNEHALL-REGISTER sync.

---

### Steg 3 — Skalbar kunskap (högre komplexitet, 4–8 månader)

**Mål:** Långa dokument och kurering utan förorening.

| Leverans | Idéer |
|----------|-------|
| kb_docs chunking + multi-chunk citation | #6 |
| Minneskurator HITL | #13 |
| Keyword fallback | #12 |
| Drive status + archive UX | #14 |

**Exit:** PMIR för chunk-schema; kostnadskontroll embed; YOLO på rules endast read-path.

---

## Absoluta invariants

- **Ingen cross-RAG** mellan Kunskap · Valv · Barnen
- **Bevis** → `reality_vault`; **dagbok** → `journal` (Lager 1); **FACT** → `kampspar`/`kb_docs` med bank-gate
- **Citations** måste matcha `allowed` map — aldrig fri LLM-docId
- **WORM** append-only — metadata via sidecar/tombstone, inte content mutation
- **MåBra/vit** → parafras bank, ingen Kunskap-ingest
- **PMIR** vid `sharedRules.ts`, nya collections, firestore.rules för metadata
