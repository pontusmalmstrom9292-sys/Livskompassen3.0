# Firebase Auth — lathund (1 sida)

**Projekt (web SDK i appen):** `gen-lang-client-0481875058` — se [`DEPLOY.md`](./DEPLOY.md).

Jag kan **inte** klicka åt dig i Firebase Console. Följ tabellen nedan en gång; sen funkar Google-inlogg oftast.

---

## Vanligt misstag

| Fel | Rätt |
|-----|------|
| Fliken **Användare** + sökfält | Sökfältet letar **person** (e-post eller uid), **inte** webbadress. |
| Du skriver `…web.app` där | Det ger *"hittade inget konto"* — det är förväntat. |

---

## Var du klickar (två ställen)

### 1) Godkända domäner (måste stämma mot var du öppnar appen)

1. Firebase Console → **Build** → **Authentication**
2. Flik **Inställningar** (Settings) — *inte* Användare
3. Scrolla till **Authorized domains** / Auktoriserade domäner
4. **Lägg till** det som saknas (bara värdnamn — ingen `http://`, ingen port):

| Domän | När |
|--------|-----|
| `localhost` | `npm run dev` på datorn |
| `127.0.0.1` | Om du någon gång öppnar via den |
| `192.168.x.x` | Telefon mot Mac: samma IP som i URL (utan `:5176`) |
| `gen-lang-client-0481875058.web.app` | Hosting + prod-Capacitor (se nedan) |
| `gen-lang-client-0481875058.firebaseapp.com` | Alternativ hosting-URL |

Firebase brukar redan ha `web.app` / `firebaseapp.com` för projektet — **kolla** ändå.

### 2) Google som inloggningsmetod

1. **Authentication** → flik **Inloggningsmetod** (Sign-in method)
2. **Google** → **Aktiverad** (Enabled)

---

## Lokalt i repo (`.env`)

- `VITE_FIREBASE_*` — från Firebase → Project settings → Your apps (Web).
- `VITE_GOOGLE_LOGIN_HINT=pontus.malmstrom9292@gmail.com` — bara **förslag** till Google (hint), tvingar inte konto.
- `VITE_GOOGLE_SIGNIN_REDIRECT=true` — valfritt om popup strular på desktop.

Efter `.env`-ändring: **starta om** `npm run dev`.

---

## Android (Android Studio / Capacitor) — **nuläge**

| Del | Vad som gäller |
|-----|----------------|
| **Internet** | `AndroidManifest.xml` har `INTERNET` — appen **får** nät. |
| **Prod-WebView** | `npm run cap:sync:prod` sätter `CAPACITOR_SERVER_URL=https://gen-lang-client-0481875058.web.app` → WebView laddar **live** UI från Hosting (kräver nät för att hämta sidan). |
| **Dev** | `npm run cap:sync` utan URL → byggd `dist` i APK (färre “live”-koppling till Hosting). |
| **HTTPS** | `capacitor.config.ts`: `androidScheme: 'https'`, `allowMixedContent: false`. |

**Firestore offline (cache + kö vid nät)** — se [`OFFLINE-ANDROID.md`](./OFFLINE-ANDROID.md). Auth-lathunden rör bara **inloggning**; offline är separat.

**Din checklista (Firebase Console)** — bocka av manuellt när klart: `[ ]` Authorized domains · `[ ]` Google påslaget · `[ ]` Anonymous på (om du använder anonym dev) — detaljer ovan.

---

## Snabb felsökning

| Symptom | Titta först |
|---------|-------------|
| `auth/unauthorized-domain` | Authorized domains + rätt host i adressfältet |
| Fel Google-konto | **Logga in**-fliken i appen (inte Skapa konto) + välj rätt konto i Google |
| Vit skärm mobil | Redirect-flöde + att du kommer tillbaka till **samma** URL efter Google |
