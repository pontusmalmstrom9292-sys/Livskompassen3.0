# Deploy (Livskompassen3.0)

Kanonisk rot: `Livskompassen3.0/` (projektrot med `firebase.json`).

Firebase-projekt: `gen-lang-client-0481875058`  
Region (Functions): `europe-west1`

## Förutsättningar

1. **Auth-domäner + Google:** [`FIREBASE-AUTH-LATHUND.md`](./FIREBASE-AUTH-LATHUND.md) (Console-steg du gör själv).
2. `.env` i projektroten med alla `VITE_FIREBASE_*` från [Firebase Console → Project settings](https://console.firebase.google.com/project/gen-lang-client-0481875058/settings/general).
3. Firebase CLI inloggad: `firebase login` och `firebase use gen-lang-client-0481875058`.
4. **Authentication → Anonymous** aktiverad i Firebase Console.

## Bygg (lokalt)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
cd functions && npm run build && cd ..
npm run build
```

## Deploy — Firestore + Storage + modul-Functions

**Full inventering (35 fn):** [`GCP-INVENTORY-LATEST.md`](./GCP-INVENTORY-LATEST.md)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only storage
firebase deploy --only functions:beginVaultWebAuthnChallenge,functions:issueVaultSession,functions:analyzeMessage,functions:invalidateSession,functions:generateEmbedding,functions:ingestKampsparEntry,functions:ingestKnowledgeDocument,functions:knowledgeVaultQuery,functions:valvChatQuery,functions:childrenLogsQuery,functions:getEntityProfileRegistry,functions:addEntityProfile,functions:scheduledRetentionJob,functions:weaveJournalEntry,functions:approveWeaverMetadata,functions:confirmInboxItem,functions:speglingsMirror,functions:generateDossier,functions:ingestWidgetRecording,functions:createBarnportenPairing,functions:claimBarnportenPairing --force
```

**Valv-session:** `beginVaultWebAuthnChallenge` + `issueVaultSession` måste deployas tillsammans — smoke: `npm run smoke:locked-ux`, `npm run smoke:valv-gate`.

**Hjärtat (Speglar):** `speglingsMirror` måste deployas för AI-spegling i prod.

**Storage:** `storage.rules` krävs för valv-media (`vault_evidence/{uid}/**`) och projektbilder (`project_media/{uid}/{projectId}/**`).

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

## Fas 1 — Säkerhetshårdning (2026-06-11)

### 1.2 Prod: kräv e-postinloggning

Bygg hosting med flaggan satt (Vite bäddar in vid build — inte runtime):

```bash
VITE_REQUIRE_EMAIL_AUTH=true npm run build
firebase deploy --only hosting
```

- Lokalt/dev: lämna flaggan **av** i `.env` — anonym auth fungerar fortfarande.
- Prod (valfritt): stäng av **Authentication → Anonymous** i Firebase Console när du kör e-postkrav.

### 1.3 Firestore: `email_verified`

Regler på WORM-silos (`journal`, `reality_vault`, `children_logs`, `dossier_snapshots` read): Google/e-post måste vara **verifierade**; anonym provider tillåts fortfarande för dev/smoke.

```bash
firebase deploy --only firestore:rules
```

### 1.4 Firebase App Check

**Console (engångs):**

1. [Firebase Console → App Check](https://console.firebase.google.com/project/gen-lang-client-0481875058/appcheck) → registrera **Web**-appen.
2. Provider: **reCAPTCHA v3** — kopiera site key till `.env`: `VITE_APP_CHECK_RECAPTCHA_SITE_KEY=…`
3. Lokal dev: App Check → **Manage debug tokens** → lägg token i `.env`: `VITE_APP_CHECK_DEBUG_TOKEN=…`
4. **Android:** registrera `com.livskompassen.app` med **Play Integrity** (Capacitor) — samma App Check-projekt.
5. När web+Android skickar tokens: aktivera enforcement på **Cloud Functions** i App Check-konsolen.

**Functions (prod enforcement):**

```bash
# Sätt env på berörda functions (exempel — upprepa per LLM-callable eller via firebase.json)
firebase functions:config:set appcheck.enforce=true   # legacy — prefer env APP_CHECK_ENFORCE

# Rekommenderat: Firebase Functions v2 env (Google Cloud Console → Cloud Run / Functions)
# APP_CHECK_ENFORCE=true
```

Kod: fail-open tills `APP_CHECK_ENFORCE=true` (eller `FUNCTIONS_EMULATOR=true` → alltid öppen). Deploy berörda callables efter aktivering:

```bash
cd functions && npm run build && cd ..
firebase deploy --only functions:issueVaultSession,functions:beginVaultWebAuthnChallenge,functions:valvChatQuery,functions:analyzeMessage,functions:knowledgeVaultQuery,functions:childrenLogsQuery,functions:speglingsMirror,functions:mabraCoach,functions:generateDossier,functions:weaveJournalEntry,functions:ingestWidgetRecording,functions:generateEmbedding,functions:ingestKnowledgeDocument
```

### 1.5 Rate limits (LLM callables)

Per-UID sliding window (60 s) via Firestore `_rate_limits` — ingen klientåtkomst. Deploy samma functions som ovan. Överskridande → `resource-exhausted`.

### 1.6 WORM field allowlists

`firestore.rules` använder `keys().hasOnly([...])` på create för `journal`, `reality_vault`, `children_logs`. Smoke: `npm run smoke:vault-worm`.

## Deploy — Hosting (SPA)

Efter frontend-ändringar:

```bash
npm run build
firebase deploy --only hosting
```

**Produktions-URL:** https://gen-lang-client-0481875058.web.app  
Alternativ: https://gen-lang-client-0481875058.firebaseapp.com

## Smoke-test (manuellt)

Se [SMOKE_CHECKLIST.md](./SMOKE_CHECKLIST.md). Kräver inloggad app (Anonymous Auth) och Firestore Console.

## Felsökning

| Problem | Åtgärd |
|---------|--------|
| `.firebaserc` parse-fel | Filen ska börja med `{` (inte `¨{`) |
| `NOTIFY_WEBHOOK_SECRET` 404 vid functions-deploy | Sätt secret (ovan) innan `notifyNewFile` |
| `knowledgeVaultQuery(us-central1)` konflikt | Använd `--force` vid deploy av functions-listan ovan, eller radera gammal region manuellt |
| API key-varning vid functions-build | Sätt Vertex/Gemini-credentials i GCP för prod; lokalt kan varningen ignoreras om deploy lyckas |
