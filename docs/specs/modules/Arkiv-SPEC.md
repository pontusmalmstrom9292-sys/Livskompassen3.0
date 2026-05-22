# Arkiv-SPEC — Hela arkivet / Kunskapsvalvet / Life OS-minne

**Källa:** Femvägs-merge — repo + GCP + alla Repomix-analyser (2026-05-21).  
**Canonical:** [`.context/arkiv-minne.md`](../../.context/arkiv-minne.md)  
**Konsolidering:** [`KONSOLIDERING-2026-05-21.md`](../archive/repomix/KONSOLIDERING-2026-05-21.md)

---

## 1. Syfte och användarbehov

Hela arkivet är Livskompassens **koordinerade långtidsminne** över moduler — så användaren kan fråga, exportera och bevisa utan att data glöms eller silor blandas. Kunskapsvalvet (`kampspar` + `kb_docs`) är **ett** lager; Valv, Barnen och Dossier är **skilda** med dokumenterade broar.

## 2. Route och ingång

| Yta | Route |
|-----|-------|
| Kunskapsvalvet | `/vardagen?tab=kunskap` |
| Tidshjulet | samma flik |
| Valv-Chat | `/dagbok?tab=bevis` → Sök (efter PIN) |
| Dossier (samlad export) | `/dossier` |

## 3. UX-flöde

- **Kunskap:** fråga → citations från egna poster; ingest manuellt eller via Drive.
- **Valv-Chat:** forensisk fråga — endast bevis.
- **Barnen:** logga → Dossier för PDF över valfri period (inte Valv-Chat idag).
- Progressive disclosure: ett steg i taget i UI; arkitektur dokumenterad per modul-README § Minne / AI.

## 4. Visuell design

Obsidian Calm. Tidshjulet = historiska noder. AI-accent `#6366F1` vid synapser (Speglar/Kompis). Ingen natur-UI.

## 5. Datamodell

| Collection | WORM | RAG-silo |
|------------|------|----------|
| `kampspar` | create-only | Kunskap |
| `kb_docs` | create-only | Kunskap |
| `reality_vault` | create-only | Valv-Chat |
| `children_logs` | create-only | Dossier read |
| `journal` | create-only | Vävaren read-only context |
| `dossier_snapshots` | create-only | export metadata |

**Kunskapsbank (blueprint):** `KnowledgeFolder` / `KnowledgeDoc` → mappas till `kb_docs` + Drive metadata.

**GCP (2026-05-21):** Vector index `livskompassen-kv-index` (west1), `kampspar_index` (north1); embeddings buckets `livskompassen-knowledge-vault-*`.

## 6. Backend / agenter

| Callable | Agent | Data |
|----------|-------|------|
| `knowledgeVaultQuery` | Livs-Arkivarien | `kampspar`, `kb_docs` |
| `ingestKampsparEntry` | — | `kampspar` WORM |
| `valvChatQuery` | Sannings-Analytikern | `reality_vault` (**deploy saknas**) |
| `notifyNewFile` | → `driveIngestSynapse` | `kb_docs` |
| `generateDossier` | — | aggregerar valda källor |
| `weaveJournalEntry` | Vävaren | → `reality_vault` metadata |

Synapser: [`functions/src/adk/synapses/synapseBus.ts`](../../functions/src/adk/synapses/synapseBus.ts).

## 7. Säkerhet

- AuthGate på Kunskap-fliken.
- Tre silor — MUST NOT cross-RAG.
- Trauma/opt-in manuell ingest (Kladd §H).
- **Ingen hårdkodad Vault-PIN** — Firebase Auth (repomix hade `6469`).
- **Prompts endast** `sharedRules.ts` — aldrig klient/Express (repomix monolit).
- CMEK: `gs://livskompassenv2`, KMS keyring i scripts.
- Retention job: får **inte** radera WORM-källor (`children_logs`, `reality_vault`, `journal`).

## 8. Status idag vs planerat

| Område | Status |
|--------|--------|
| Token-match Kunskap RAG | **klart** (smoke PASS) |
| Profil-seed 47 poster | **klart** |
| `GEMINI_API_KEY` syntes | **klart** |
| Vector Search ANN | **planerat** — index finns, endpoint + wire saknas (G2) |
| Embeddings live | **planerat** — `embeddingDim` often null (G3) |
| `valvChatQuery` deploy | **planerat** — kod finns (G1) |
| Legacy Python RAG (us-central1) | **motsägelse** — avveckla (G4) |
| Mock `Kampspar`-typ vs `KampsparEntry` | **risk** — isolera (G11) |
| Context Cache (`vertexCache.ts`) | **repo only** — delad registry planerat (G12) |
| Familjen naturligt språk | **planerat** (G8) |
| SystemSynapse Firestore | **planerat** (G9) |
| Tidshjulet → `kampspar`-historik | **planerat** (G13) |
| Gräns-Arkitekten agent card | **obeslutat** (G14) |

## 9. Acceptanskriterier

1. `knowledgeVaultQuery` returnerar endast `kampspar`/`kb_docs` citations.
2. `valvChatQuery` returnerar endast `reality_vault` citations (efter deploy).
3. WORM rules block update/delete på WORM-källor.
4. Dossier genererar PDF + hash för valda källor över valfri period.
5. Efter Vector wire: top-k ANN ≤ 12 chunks, fallback token-match.
6. Retention rör inte `children_logs`, `reality_vault`, `journal`.

## 10. Kopplingar till andra moduler

Se tabell i `.context/arkiv-minne.md`. Dossier = närmast "glömmer aldrig + PDF". Kunskap ≠ hela arkivet.

## 11. Navigation

Kunskap under Vardagen-kluster. Valv-Chat under Hjärtat/Bevis. Dossier via Fyren. Ingen egen dock-ikon för Minne.

---

## Appendix A — RAG

Se skill `.cursor/skills/livskompassen-rag-retrieval/SKILL.md`.

## Appendix B — Vector Search

Index IDs i [`GCP-INVENTORY-2026-05-21.md`](../archive/GCP-INVENTORY-2026-05-21.md). Endpoint deploy = GAP G2.

## Appendix C — Synapser

`drive_ingest` live. `journal_woven`, `dcap_alert` stub.

## Appendix D — GAP-register

[`Arkiv-GAP-REGISTER.md`](./Arkiv-GAP-REGISTER.md)

## Appendix E — Legacy schema (repomix)

| Repomix | Kanon | Action |
|---------|-------|--------|
| `vault` | `reality_vault` | Migrerat i repo |
| `kids_records` | `children_logs` | Migrerat i repo |
| `diary` | `journal` | Migrerat i repo |
| `synapses` (Firestore) | ADK SynapseBus | Omstrukturerat |
| Vertex AI Search DS | Vector Search ANN | **En pipeline** — repo Node + west1 index |

**Förbjudet från repomix:** `SuperArchive` → `kb_docs` för bevis; UI Silo 3 (ex-partner) ≠ Barnen-silo.

## Appendix F — Repomix-källor (read-only)

| Analys | Värde |
|--------|-------|
| [`ANALYS-repomix-baseline-2026-05-21-backend.md`](../archive/repomix/ANALYS-repomix-baseline-2026-05-21-backend.md) | Backend-baseline |
| [`ANALYS-repomix-output.txt.md`](../archive/repomix/ANALYS-repomix-output.txt.md) | UI-terminologiursprung |
| [`ANALYS-repomix-output.xml.md`](../archive/repomix/ANALYS-repomix-output.xml.md) | Historisk monolit + silo-brott |
| [`ANALYS-Copy of Repomix från cursor.txt.md`](../archive/repomix/ANALYS-Copy%20of%20Repomix%20fr%C3%A5n%20cursor.txt.md) | Express-monolit, modul-ursprung |
| [`KONSOLIDERING-2026-05-21.md`](../archive/repomix/KONSOLIDERING-2026-05-21.md) | Låsta beslut + GAP-sammanfattning |
