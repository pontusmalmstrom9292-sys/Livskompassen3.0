# Firebase-synk (Fas 3)

Kanonisk rot: `Livskompassen2.0/`  
Projekt: `gen-lang-client-0481875058`  
Region Functions: `europe-west1`

## Vad som är deployat

| Resurs | Status |
|--------|--------|
| Firestore rules (WORM) | Deployad |
| Firestore indexes | Deployad |
| Hosting | https://gen-lang-client-0481875058.web.app |
| `generateEmbedding`, `analyzeMessage`, `invalidateSession`, `scheduledRetentionJob`, `knowledgeVaultQuery`, `valvChatQuery`, `ingestKampsparEntry`, `generateDossier`, `weaveJournalEntry`, m.fl. | Deployade (se [`GCP-INVENTORY-LATEST.md`](./GCP-INVENTORY-LATEST.md)) |
| `notifyNewFile` | Deployad — **kräver** `NOTIFY_WEBHOOK_SECRET` (saknas i Secret Manager 2026-05-21) |

## Data Connect vs Firestore

- **Moduler (dagbok, valv, barnen, kompasser)** använder **Firestore SDK** — collections `journal`, `reality_vault`, `children_logs`, `checkins`.
- **Data Connect** (Postgres, example Movie-schema) är deployat men **används inte** av appen ännu. Avvakta tills ekonomi/KASAM ska kopplas (se `.context/arkitektur-beslut.md` steg 1.7).

## Förutsättningar (du)

1. `.env` i `Livskompassen2.0/` med alla `VITE_FIREBASE_*` (kopiera från `.env.example`).
2. Firebase Console → **Authentication → Anonymous** = Enabled.
3. Starta om `npm run dev` efter `.env`-ändringar.

## Deploy-kommandon (från `Livskompassen2.0/`)

```bash
cd functions && npm run build && cd ..
npm run build
firebase deploy --only firestore:rules,firestore:indexes,hosting,functions:generateEmbedding,functions:analyzeMessage,functions:invalidateSession,functions:scheduledRetentionJob,functions:knowledgeVaultQuery
```

Efter frontend-ändringar:

```bash
npm run build && firebase deploy --only hosting
```

## Smoke-test (manuell)

| Test | Route / åtgärd | Förväntat |
|------|----------------|-----------|
| Auth | Öppna Hosting-URL eller localhost | Inget auth-fel i konsol |
| Dagbok | `/dagbok` → spara post | Dokument i `journal` med ditt `userId` |
| Valv | Long-press Shield 3s → PIN → spara | Dokument i `reality_vault` |
| Barnen | `/barnen` → spara | Dokument i `children_logs` |
| Kompasser | `/kompasser` → spara | Dokument i `checkins` |
| BIFF | `/hamn` → klistra sms | Grey Rock-svar |
| Kunskap | `/kunskap` → fråga | Svar från `knowledgeVaultQuery` |

Firestore Console: https://console.firebase.google.com/project/gen-lang-client-0481875058/firestore

## Drive-pipeline (`notifyNewFile`)

Kräver secret innan deploy:

```bash
firebase functions:secrets:set NOTIFY_WEBHOOK_SECRET
firebase deploy --only functions:notifyNewFile
```

Full checklista: [DRIVE_AUTOMATION.md](./DRIVE_AUTOMATION.md)

## Två lägen (telefon)

| Läge | Kommando / URL |
|------|----------------|
| Utveckling | `npm run dev` → http://localhost:5173 eller Mac-IP:5173 |
| Produktion/test | https://gen-lang-client-0481875058.web.app |

Lägg till på hemskärm via Safari (manifest finns i `public/manifest.webmanifest`).
