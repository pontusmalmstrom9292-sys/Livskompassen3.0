# CI — Hosting vid push till `main`

**Mac (kanonisk mapp):** `~/StudioProjects/Livskompassen3.0` — öppna **bara den** i Cursor.  
**Repo:** [Livskompassen3.0](https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0)  
**Trigger:** endast `push` till grenen **`main`** (inte andra grenar).  
**Effekt:** bygger SPA och deployar till https://gen-lang-client-0481875058.web.app

Workflow: [`.github/workflows/firebase-hosting-main.yml`](../.github/workflows/firebase-hosting-main.yml)

---

## Förutsättningar

1. Du jobbar i **`Livskompassen3.0`** (inte stub-mappen `Livskompassen2.0` på disken).
2. Workflow-filen finns på **`main`** på GitHub (mergea PR eller pusha direkt till `main`).
3. GitHub **Secrets** är ifyllda (nedan).
4. Lokal `.env` committas **aldrig** — samma värden som `VITE_FIREBASE_*` kopieras till Secrets.

---

## Steg 1 — Service account (engång)

1. Öppna [Google Cloud IAM](https://console.cloud.google.com/iam-admin/serviceaccounts?project=gen-lang-client-0481875058).
2. **Create service account** — namn t.ex. `github-hosting-deploy`.
3. Roll: **Firebase Hosting Admin** (`roles/firebasehosting.admin`).
4. **Keys → Add key → JSON** — ladda ner filen (spara säkert, dela inte).
5. GitHub → repo **Livskompassen3.0** → **Settings → Secrets and variables → Actions → New repository secret**:
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: **hela** JSON-innehållet från nyckelfilen.

---

## Steg 2 — Vite-build (engång)

**Automatiskt (rekommenderat)** — från **`~/StudioProjects/Livskompassen3.0`**, med `gh` inloggat och `.env` ifylld:

```bash
brew install gh   # om saknas
gh auth login
./scripts/set_github_hosting_secrets.sh
# + service account JSON (steg 1):
./scripts/set_github_hosting_secrets.sh ~/Downloads/din-sa-nyckel.json
```

**Manuellt** — samma värden som i din lokala `.env` (endast Firebase Web SDK):

| Secret name | Motsvarar `.env` |
|-------------|------------------|
| `VITE_FIREBASE_API_KEY` | `VITE_FIREBASE_API_KEY` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `VITE_FIREBASE_PROJECT_ID` | `VITE_FIREBASE_PROJECT_ID` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `VITE_FIREBASE_APP_ID` | `VITE_FIREBASE_APP_ID` |

**Lägg inte** `GEMINI_API_KEY`, `VITE_GEMINI_API_KEY`, `VITE_VAULT_PIN` eller Drive-secrets här — hosting-bygget behöver dem inte.

---

## Steg 3 — Verifiera

1. Mergea workflow till `main` och pusha (eller `workflow_dispatch` i Actions-fliken).
2. GitHub → **Actions** → **Deploy Hosting (main)** → grön bock.
3. Öppna på telefon: https://gen-lang-client-0481875058.web.app (ev. hård refresh / rensa PWA-cache om du testat tidigare).

---

## Vad som *inte* deployas automatiskt

| Del | Deploy |
|-----|--------|
| Hosting (SPA) | Ja, vid push till `main` |
| Cloud Functions | Nej — fortfarande `firebase deploy --only functions:...` lokalt ([`DEPLOY.md`](./DEPLOY.md)) |
| Firestore rules | Nej |
| Feature-grenar | Nej — bara `main` |

---

## Felsökning

| Symptom | Åtgärd |
|---------|--------|
| Action körs inte | Push måste gå till **`main`**; workflow måste finnas på `main`. |
| Build fail — `YOUR_API_KEY` i app | Saknade `VITE_FIREBASE_*` secrets. |
| Deploy permission denied | SA saknar `Firebase Hosting Admin`. |
| App oförändrad på telefon | PWA-cache — öppna i privat flik eller rensa webbplatsdata. |
