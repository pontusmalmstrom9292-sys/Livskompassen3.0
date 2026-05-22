# Smoke-resultat (Fas 3 + Minne)

**Datum:** 2026-05-21  
**Branch:** `cleanup-phase-1`

## Automatiserade kontroller

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

Manifest: [`docs/specs/incoming/Kampspar-PROFIL-SEED.json`](./specs/incoming/Kampspar-PROFIL-SEED.json) — **47 poster** (profil, diagnos, strategi, barn, coping, metod).

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

**UI (manuell):** Hjärtat → Bevis → PIN → flik **Dossier** → wizard → *Generera låst dossier* → *Ladda ner PDF*.

**Valfri GCP-fix för signed URL:** ge Functions service account `roles/iam.serviceAccountTokenCreator` (self) så `getSignedUrl` fungerar utan base64.

## Kompasser smoke (automatiserat)

Kör: `npm run smoke:compass` (kräver `.env`, Anonymous Auth, deployad `breakDownResponse`).

| Steg | Resultat | Notering |
|------|----------|----------|
| Anonymous Auth | **PASS** | |
| `checkins` WORM create | **PASS** | `compass_day` |
| `breakDownResponse` | **PASS** | `microSteps` array |

**UI (manuell):** `/vardagen` → Kompasser → flikar Morgon/Dag/Kväll, Paralys, KASAM kväll.

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

**UI (manuell):** Hem → Måbra → övning → *Få ett kort svar* på complete-skärmen (opt-in, `#6366F1` bubbla).

## Manuella tester (övriga moduler)

Kör mot lokal `npm run dev` eller [Hosting](https://gen-lang-client-0481875058.web.app).

| # | Test | Förväntat | Status |
|---|------|-----------|--------|
| 1 | Auth | uid i Firebase Auth | **Ej körd** — manuell |
| 2 | Dagbok spara | `journal` post | **Ej körd** |
| 3 | Valv | `reality_vault` post | **Ej körd** |
| 4 | Barnen | `children_logs` | **Ej körd** |
| 5 | Kompasser (UI) | Paralys + KASAM + tids-default | **Ej körd** — backend OK via `smoke:compass` |
| 5b | Måbra (UI) | Symptom-hub → övning → opt-in coach | **Ej körd** — backend OK via `smoke:mabra` |
| 6 | Hamn BIFF | Grey Rock-svar | **Ej körd** |
| 7 | Kunskap RAG (UI) | Svar + citations i chat | **Ej körd** — callables OK via script |
| 8 | Minne ingest (UI) | Tidshjulet visar nod | **Ej körd** — callable OK via script |
| 9 | Hamn → bevis | Original sparas i `reality_vault` | **Ej körd** |
| 10 | Speglar → Hamn | Länk med förifylld text | **Ej körd** — `speglingsMirror` OK via script |
| 11 | Dossier (UI) | Valv → flik Dossier → PDF + hash | **Ej körd** — E2E OK via `smoke:dossier` |
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

## Module plan sync

- [`src/modules/kompis/module_plan.md`](../src/modules/kompis/module_plan.md)
- [`docs/specs/incoming/Kunskap-SPEC.md`](./specs/incoming/Kunskap-SPEC.md)

## G6 — Drive-pipeline (manuellt steg — användaren)

**Källor:** [`DRIVE_AUTOMATION.md`](./DRIVE_AUTOMATION.md), [`GCP-INVENTORY-LATEST.md`](./GCP-INVENTORY-LATEST.md) § Secret Manager  
**Deploy webhook:** **BLOCKERAD** tills secret satt — `NOTIFY_WEBHOOK_SECRET` saknas i Secret Manager (2026-05-21).

| Secret | Status |
|--------|--------|
| `NOTIFY_WEBHOOK_SECRET` | **SAKNAS** (404) |
| `GEMINI_API_KEY` | Finns |

| Del | Status |
|-----|--------|
| `notifyNewFile` deployad | **PASS** (europe-west1) |
| Repo fail-closed | **Klar** — 503/401 när secret bunden |
| Prod idag | POST utan header → **200** (secret ej bunden — redeploy efter secret) |
| E2E Drive → kb_docs | **Ej körd** — kräver secret + Apps Script |

### Steg (ett i taget)

1. `openssl rand -base64 32` — kopiera värdet (spara i lösenordshanterare, inte i git).
2. `firebase functions:secrets:set NOTIFY_WEBHOOK_SECRET` — klistra in värdet.
3. `firebase deploy --only functions:notifyNewFile`
4. Apps Script: uppdatera webhook-header enligt [`DRIVE_AUTOMATION.md`](./DRIVE_AUTOMATION.md).
5. Ladda upp testfil i Drive-mappen → verifiera `kb_docs` + synapse `drive_file_ingested`.
6. Uppdatera tabellen nedan med **PASS/FAIL** och datum.

**kb_docs:** `notifyNewFile` accepterar `ownerId` och `ownerUid` (2026-05-21). Sätt `FIREBASE_OWNER_UID` i Apps Script; uppdatera `sorter.gs` i Apps Script om du inte skickar `ownerId` än.

## Nästa kod-GAP (efter grund-låsning)

| Kommando | Innehåll |
|----------|----------|
| `kör G4` | Kartlägg/avveckla legacy Python RAG (us-central1) — separat session |
| `kör G7` | Implementera `journal_woven` synaps (opt-in → `kampspar`) — separat session |

Se [`Arkiv-GAP-REGISTER.md`](./specs/incoming/Arkiv-GAP-REGISTER.md).

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

