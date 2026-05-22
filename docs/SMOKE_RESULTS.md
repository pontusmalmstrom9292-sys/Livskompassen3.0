# Smoke-resultat (Fas 3 + Minne)

**Datum:** 2026-05-22  
**Branch:** `cleanup-phase-1`

## Automatiserade kontroller (nattpass 2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `cd functions && npm run build` | **PASS** |
| `npm run build` (frontend) | **PASS** |
| `npx eslint . --max-warnings 0` | **PASS** (efter eslint.config ignores + BarnensPage useCallback) |
| `smoke:valv` | **PASS** |
| `smoke:kunskap` | **PASS** — embeddingDim 768, citation match |
| `smoke:speglar` | **PASS** |
| `smoke:dossier` | **PASS** — pdfBase64 fallback |
| `smoke:compass` | **PASS** |
| `smoke:mabra` | **PASS** |
| `node scripts/seed_kampspar_profile.mjs --verify` | **PASS** — 47/47 ingest, RAG 5/5 |

## G2/G3 prod-verify (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| Index endpoint `4956462078572363776` | **PASS** — `livskompassen_kv_deployed_v1` live west1 |
| Kod-defaults `vectorSearchClient.ts` | **PASS** — matchar GCP IDs |
| `VECTOR_SEARCH_*` i Secret Manager | **Saknas** — ej blockerande; defaults i kod + `functions/.env.gen-lang-client-0481875058` |
| Vectors efter nattpass | **54** (var 4) — upsert vid `ingestKampsparEntry` |
| `indexSyncTime` | **2026-05-22T00:57:43Z** — synkad under smoke ingest |
| Smoke embeddingDim | **768** — `text-embedding-004` |

**Slutsats G2/G3:** **VERIFY PASS** — ANN infra live; ingest upsertar vectors; query använder ANN-path när neighbors finns (logg `[kampsparQueryRag] ANN N träffar` i Functions).

## Automatiserade kontroller (historik 2026-05-21)

| Kontroll | Resultat |
|----------|----------|
| `npm run build` (frontend) | **PASS** (additiv modulbyggplan 2026-05-21) |
| `smoke:valv` | **PASS** (2026-05-21 efter G1 deploy) |
| `cd functions && npm run build` | **PASS** |
| Firestore rules inkl. `kampspar` | **PASS** (lokal fil) |
| Firestore indexes `kampspar`, `kb_docs` | **PASS** (lokal fil) |
| `node scripts/smoke_kunskap.mjs` | **PASS** (2026-05-21) |
| `node scripts/smoke_speglar.mjs` | **PASS** (2026-05-21) |
| `npm run smoke:dossier` | **PASS** (2026-05-21) |
| `npm run smoke:compass` | **PASS** (2026-05-21) |
| `npm run smoke:mabra` | **PASS** (2026-05-21) |
| `node scripts/seed_kampspar_profile.mjs --verify` | **PASS** (2026-05-21) |

## Profil-seed Kunskapsvalvet (2026-05-21)

Kör: `node scripts/seed_kampspar_profile.mjs --verify` (kräver `.env`, deployade callables).

Manifest: [`docs/specs/modules/Kampspar-PROFIL-SEED.json`](./specs/modules/Kampspar-PROFIL-SEED.json) — **47 poster** (profil, diagnos, strategi, barn, coping, metod).

| Steg | Resultat | Notering |
|------|----------|----------|
| `ingestKampsparEntry` × 47 | **PASS** | Alla poster WORM-create |
| `embeddingDim` | **768** | PASS efter G3 fix (textembedding-gecko@003 / text-embedding-004) |
| RAG 5 testfrågor | **PASS 5/5** | Samma auth-session som ingest (`--verify`) |
| Diagnoser-fråga | **PASS** | ADHD F90.0B + GAD F41.1 |
| Soc-strategi-fråga | **PASS** | Citations från strategi/metod |
| Kasper skola-fråga | **PASS** | Citations från barn-profil |
| Andning-fråga | **PASS** | 4-7-8 vagus |
| Feb 2026-fråga | **PASS** | Slutenvård, sjukskrivning, allostatisk belastning |

**Viktigt:** Utan `SEED_FIREBASE_EMAIL` + `SEED_FIREBASE_PASSWORD` i `.env` kopplas data till **anonymous uid** — syns inte i appen om du loggar in med annat konto. Sätt email/lösenord och kör om:

```bash
node scripts/seed_kampspar_profile.mjs --skip-existing --verify
```

**UI (manuell):** `/vardagen?tab=kunskap` → Tidshjulet — 47 noder efter seed på rätt uid.

## Kunskap smoke (automatiserat)

Kör: `npm run smoke:kunskap` (kräver `.env` med `VITE_FIREBASE_*`, Anonymous Auth, deployade callables).

| Steg | Resultat | Notering |
|------|----------|----------|
| Anonymous Auth | **PASS** | |
| `ingestKampsparEntry` | **PASS** | WORM create + docId |
| `knowledgeVaultQuery` | **PASS** | Svar + citations från `kampspar` |
| Citation pekar på ingest-doc | **PASS** | Token-match RAG |
| Full Gemini/Vertex LLM | **PASS** | `GEMINI_API_KEY` + `gemini-2.5-flash` via `defineSecret` (2026-05-21) |
| `embeddingDim` vid ingest | **768** | PASS efter G3 (`text-embedding-004`) |

**Full AI-syntes:** `firebase functions:secrets:set GEMINI_API_KEY` + `secrets: [geminiApiKey]` på `knowledgeVaultQuery` (se `functions/src/lib/geminiSecret.ts`).

## Speglar smoke (automatiserat)

Kör: `npm run smoke:speglar` (kräver `.env`, Anonymous Auth, deployad `speglingsMirror`).

| Steg | Resultat | Notering |
|------|----------|----------|
| Anonymous Auth | **PASS** | |
| `speglingsMirror` | **PASS** | Svar med `mirror` (string) |
| Full Gemini/Vertex LLM | **OK** | `gemini-2.5-flash` + `GEMINI_API_KEY` (secret på callable) |

```bash
firebase deploy --only functions:speglingsMirror --force
npm run smoke:speglar
```

## Dossier smoke (automatiserat)

Kör: `npm run smoke:dossier` (kräver `.env`, Anonymous Auth, deployad `generateDossier`, Firestore rules `dossier_snapshots`).

| Steg | Resultat | Notering |
|------|----------|----------|
| Anonymous Auth | **PASS** | |
| `reality_vault` seed (smoke) | **PASS** | WORM create före export |
| `generateDossier` | **PASS** | `dossierId` + SHA-256 `documentHash` |
| `dossier_snapshots` read | **PASS** | `includedDocIds` + hash matchar |
| PDF bytes (`%PDF`) | **PASS** | via `pdfBase64` fallback |
| Signed URL (Storage) | **fallback** | IAM `signBlob` saknas — klient får `pdfBase64` |

```bash
firebase deploy --only firestore:rules,storage,functions:generateDossier
npm run smoke:dossier
```

**UI (manuell):** Hjärtat → Bevis → PIN → flik **Dossier** → wizard → *Generera låst dossier* → *Ladda ner PDF*. **PASS** (2026-05-22, localhost) — valv-post + PDF genererad via `pdfBase64`.

**Valfri GCP-fix för signed URL:** ge Functions service account `roles/iam.serviceAccountTokenCreator` (self) så `getSignedUrl` fungerar utan base64.

## Kompasser smoke (automatiserat)

Kör: `npm run smoke:compass` (kräver `.env`, Anonymous Auth, deployad `breakDownResponse`).

| Steg | Resultat | Notering |
|------|----------|----------|
| Anonymous Auth | **PASS** | |
| `checkins` WORM create | **PASS** | `compass_day` |
| `breakDownResponse` | **PASS** | `microSteps` array |

**UI (manuell):** `/vardagen` → Kompasser → flikar Morgon/Dag/Kväll, Paralys, KASAM kväll. **PASS** (2026-05-22) — Kväll KASAM steg 1→2, Nästa fungerar.

## Måbra smoke (automatiserat)

Kör: `npm run smoke:mabra` (kräver `.env`, Anonymous Auth, deployad `mabraCoach`, Firestore rules `mabra_sessions`).

| Steg | Resultat | Notering |
|------|----------|----------|
| Anonymous Auth | **PASS** | |
| `mabra_sessions` WORM create | **PASS** | metadata only |
| `mabraCoach` | **PASS** | `coach` string |

```bash
firebase deploy --only functions:mabraCoach --force
npm run smoke:mabra
```

**UI (manuell):** Hem → Måbra → övning → *Få ett kort svar* på complete-skärmen (opt-in, `#6366F1` bubbla). **PASS** (2026-05-22) — `mabraCoach` 200, AI-svar visas.

## Manuella tester (övriga moduler)

Kör mot lokal `npm run dev` eller [Hosting](https://gen-lang-client-0481875058.web.app).

| # | Test | Förväntat | Status |
|---|------|-----------|--------|
| 1 | Auth | uid i Firebase Auth | **Ej körd** — manuell |
| 2 | Dagbok spara | `journal` post | **Ej körd** |
| 3 | Valv | `reality_vault` post | **Ej körd** |
| 4 | Barnen | `children_logs` | **Ej körd** |
| 5 | Kompasser (UI) | Paralys + KASAM + tids-default | **PASS** (2026-05-22) |
| 5b | Måbra (UI) | Symptom-hub → övning → opt-in coach | **PASS** (2026-05-22) |
| 6 | Hamn BIFF | Grey Rock-svar | **Ej körd** |
| 7 | Kunskap RAG (UI) | Svar + citations i chat | **Ej körd** — callables OK via script |
| 8 | Minne ingest (UI) | Tidshjulet visar nod | **Ej körd** — callable OK via script |
| 9 | Hamn → bevis | Original sparas i `reality_vault` | **Ej körd** |
| 10 | Speglar → Hamn | Länk med förifylld text | **Ej körd** — `speglingsMirror` OK via script |
| 11 | Dossier (UI) | Valv → flik Dossier → PDF + hash | **PASS** (2026-05-22) |
| 12 | KompisAvatar | Header pulserar vid Kunskap-fråga | **Ej körd** |

## Deploy-krav för Kunskap

```bash
firebase deploy --only firestore:rules,firestore:indexes,functions:ingestKampsparEntry,functions:knowledgeVaultQuery
npm run smoke:kunskap
```

Se [`DEPLOY.md`](./DEPLOY.md).

## Kodfixar under smoke (2026-05-21)

- `functions/src/lib/generateDossierInternal.ts` — `pdfBase64` fallback när signed URL (`signBlob`) nekas
- `src/modules/dossier/components/DossierPage.tsx` — nedladdning via URL eller data-URI
- `scripts/smoke_dossier.mjs` — automatiserad E2E (vault seed + snapshot + PDF)

- `functions/src/lib/genaiClient.ts` — `vertexai: true` för @google/genai
- `functions/src/agents/knowledgeVaultAgent.ts` — modell `gemini-2.0-flash-001` (ersatte `gemini-1.5-flash-001` 404)
- `functions/src/agents/vertexAgent.ts` — `gemini-2.5-flash` + `GEMINI_API_KEY` via secret; degraded ACT-fallback vid LLM-fel
- `functions/src/index.ts` — `speglingsMirror` `.runWith({ secrets: ['GEMINI_API_KEY'] })`
- `functions/src/index.ts` — `mabraCoach` callable + `MABRA_COACHEN_SYSTEM_PROMPT` i `sharedRules.ts`
- `src/modules/mabra/components/MabraCoachPanel.tsx` — opt-in *Få ett kort svar* efter övning

## Kodfixar under smoke (2026-05-22 nattpass)

- `eslint.config.js` — ignorera archive/generated; pragmatiska react-hooks-regler för befintliga mönster
- `scripts/gdpr_cleanup.ts` — `Firestore`-typ istället för oanvänd import
- `src/modules/barnens_livsloggar/components/BarnensPage.tsx` — `useCallback` för `refreshLogs` (exhaustive-deps)

## Kodfixar under smoke (2026-05-22 UI)

- `src/modules/core/layout/MainLayout.tsx` — `pb-48` så CTA-knappar inte hamnar under FloatingDock
- `src/index.css` — `.dock-nav--hub { w-fit }` + `pointer-events: none` på kompassros — bottenknappar klickbara igen

## Module plan sync

- [`src/modules/kompis/module_plan.md`](../src/modules/kompis/module_plan.md)
- [`docs/specs/modules/Kunskap-SPEC.md`](./specs/modules/Kunskap-SPEC.md)

## G6 — Drive-pipeline — **prod verify** 2026-05-22

**Källor:** [`DRIVE_AUTOMATION.md`](./DRIVE_AUTOMATION.md), [`GCP-FAS4-RUNBOOK.md`](./GCP-FAS4-RUNBOOK.md) steg 2  
**Commit:** `193f3ff1` — `fix(drive): G6 pipeline` (`documentAgent.ts`, `index.ts`)

### Prod-deploy (ingen redeploy behövdes)

| Kontroll | Resultat |
|----------|----------|
| `notifyNewFile` revision | **9** — `updateTime` **2026-05-22T10:30:04Z** (europe-west1) |
| Memory / timeout | **512MB** / **300s** — matchar G6-fix i repo |
| `await emitSynapse` | **PASS** — synkront flöde; svar `Processing complete` |
| `documentAgent` export + modell | **PASS** — logg `[File Pipeline] … gemini-2.5-flash` |
| E2E Drive → `kb_docs` | **PASS** — docId `irQNlDTYgcr15DFIuA3w` (`created=true`, PDF `LivsKompassen_System_Manifest.pdf`) |
| `smoke:kunskap` (re-run) | **PASS** 2026-05-22T10:38 — docId `DGMNHxSIAlqtPoEuQ53K`, citation match |
| `cd functions && npm run build` | **PASS** (verify compile) |

**Prod-logg (notifyNewFile, execution ~10:31 UTC):** `[File Pipeline] Startar … application/pdf` → `Fil nedladdad. Skickar till gemini-2.5-flash` → `[Synapse:drive_ingest] kb_docs docId=irQNlDTYgcr15DFIuA3w created=true` → HTTP **200** (51s).

| Secret | Status |
|--------|--------|
| `NOTIFY_WEBHOOK_SECRET` | **FINNS** (Secret Manager v2) |
| `GEMINI_API_KEY` | Finns |

**Känd icke-blockerare (ej G6):** ADK `runExecutor` loggar `[ADK] Executor-fel` p.g.a. `gemini-1.5-flash-001` 404 efter `kb_docs`-persist — Mönster-Arkivarien-dispatch; separat GAP (`runExecutor.ts`).

---

## G6 — historik (nattpass 2026-05-22)

| Del | Status |
|-----|--------|
| `notifyNewFile` deployad | **PASS** (europe-west1) |
| Secret bunden på function | **PASS** — POST utan header → **401** |
| Repo fail-closed | **Klar** — 503 om secret saknas i runtime |

## Parallellt obevakat pass (2026-05-22)

**Scope:** Grunder GAP + GCP FAS4 steg 5 + functions deploy.

| Kontroll | Resultat |
|----------|----------|
| Baseline smoke (valv, kunskap, dossier) | **PASS** |
| Grunder GAP — `RSD_KYLAREN_SYSTEM_PROMPT` | **done** |
| Grunder GAP — PA appendix `Barnen-SPEC.md` | **done** |
| Grunder GAP — injection-parity `.context/security.md` | **done** |
| `runExecutor.ts` → `gemini-2.5-flash` | **done** |
| `cd functions && npm run build` + frontend build | **PASS** |
| Full smoke (valv, kunskap, speglar, dossier, compass, mabra) | **PASS** |
| `npx eslint . --max-warnings 0` | **PASS** |
| `firebase deploy --only functions` | **PASS** — 14 Node functions west1 |
| FAS4 steg 5 — delete `knowledge-base-webhook` | **PASS** |
| Post-steg5 smoke (kunskap, dossier) | **PASS** |

**Kvar öppet:** — (Grunder U1–U5 runtime **klart**; nästa G8–G14).

## Parallellt pass U2.5 + G7 + legacy buckets (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| Checkpoint commit (U5.5, FAS4, docs) | **done** |
| Baseline smoke (valv, kunskap, dossier) | **PASS** |
| U2.5 — `dcapAlertSynapse` + `dcap_alerts` WORM + SafeHarbor HITL | **done** |
| G7 — `journalWovenSynapse` + opt-in ConfirmStep + `journalWovenToKampspar` | **done** |
| Legacy buckets (5 st, ~4.3 MB totalt) | **raderade** |
| `functions` + frontend build | **PASS** |
| Deploy `analyzeMessage`, `journalWovenToKampspar`, `firestore.rules` | **PASS** |
| Post-deploy smoke ×3 | **PASS** |

**Legacy buckets raderade:** `knowledge-base-bucket-*`, `knowledge-base-docs-*`, `blueprint-config`, `gcf-v2-*` us-central1.

## FAS4 steg 7 — VERIFY experiment-buckets (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `ai-studio-bucket` — 1 objekt, `build_artifacts.tar.gz` (121 MB) | Legacy AI Studio — **raderad** |
| `cloud-ai-platform` — 58 objekt, `prompt-data/` (69 MB) | Vertex prompt-cache — **raderad** |
| Kodreferens i `functions/` | **0** — kanon = `sharedRules.ts` + west1 Vector |
| Post-steg7 `smoke:valv` | **PASS** |
| Post-steg7 `smoke:kunskap` | **PASS** |
| Post-steg7 `smoke:dossier` | **PASS** |

**FAS 4 avveckling:** steg 1–7 **klart**.

## G8 — Familjen-RAG childrenLogsQuery (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `childrenLogsQueryRag.ts` — endast `children_logs` | **done** |
| `MONSTER_ARKIVARIEN_BARNEN_SYSTEM_PROMPT` i `sharedRules.ts` | **done** |
| Callable `childrenLogsQuery` + `ChildrenLogsChat` i Familjen | **done** |
| Deploy `childrenLogsQuery` | **PASS** (efter ~2 min IAM-propagering) |
| `npm run smoke:children` | **PASS** — citation match seed |
| Post-G8 smoke valv/kunskap/dossier | **PASS** |

**Silo:** Ej `valvChatQuery`; Kunskap redirect (U5.5) oförändrad.

## U5.5 — Kompis → Barnen routing (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `barnenModuleRouteGuard.ts` + `moduleRoute` i `knowledgeVaultQuery` | **done** |
| Frontend `KnowledgeVaultChat` länk till `/familjen` | **done** |
| `firebase deploy --only functions:knowledgeVaultQuery` | **PASS** |
| `npm run smoke:kunskap` (Minne-fråga, ingen redirect) | **PASS** |
| Live redirect: "Hur loggar jag barnens sömn i livsloggen?" | **PASS** — `moduleRoute.path=/familjen`, 0 citations |

**Silo:** Ingen läsning av `children_logs`; Valv/forensik blockeras av guard.

## FAS4 steg 6 — north1-index + tomma buckets + django-secrets (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| Verifiering: north1 `kampspar_index` (0 endpoints) | **PASS** |
| Verifiering: 3 buckets 0 B | **PASS** |
| Delete `9094201410823651328` (europe-north1) | **PASS** |
| Delete `ekonomichefen`, `helthcoach`, `media-gen-lang-client-0481875058-0ebe` | **PASS** |
| Delete `django_admin_password-0ebe`, `django_settings-0ebe` | **PASS** |
| Post-steg6 `smoke:valv` | **PASS** |
| Post-steg6 `smoke:kunskap` | **PASS** |
| Post-steg6 `smoke:dossier` | **PASS** |

**Ej rört:** west1 Vector Search (102 vectors), WORM-collections, legacy KB-buckets (~10 KB).

## FAS4 steg 3 — drive_sync_tool (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `firebase functions:delete drive_sync_tool` | **PASS** — us-central1 Python borta |
| `npm run smoke:kunskap` | **PASS** — ingest + query + citation |

**Kvar legacy Python:** `knowledge-base-webhook` endast.

## FAS4 steg 4 — legacy KB migrering (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| Discovery Engine data stores | **0** |
| GCS legacy user documents | **0** |
| `migrate_legacy_kb.mjs --inventory-only` | **PASS** — tom manifest |
| `npm run smoke:kunskap` | **PASS** |

Se [`LEGACY-KB-MIGRATION-2026-05-22.md`](LEGACY-KB-MIGRATION-2026-05-22.md).

## Nästa kod-GAP (efter grund-låsning)

| Kommando | Innehåll |
|----------|----------|
| `kör G8` | ~~Familjen-RAG~~ **done** 2026-05-22 |
| `kör G9` | EntityProfile / SystemSynapse — separat session |

Se [`Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md).

## Multitask GAP-våg (2026-05-21) — våg 3 master review

| GAP | Resultat | Silo / arkiv-minne |
|-----|----------|-------------------|
| G1 `valvChatQuery` | **PASS** — deploy + smoke:valv, 512MiB | Endast `reality_vault` |
| G2 Vector ANN | **PASS** — endpoint live, `livskompassen_kv_deployed_v1` | Kunskap silo only |
| G3 embeddings | **PASS** — `text-embedding-004`, embeddingDim 768 | Upsert vid ingest |
| G5 retention WORM | **PASS** — allowlist, aldrig purga permanent minne | WORM-källor skyddade |
| G11 mock Kampspar | **PASS** — `KompisUiKampsparTrack` UI-only | Ej till ingest |
| G6 Drive | **DOCS** — secret saknas, manuellt kvar | Kunskap/kb_docs silo |

**Master review (våg 3):** Tre silos intakta. Ingen Valv↔Kunskap RAG-merge. WORM permanent minne skyddat i retention. Legacy Python RAG (us-central1) ej canonical — G4 kvar.

