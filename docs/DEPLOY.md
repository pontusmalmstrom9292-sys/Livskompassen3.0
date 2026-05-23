# Deploy (Livskompassen2.0)

Kanonisk rot: `Livskompassen2.0/` (inte `StudioProjects/`).

Firebase-projekt: `gen-lang-client-0481875058`  
Region (Functions): `europe-west1`

## Förutsättningar

1. `.env` i projektroten med alla `VITE_FIREBASE_*` från [Firebase Console → Project settings](https://console.firebase.google.com/project/gen-lang-client-0481875058/settings/general).
2. Firebase CLI inloggad: `firebase login` och `firebase use gen-lang-client-0481875058`.
3. **Authentication → Anonymous** aktiverad i Firebase Console.

## Bygg (lokalt)

```bash
cd Livskompassen2.0
cd functions && npm run build && cd ..
npm run build
```

## Deploy — Firestore + Storage + modul-Functions

```bash
cd Livskompassen2.0
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only storage
firebase deploy --only functions:analyzeMessage,functions:invalidateSession,functions:generateEmbedding,functions:ingestKampsparEntry,functions:knowledgeVaultQuery,functions:valvChatQuery,functions:scheduledRetentionJob,functions:weaveJournalEntry,functions:speglingsMirror,functions:generateDossier --force
```

**Hjärtat (Speglar):** `speglingsMirror` måste deployas för AI-spegling i prod.

**Storage:** `storage.rules` krävs för valv-media (`vault_evidence/{uid}/**`).

**Första gången:** Aktivera Storage i [Firebase Console → Storage](https://console.firebase.google.com/project/gen-lang-client-0481875058/storage) (*Get Started*), välj region (t.ex. `europe-west1`), sedan:

```bash
firebase deploy --only storage
```

Utan aktiverad Storage + deploy misslyckas skärmdump-uppladdning i prod.

Valfritt i samma körning (redan i repo, ej kritisk för hjärtat): `breakDownResponse`, `getAgentRegistry`, `generateDossier`.

**Dossier smoke:** `npm run smoke:dossier` efter deploy av `functions:generateDossier`. Om signed URL failar i loggar: Functions service account behöver `iam.serviceAccounts.signBlob` — appen faller tillbaka till `pdfBase64` i svaret.

**Obs:** En full deploy `firebase deploy --only functions` inkluderar `notifyNewFile`, som kräver secret (se nedan).

**Kunskap / Gemini:** Projektet `gen-lang-client-*` har ofta **ingen** Vertex Publisher-modellåtkomst (404 i loggar). RAG-fallback fungerar utan LLM. För full syntes:

```bash
# 1) Skapa nyckel på https://aistudio.google.com/apikey (server-only, aldrig VITE_*)
firebase functions:secrets:set GEMINI_API_KEY

# 2) I functions/src/index.ts — lägg till secrets på knowledgeVaultQuery:
#    { region: 'europe-west1', secrets: ['GEMINI_API_KEY'] }

firebase deploy --only functions:knowledgeVaultQuery
npm run smoke:kunskap
```

### `notifyNewFile` (Drive-webhook)

Kräver secret innan deploy:

```bash
# Generera värde (spara i password manager — committa aldrig)
openssl rand -base64 32

# Interaktivt — klistra in värdet när CLI frågar
firebase functions:secrets:set NOTIFY_WEBHOOK_SECRET

firebase deploy --only functions:notifyNewFile
```

Samma värde ska sättas som `WEBHOOK_SECRET` i Apps Script (se [DRIVE_AUTOMATION.md](./DRIVE_AUTOMATION.md)).

**P0 ownerId (2026-05-22):** Webhook-body `ownerId`/`ownerUid` ignoreras. Sätt server-side uid (samma som ditt Firebase Auth-konto i appen):

```bash
# Rekommenderat: Secret Manager (valfritt — kan också läggas i functions/.env.gen-lang-client-0481875058)
firebase functions:secrets:set DRIVE_INGEST_OWNER_UID
# Om secret används: lägg till 'DRIVE_INGEST_OWNER_UID' i notifyNewFile runWith.secrets i index.ts
```

Alternativ utan Secret Manager: `DRIVE_INGEST_OWNER_UID=<din-uid>` i `functions/.env.gen-lang-client-0481875058` (laddas vid deploy).

## Cloud Build (CI/CD)

Filer i repo:

| Fil | Syfte |
|-----|--------|
| [`cloudbuild.yaml`](../cloudbuild.yaml) | Bygg functions + SPA, deploy hosting, rules, storage, modul-Functions |
| [`cloudbuild.hosting-only.yaml`](../cloudbuild.hosting-only.yaml) | Endast `npm run build` + `hosting` |
| [`scripts/cloudbuild/sync-vite-secrets.sh`](../scripts/cloudbuild/sync-vite-secrets.sh) | Kopiera `VITE_FIREBASE_*` från lokal `.env` → Secret Manager |

`notifyNewFile` ingår **inte** i standard-pipelinen (kräver `NOTIFY_WEBHOOK_SECRET` — deploy manuellt enligt avsnittet nedan).

### Engångs-setup (GCP)

1. **API:er** — Cloud Build, Firebase, Resource Manager (Console → APIs).
2. **Cloud Build-behörigheter** — [Cloud Build → Settings → Service account permissions](https://console.cloud.google.com/cloud-build/settings/service-account?project=gen-lang-client-0481875058): aktivera **Firebase Admin** och **API Keys Viewer** (enligt [Google Cloud-dokumentation](https://cloud.google.com/build/docs/deploying-builds/deploy-firebase)).
3. **Vite-secrets** (från maskin med ifylld `.env`):

```bash
chmod +x scripts/cloudbuild/sync-vite-secrets.sh
./scripts/cloudbuild/sync-vite-secrets.sh
```

4. **Manuell build** (första test):

```bash
gcloud builds submit --config=cloudbuild.yaml --project=gen-lang-client-0481875058 .
```

5. **Trigger** (valfritt) — Cloud Build → Triggers → koppla GitHub-repo, branch `main`, config `cloudbuild.yaml`.

**Endast frontend:** `gcloud builds submit --config=cloudbuild.hosting-only.yaml --project=gen-lang-client-0481875058 .`

**Anpassa deploy-mål:** substitution `_DEPLOY_ONLY` i trigger eller:

```bash
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_DEPLOY_ONLY=hosting \
  --project=gen-lang-client-0481875058 .
```

## Deploy — Hosting (SPA)

Efter frontend-ändringar:

```bash
npm run deploy:hosting
```

Preview-kanal (egen URL, 7 dagar — bra för telefontest utan att skriva över prod):

```bash
npm run deploy:hosting:preview
```

**Telefon (PWA):** [`TELEFON-HOSTING.md`](./TELEFON-HOSTING.md)

**Produktions-URL:** https://gen-lang-client-0481875058.web.app  
Alternativ: https://gen-lang-client-0481875058.firebaseapp.com

## Cursor IDE — regler, MCP, agenter (Fas D)

Team-setup för AI-assistenter i detta repo (dev only — inget i prod-appen).

### Filer

| Fil | Syfte |
|-----|--------|
| [`.cursor/settings.json`](../.cursor/settings.json) | Firebase-plugin på; `livskompassen`-metadata (parent agent, always-on rules) |
| [`.cursor/mcp.json`](../.cursor/mcp.json) | Firebase MCP via `npx firebase-tools@latest mcp` |
| [`.cursor/rules/*.mdc`](../.cursor/rules/) | Projektregler (bl.a. `grunder-kanon`, `anti-hallucination`) |
| [`.cursor/skills/`](../.cursor/skills/) | Uppgifts-skills (Grunder, silo, DCAP, Safe Harbor, …) |
| [`.cursor/agents/`](../.cursor/agents/) | Custom agents (U1–U5 revision + U6–U10 operativa) |
| [`AGENTS.md`](../AGENTS.md) | Index: triggers, skills ↔ rules |

### MCP aktivera (ny maskin)

1. Öppna repot i **Cursor**.
2. Kontrollera att [`.cursor/mcp.json`](../.cursor/mcp.json) finns (committad i repo).
3. **Cursor Settings → MCP** — servern `firebase` ska peka på samma kommando som i `mcp.json`:
   ```json
   "command": "npx",
   "args": ["-y", "firebase-tools@latest", "mcp"]
   ```
4. `firebase login` och `firebase use gen-lang-client-0481875058` i terminal.
5. Vid deploy/rules: använd agent **`livskompassen-firebase-gcp`** eller plugin-skill **`firebase-basics`**.

### Vanliga triggers (Agent-chatt)

| Kommando | Agent / effekt |
|----------|----------------|
| `kör grunder U1` … `U5` | Read-only Grunder-revision |
| `kör kanon-vakt` | PASS/FAIL med `fil:rad` (anti-hallucination) |
| RAG / silo-PR | `livskompassen-memory-silo` |
| Ex-sms / Hamn | `livskompassen-safe-harbor` |

Kanon mot slides: [`docs/specs/modules/grunder-slides/INVENTAR.md`](./specs/modules/grunder-slides/INVENTAR.md). U1–U5-resultat: [`docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md`](./archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md).

**Ej bygga från slides utan `kör [GAP]`:** Genkit/Dotprompt (G01, G28, G29); avvisat G05, G42.

## Smoke-test (manuellt)

Se [SMOKE_CHECKLIST.md](./SMOKE_CHECKLIST.md). Kräver inloggad app (Anonymous Auth) och Firestore Console.

## Felsökning

| Problem | Åtgärd |
|---------|--------|
| `.firebaserc` parse-fel | Filen ska börja med `{` (inte `¨{`) |
| `NOTIFY_WEBHOOK_SECRET` 404 vid functions-deploy | Sätt secret (ovan) innan `notifyNewFile` |
| `knowledgeVaultQuery(us-central1)` konflikt | Använd `--force` vid deploy av functions-listan ovan, eller radera gammal region manuellt |
| API key-varning vid functions-build | Sätt Vertex/Gemini-credentials i GCP för prod; lokalt kan varningen ignoreras om deploy lyckas |
