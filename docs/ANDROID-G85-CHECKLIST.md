# Motorola G85 — build, sync & auth (checklista)

**Mål:** Pålitlig första körning av Livskompassen på Motorola G85 (`com.livskompassen.app`).  
**Kanon:** [`.context/android-capacitor.md`](../.context/android-capacitor.md) · [`FIREBASE-AUTH-LATHUND.md`](./FIREBASE-AUTH-LATHUND.md) · [`OFFLINE-ANDROID.md`](./OFFLINE-ANDROID.md)

---

## 0. Före du börjar (Mac)

| Steg | Gör så här |
|------|------------|
| JDK 21 | Android Studio → **Settings → Build Tools → Gradle → Gradle JDK** → Temurin 21 |
| `.env` | Kopiera [`.env.example`](../.env.example) till projektrot — **committa aldrig** `.env` |
| `authDomain` | Måste vara `gen-lang-client-0481875058.firebaseapp.com` (låst AUTH-G1) |
| Repo | `git pull --ff-only origin main` |

---

## 1. Motorola G85 (telefon)

1. **Inställningar → Om telefonen** → tryck **Byggnummer** 7 gånger → utvecklarläge på.
2. **Inställningar → System → Utvecklaralternativ** → **USB-felsökning** på.
3. Anslut USB → godkänn **Tillåt USB-felsökning** på telefonen.
4. Verifiera: `adb devices` visar enheten (inte `unauthorized`).

---

## 2. Bygg webb + synka Capacitor

Från projektrot:

```bash
npm run android:smoke-prep
```

*(Samma som `npm run cap:sync` — `build:web` + `npx cap sync android`.)*

**Prod-WebView** (laddar live UI från Hosting — kräver nät + deployad `main`):

```bash
npm run cap:sync:prod
```

---

## 3. SHA-1 i Firebase (krävs för native Google)

1. Hämta debug-SHA-1:

```bash
cd android && ./gradlew signingReport
```

2. Kopiera **SHA-1** under `Variant: debug`.
3. Firebase Console → **Project settings** → Android-app `com.livskompassen.app` → **Add fingerprint**.
4. Ladda ner ny `google-services.json` → `android/app/google-services.json`.
5. Kontroll: filen innehåller `"client_type": 1` (Android OAuth) — inte bara `3` (web).
6. Kör om: `npm run android:smoke-prep`.

---

## 4. Android Studio → Run

1. `npm run android:open` (eller öppna mappen `android/`).
2. **Sync Project with Gradle Files**.
3. **Build → Clean Project**.
4. Välj **Motorola G85** som enhet → **Run**.
5. Vid auth-strul: **avinstallera** appen på telefonen → installera om.

---

## 5. Google-inloggning (G85)

| Punkt | Detalj |
|-------|--------|
| Flöde | **Native** i appen (`nativeGoogleAuth.ts`) — **inte** Chrome-popup som på Mac |
| Flik | **Logga in** (befintligt konto) — inte Skapa konto |
| Konto | Samma Google-konto som på Mac |
| Firebase Console | **Authentication → Inställningar → Authorized domains** inkl. `gen-lang-client-0481875058.web.app` |

---

## 6. Snabb verifiering (offline, valfritt)

Efter lyckad inloggning med nät på:

1. Spara dagbok/planeringspost → ska funka.
2. **Flygplansläge** → chip visar offline.
3. Spara dagbok offline → OK; **Valv/barnlogg** → blockeras (avsiktligt).
4. Slå på nät → «Synkar…» → data synkad.

Se [`OFFLINE-ANDROID.md`](./OFFLINE-ANDROID.md).

---

## 7. Statisk smoke (före merge)

```bash
npm run build:web
npm run smoke:auth-login
npm run smoke:android-platform
```

---

## 8. Felsökning

| Symptom | Åtgärd |
|---------|--------|
| `DEVELOPER_ERROR` / Google avbryts | SHA-1 saknas — steg 3 |
| Chrome + vit skärm | Gammal APK — `android:smoke-prep`, avinstallera, kör om |
| `auth/unauthorized-domain` | Authorized domains i Firebase |
| Gradle/Java-fel | Gradle JDK = 21 (inte 17) |
| `adb` hittar inte G85 | USB-kabel, felsökningsdialog, annan port |

---

**Efter auth-/frontend-ändring:** alltid `npm run android:smoke-prep` innan Run på G85.
