# Drive-automation (wire-only)

Kopplar Google Drive Inbox → Kunskapsvalvet → `notifyNewFile` → `analyzeDriveFile` (Gemini).  
**Denna fas sparar inget i Firestore** — endast sortering, webhook och bakgrundsanalys.

Firebase-projekt: `gen-lang-client-0481875058`  
Region: `europe-west1`

## Flöde

```
Drive Inbox → Apps Script (sorter.gs) → Drive Vault
                    ↓
            notifyNewFile (Cloud Function)
                    ↓
            analyzeDriveFile (Gemini 1.5 Pro)
```

---

## Förberedelsechecklista (du)

Gör detta **innan** deploy och trigger:

| # | Uppgift | Anteckning |
|---|---------|------------|
| 1 | **Drive-mappar** | Skapa eller öppna `Inbox` och `Kunskapsvalvet` (Vault). Kopiera **folder ID** från URL: `drive.google.com/.../folders/{ID}` |
| 2 | **Script Properties** | I Apps Script: Project Settings → Script Properties (se tabell nedan) |
| 3 | **Dela Vault med Functions SA** | Dela Vault-mappen (minst **Viewer**) med service account för projektet, t.ex. `gen-lang-client-0481875058@appspot.gserviceaccount.com` (verifiera exakt e-post i [GCP Console → IAM](https://console.cloud.google.com/iam-admin/iam?project=gen-lang-client-0481875058)) |
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
| `FIREBASE_OWNER_UID` | Nej | Firebase Auth uid — skickas i webhook-body för framtida persistens |

Klistra in innehållet från [`scripts/google-apps-script/sorter.gs`](../scripts/google-apps-script/sorter.gs) i ett nytt Apps Script-projekt kopplat till samma Google-konto som äger Drive-mapparna.

---

## Deploy och koppling

Kör från projektroten (`Livskompassen2.0`):

```bash
# 1. Sätt webhook-secret (interaktiv — klistra in värdet när CLI frågar)
firebase functions:secrets:set NOTIFY_WEBHOOK_SECRET

# 2. Bygg Functions
cd functions && npm run build && cd ..

# 3. Deploy endast notifyNewFile
firebase deploy --only functions:notifyNewFile
```

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
| Firestore | **Ingen** ny `document_meta` — medvetet i wire-only-fasen |

### Manuellt webhook-test (efter deploy)

```bash
curl -X POST "https://europe-west1-gen-lang-client-0481875058.cloudfunctions.net/notifyNewFile" \
  -H "Content-Type: application/json" \
  -H "X-Livskompassen-Webhook-Secret: DITT_SECRET" \
  -d '{"fileId":"DRIVE_FILE_ID","fileName":"test.pdf","mimeType":"application/pdf"}'
```

Loggar: `firebase functions:log --only notifyNewFile`

### Vanliga fel

- **Inga träffar i loggar** — fel GCP-projekt/region i `CLOUD_FUNCTION_URL`.
- **401** — `WEBHOOK_SECRET` i Apps Script matchar inte Firebase secret.
- **Drive-nedladdning failar i bakgrund** — Vault inte delad med Functions service account, eller fel `fileId`.

---

## Kända begränsningar (wire-only)

- Analysresultat sparas inte i Firestore.
- Ingen embedding / Vector Search / RAG-kedja.
- En personlig Drive (single-user); ingen fleranvändar-OAuth i denna fas.
- `ownerUid` i webhook-body ignoreras av backend tills persistens byggs.

---

## Nästa fas (efter godkännande av wire-up)

Separat implementation enligt [`.context/arkitektur-beslut.md`](../.context/arkitektur-beslut.md) steg **1.1–1.5**:

1. **Datamodell** — beslut om `userId` vs `ownerId`, collection-path för Vault/Kampspår.
2. **Firestore metadata** — t.ex. `document_meta` / `kb_docs` vid lyckad analys.
3. **Idempotens** — undvik dubbel indexering på samma `fileId`.
4. **RAG-kedja** — `generateEmbedding` + Vector Search kopplat till uppladdade dokument.
5. **UI** — Kampspår-uppladdning (system-plan Fas 4.2).
