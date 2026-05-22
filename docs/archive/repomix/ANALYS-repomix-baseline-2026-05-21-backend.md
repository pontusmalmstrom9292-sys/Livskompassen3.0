# ANALYS — repomix-baseline-2026-05-21-backend.md

**Källa:** Genererad baseline från aktivt repo (`functions/`, `.context/`, `docs/specs/`).  
**Jämfört mot:** GCP [`GCP-INVENTORY-2026-05-21.md`](../GCP-INVENTORY-2026-05-21.md), archive [`walkthrough.md`](../walkthrough.md), [`legacy-system-plan.md`](../legacy-system-plan.md).

---

## Finns i baseline/repo men SAKNAS eller delvis i molnet

| Post | Repo | GCP live |
|------|------|----------|
| `valvChatQuery` | `functions/src/index.ts` | **Ej deployad** |
| Vector ANN i `kampsparQueryRag` | Token-match only | 2 index, 0 endpoints, env saknas |
| `driveIngestSynapse` → `kb_docs` | Kod klar | `notifyNewFile` deployad; Apps Script okänd |
| `EntityProfile` / `SystemSynapse` Firestore | `firebase-blueprint.json` | **Ej implementerat** i app-kod |
| Context Cache (`vertexCache.ts`) | Finns i repo | Deploy-status okänd |

---

## Finns i molnet men SAKNAS i aktiv repo

| Post | GCP | Repo |
|------|-----|------|
| `knowledge-base-webhook` | us-central1 python312 | **Ej i functions/src** |
| `drive_sync_tool`, `biff_generator_tool`, `brusfiltret_tool` | us-central1 python311 | **Ej i functions/src** |
| `livskompassen-kv-index` (west1 STREAM) | Skapat 2026-05-17 | Repo pekar på north1 `kampspar_index` i skript |
| Google Solution buckets | knowledge-base-* | Drive pipeline i repo = `notifyNewFile` + Node |

**Rekommendation:** Dokumentera legacy Python-stack som **avvecklas eller migreras** — undvik dubbel ingest till olika RAG-system.

---

## Finns i archive/walkthrough men INTE i baseline (historisk vision)

| Post | walkthrough/legacy | Nuvarande repo |
|------|-------------------|----------------|
| "Fas 2 & 3 slutförda" (Vector + DCAP + Retention live) | Påstått klart | Vector stub; retention path `users/{uid}/kampspar` ≠ top-level `kampspar` |
| `Gräns-Arkitekten` agent card | walkthrough | Ej i `functions/src/agents/cards/` |
| Cloud Run Jobs 24h analys | `architecture.md` | Planerat, ej wired |

---

## MOTSÄGELSER (farliga)

| # | Konflikt | Låst beslut |
|---|----------|-------------|
| M1 | walkthrough säger Vector Search live; kod + GCP säger stub + inga endpoints | **GCP + kod sanning** — wire eller uppdatera docs |
| M2 | `kampsparRag.ts` (Vävaren) läser `journal` + `reality_vault` + `kampspar` | **Tre silor:** Vävaren får läsa för metadata — **inte** samma som Kunskap-RAG UI |
| M3 | Legacy Python RAG + Node RAG båda deployade | **En kanonisk pipeline** — Node `kampspar`/`kb_docs` |
| M4 | GCS WORM bucket 30d retention vs "aldrig glömma" | Firestore WORM = permanent; GCS bucket ≠ primär sanning |

---

## Låsta beslut att bevara

1. Tre kunskapsytor (`arkitektur-beslut.md` §1.5) — blanda aldrig Valv-Chat RAG med Kunskap.
2. WORM Firestore för `children_logs`, `reality_vault`, `journal`, `dossier_snapshots`.
3. Prompts endast i `sharedRules.ts`.
4. Trauma/opt-in för manuell `kampspar`-ingest (Kladd §H).
5. **`livskompassen-kv-index` (west1)** eller **`kampspar_index` (north1)** — välj **en** kanonisk region/index vid wire (GAP G2).

---

## Planerat som inte får glömmas

- Smart arkiv / självsortering (Kunskap-SPEC §12)
- Entity recognition / aktörer
- `journal_woven` synaps
- Familjen-frågor via Mönster-Arkivarien (inte Valv-Chat)
- Dossier som samlad export över hela historiken
- Vector Search + Context Caching när endpoint deployad

---

## Väntar på användare

Ladda upp fler Repomix från Google Drive (okända datum OK) till `docs/archive/repomix/` — en fil per Agent-session för diff mot denna baseline.
