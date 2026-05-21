# Smoke-resultat (Fas 3 + Minne)

**Datum:** 2026-05-21  
**Branch:** `cleanup-phase-1`

## Automatiserade kontroller

| Kontroll | Resultat |
|----------|----------|
| `npm run build` (frontend) | **PASS** (additiv modulbyggplan 2026-05-21) |
| `npm run smoke:valv` | **ny script** — kör manuellt med `.env` |
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
| `embeddingDim` | **null** | Icke-blockerande (samma som Kunskap smoke) |
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
| `embeddingDim` vid ingest | **null** | Embedding API (textembedding-gecko) svarar inte i prod — icke-blockerande |

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

## G6 — Drive-pipeline (read-only verifiering, 2026-05-21)

**Branch:** `gap/g6-drive-verify`  
**Källor:** [`DRIVE_AUTOMATION.md`](./DRIVE_AUTOMATION.md), `functions/src/index.ts` (`notifyNewFile`), `scripts/google-apps-script/sorter.gs`  
**Deploy:** **Ej utförd** — `NOTIFY_WEBHOOK_SECRET` saknas i Secret Manager.

### Secret Manager

| Secret | Status |
|--------|--------|
| `NOTIFY_WEBHOOK_SECRET` | **SAKNAS** (404 — inget secret i projektet) |
| `GEMINI_API_KEY` | Finns (används av andra callables) |

Verifiering: `gcloud secrets list --project=gen-lang-client-0481875058` — endast `GEMINI_API_KEY` (+ legacy django-secrets).  
`firebase functions:secrets:access NOTIFY_WEBHOOK_SECRET` → **404 Not Found**. Värdet exponerades **inte**.

### Function deploy

| Del | Status |
|-----|--------|
| `notifyNewFile` | **Deployad** (v1 HTTPS, `europe-west1`, 256 MiB) |
| Repo-kod fail-closed | **Klar** — 503 om secret saknas i prod, 401 vid fel header |
| Prod-beteende idag | **Avvikelse** — POST utan header → **200** (secret ej bunden / gammal revision) |
| GET | **405** (korrekt) |

**Prod-prober (2026-05-21):**

```text
POST utan X-Livskompassen-Webhook-Secret     → 200  (bör vara 401/503 efter korrekt redeploy)
POST med fel X-Livskompassen-Webhook-Secret  → 200  (bör vara 401)
GET                                          → 405
```

### Repo vs prod (wire-only)

| Del | Repo | Prod / manuellt |
|-----|------|-----------------|
| `sorter.gs` | Klar — default URL `gen-lang-client-0481875058` | Apps Script **ej verifierad** (Script Properties okänd) |
| `notifyNewFile` → `emitSynapse(drive_file_ingested)` | Klar | Anrop når endpoint (200) |
| `documentAgent` / Gemini | Klar i repo | Bakgrundsanalys **ej verifierad** i loggar |
| `kb_docs` persist | Kräver `ownerId` i webhook-body | **Risk:** `sorter.gs` skickar `ownerUid`, handler läser `req.body.ownerId` — persist hoppas över tills fält alignas (separat fix) |
| Firestore efter ingest | Wire-only / idempotent `kb_docs` när `ownerId` finns | **Ej verifierad** E2E |

### Manuella steg (blockerar säker prod)

Kör **i ordning** från projektroten:

```bash
# 1. Generera secret (spara i password manager — committa aldrig)
openssl rand -base64 32

# 2. Sätt Firebase secret (klistra in värdet när CLI frågar)
firebase functions:secrets:set NOTIFY_WEBHOOK_SECRET --project gen-lang-client-0481875058

# 3. Bygg och deploy endast notifyNewFile
cd functions && npm run build && cd ..
firebase deploy --only functions:notifyNewFile --project gen-lang-client-0481875058
```

**Apps Script (samma Google-konto som Drive):**

1. Script Properties: `INBOX_FOLDER_ID`, `VAULT_FOLDER_ID`, `WEBHOOK_SECRET` (= samma som steg 2), valfritt `FIREBASE_OWNER_UID`.
2. Klistra in [`scripts/google-apps-script/sorter.gs`](../scripts/google-apps-script/sorter.gs).
3. Dela Vault-mappen med `gen-lang-client-0481875058@appspot.gserviceaccount.com` (minst Viewer).
4. Kör `createTrigger()` en gång (timtrigger) eller kör `autonomousSorter` manuellt.

**Verifiering efter deploy:**

```bash
curl -X POST "https://europe-west1-gen-lang-client-0481875058.cloudfunctions.net/notifyNewFile" \
  -H "Content-Type: application/json" \
  -H "X-Livskompassen-Webhook-Secret: DITT_SECRET" \
  -d '{"fileId":"DRIVE_FILE_ID","fileName":"test.pdf","mimeType":"application/pdf","ownerId":"FIREBASE_UID"}'

firebase functions:log --only notifyNewFile --project gen-lang-client-0481875058
```

Förväntat: utan header → **401**; utan secret i Functions → **503**; med giltig header → **200** + logg `[File Pipeline]` / synapse.

### G6 sammanfattning

| Kontroll | Resultat |
|----------|----------|
| Kod + docs i repo | **PASS** (wire-only dokumenterad) |
| `NOTIFY_WEBHOOK_SECRET` | **FAIL** — saknas |
| Säker prod-deploy | **BLOCKERAD** — väntar på steg ovan |
| E2E Drive → kb_docs | **Ej körd** — kräver secret + Apps Script + `ownerId`-align |
