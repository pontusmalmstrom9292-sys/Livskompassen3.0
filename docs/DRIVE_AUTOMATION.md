# Drive-automation

Kopplar Google Drive Inbox → Kunskapsvalvet → `notifyNewFile` → `driveIngestSynapse` → Gemini-analys.  
Med `FIREBASE_OWNER_UID` i Apps Script sparas analys i Firestore **`kb_docs`** (Kunskap-silo, idempotent per `driveFileId`).

Firebase-projekt: `gen-lang-client-0481875058`  
Region: `europe-west1`

### Implementationsstatus (repo)

| Del | Status |
|-----|--------|
| `sorter.gs` (Script Properties + webhook-header) | Klar i repo |
| `notifyNewFile` (fail-closed secret, logging) | Klar i repo |
| `documentAgent.ts` (Gemini-analys) | Klar i repo |
| `driveIngestSynapse` → `kb_docs` vid `ownerId` | Klar i repo (`ownerId` ← `ownerUid` i webhook) |
| `npm run build` (functions + frontend) | Verifierad |
| Firebase deploy + Apps Script + `NOTIFY_WEBHOOK_SECRET` | **E2E PASS** 2026-05-22 — `kb_docs` skapad via webhook |

## Flöde

```
Drive Inbox → Apps Script (sorter.gs) → Drive Vault
                    ↓
            notifyNewFile (Cloud Function)
                    ↓
            driveIngestSynapse → analyzeDriveFile (Gemini)
                    ↓
            kb_docs (om ownerId/ownerUid + FIREBASE_OWNER_UID)
```

---

## Snabbstart (automatiserat)

```bash
# 1. Engång: kopiera och fyll Drive-mapp-ID (från drive.google.com/.../folders/ID)
cp .drive-setup.json.example .drive-setup.json

# 2. Sätt DRIVE_INGEST_OWNER_UID i functions/.env.gen-lang-client-0481875058 (Firebase Auth uid)

# 3. En kommando — deploy + smoke + utskrift Apps Script Properties
npm run drive:wireup
```

Klistra Script Properties i [Apps Script](../scripts/google-apps-script/README.md), dela Vault med SA, kör `createTrigger()` en gång. Därefter: lägg fil i Inbox → automatiskt varje timme.

---

## Förberedelsechecklista (du)

Gör detta **innan** deploy och trigger (eller använd `npm run drive:wireup` för Firebase-delen):

| # | Uppgift | Anteckning |
|---|---------|------------|
| 1 | **Drive-mappar** | Skapa eller öppna `Inbox` och `Kunskapsvalvet` (Vault). Kopiera **folder ID** från URL: `drive.google.com/.../folders/{ID}` |
| 2 | **Script Properties** | I Apps Script: Project Settings → Script Properties (se tabell nedan) |
| 3 | **Dela Vault med Functions SA** | Dela Vault-mappen (minst **Viewer**) med **`gen-lang-client-0481875058@appspot.gserviceaccount.com`** — verifierat runtime SA för `notifyNewFile` (2026-05-22 G6). **Inte** compute-SA om appspot redan delad. |
| 4 | **NOTIFY_WEBHOOK_SECRET** | Generera långt slumpvärde (t.ex. `openssl rand -base64 32`). Spara i password manager — **committa aldrig** |
| 5 | **Firebase CLI** | `firebase login` och `firebase use gen-lang-client-0481875058` |
| 6 | **URL-mismatch (fixat i repo)** | Gammal `sorter.gs` pekade på `livskompassen-v2.cloudfunctions.net`. Korrekt default är `gen-lang-client-0481875058` — verifiera URL efter deploy i Firebase Console |

### Script Properties (Apps Script)

| Nyckel | Obligatorisk | Beskrivning |
|--------|--------------|-------------|
| `INBOX_FOLDER_ID` | Ja | Drive-mapp Inbox |
| `VAULT_FOLDER_ID` | Ja | Drive-mapp Kunskapsvalvet |
| `WEBHOOK_SECRET` | Ja (prod) | Samma värde som Firebase secret `NOTIFY_WEBHOOK_SECRET` |
| `CLOUD_FUNCTION_URL` | Nej | Default: `https://europe-west1-gen-lang-client-0481875058.cloudfunctions.net/notifyNewFile` |
| `FIREBASE_OWNER_UID` | Dokumentation | Ska matcha `DRIVE_INGEST_OWNER_UID` i functions env — body ignoreras av backend (P0) |

Klistra in innehållet från [`scripts/google-apps-script/sorter.gs`](../scripts/google-apps-script/sorter.gs) i ett nytt Apps Script-projekt kopplat till samma Google-konto som äger Drive-mapparna.

---

## Deploy och koppling

Kör från projektroten (`Livskompassen2.0`). Samma steg finns i [DEPLOY.md](./DEPLOY.md#notifynewfile-drive-webhook).

```bash
# 1. Sätt webhook-secret (interaktiv — klistra in värdet när CLI frågar)
firebase functions:secrets:set NOTIFY_WEBHOOK_SECRET

# 2. Bygg Functions
cd functions && npm run build && cd ..

# 3. Deploy endast notifyNewFile (misslyckas utan steg 1)
firebase deploy --only functions:notifyNewFile
```

**Fas 3:** Övriga modul-Functions kan deployas utan detta secret; endast `notifyNewFile` är blockerad tills secret finns.

Efter deploy:

1. Kopiera **exakt** function-URL från [Firebase Console → Functions](https://console.firebase.google.com/project/gen-lang-client-0481875058/functions) till Script Property `CLOUD_FUNCTION_URL` (om den skiljer sig från default).
2. Sätt samma secret i Apps Script `WEBHOOK_SECRET`.
3. I Apps Script: kör funktionen `createTrigger()` **en gång** (timtrigger) eller skapa motsvarande trigger manuellt.

---

## Verifiering

| Test | Förväntat resultat |
|------|-------------------|
| Fil i Inbox | Flyttas till Vault av Apps Script (inom ~1 timme, eller kör `autonomousSorter` manuellt) |
| HTTP-anrop med giltig secret | `200` + `{ "status": "Processing started", "fileId": "..." }` |
| Anrop **utan** header `X-Livskompassen-Webhook-Secret` | `401 Unauthorized` |
| Secret saknas i Functions (prod) | `503 Service Unavailable` (fail-closed) |
| Cloud Functions-loggar | `[File Pipeline] Startar automatisk analys av: ...` och Gemini-anrop |
| Firestore `kb_docs` | Ny rad när `FIREBASE_OWNER_UID` satt + Vault delad med Functions SA |

### Manuellt webhook-test (efter deploy)

```bash
curl -X POST "https://europe-west1-gen-lang-client-0481875058.cloudfunctions.net/notifyNewFile" \
  -H "Content-Type: application/json" \
  -H "X-Livskompassen-Webhook-Secret: DITT_SECRET" \
  -d '{"fileId":"DRIVE_FILE_ID","fileName":"test.pdf","mimeType":"application/pdf"}'
```

(`ownerId` i body ignoreras — sätt `DRIVE_INGEST_OWNER_UID` server-side.)

Loggar: `firebase functions:log --only notifyNewFile`

### Vanliga fel

- **Inga träffar i loggar** — fel GCP-projekt/region i `CLOUD_FUNCTION_URL`.
- **401** — `WEBHOOK_SECRET` i Apps Script matchar inte Firebase secret.
- **Drive-nedladdning failar i bakgrund** — Vault inte delad med Functions service account, eller fel `fileId`.

---

## `ownerId` — server secret (P0, 2026-05-22)

| Källa | Används för `kb_docs`? |
|--------|-------------------------|
| Firebase secret `DRIVE_INGEST_OWNER_UID` | **Ja** — enda giltiga `ownerId` i `notifyNewFile` |
| Body `ownerId` / `ownerUid` | **Nej** — ignoreras (spoof-skydd) |

Sätt secret (samma uid som ditt Firebase Auth-konto i appen):

```bash
firebase functions:secrets:set DRIVE_INGEST_OWNER_UID
```

`FIREBASE_OWNER_UID` i Apps Script ska matcha secret-värdet (dokumentation); webhook-body skickar fortfarande fält men backend läser **inte** body för ägarskap.

Utan secret: analys körs, men `driveIngestSynapse` hoppar över `kb_docs` (logg: `ownerId saknas`).

## Kända begränsningar

- `kb_docs` kräver `FIREBASE_OWNER_UID` i Script Properties + Vault delad med `gen-lang-client-0481875058@appspot.gserviceaccount.com`.
- **Google Docs/Sheets/Slides** (`application/vnd.google-apps.*`) exporteras via Drive API — `alt=media` ger 403 (fixat i `documentAgent.ts`).
- `notifyNewFile` **väntar** på pipeline (synkront) — svar `Processing complete` när `kb_docs` är skriven.
- En personlig Drive (single-user); ingen fleranvändar-OAuth i denna fas.
- Filer som redan flyttats till Vault körs inte om från Inbox — lägg ny testfil i Inbox för omkörning.

---

## Nästa fas (efter godkännande av wire-up)

Separat implementation enligt [`.context/arkitektur-beslut.md`](../.context/arkitektur-beslut.md) steg **1.1–1.5**:

1. **Datamodell** — beslut om `userId` vs `ownerId`, collection-path för Vault/Minne.
2. **Firestore metadata** — t.ex. `document_meta` / `kb_docs` vid lyckad analys.
3. **Idempotens** — undvik dubbel indexering på samma `fileId`.
4. **RAG-kedja** — `generateEmbedding` + Vector Search kopplat till uppladdade dokument.
5. **UI** — Minne-uppladdning (system-plan Fas 4.2).
