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
firebase deploy --only functions:analyzeMessage,functions:invalidateSession,functions:generateEmbedding,functions:ingestKampsparEntry,functions:knowledgeVaultQuery,functions:valvChatQuery,functions:scheduledRetentionJob,functions:weaveJournalEntry,functions:speglingsMirror --force
```

**Hjärtat (Speglar):** `speglingsMirror` måste deployas för AI-spegling i prod.

**Storage:** `storage.rules` krävs för valv-media (`vault_evidence/{uid}/**`).

**Första gången:** Aktivera Storage i [Firebase Console → Storage](https://console.firebase.google.com/project/gen-lang-client-0481875058/storage) (*Get Started*), välj region (t.ex. `europe-west1`), sedan:

```bash
firebase deploy --only storage
```

Utan aktiverad Storage + deploy misslyckas skärmdump-uppladdning i prod.

Valfritt i samma körning (redan i repo, ej kritisk för hjärtat): `breakDownResponse`, `getAgentRegistry`.

**Obs:** En full deploy `firebase deploy --only functions` inkluderar `notifyNewFile`, som kräver secret (se nedan).

**Kunskap / Gemini:** Om Vertex-modeller ger 404 i prod använder `knowledgeVaultQuery` RAG-fallback (deterministiskt svar från chunks). För full LLM-syntes: `firebase functions:secrets:set GEMINI_API_KEY` och bind secret i `knowledgeVaultQuery` (eller aktivera Vertex Generative AI i GCP Console).

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
