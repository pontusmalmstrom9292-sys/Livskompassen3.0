# CI — Android APK (valfritt, utan Play Butik)

**Syfte:** Bygg debug-APK och distribuera via [Firebase App Distribution](https://firebase.google.com/docs/app-distribution) till familj/testare — slipper USB efter första install.

**Relaterat:** [`CI-HOSTING.md`](./CI-HOSTING.md) (webb/PWA) · [`android/README.md`](../android/README.md) · [`INSTALL-CHECKLIST.md`](./INSTALL-CHECKLIST.md)

Workflow: [`.github/workflows/android-app-distribution.yml`](../.github/workflows/android-app-distribution.yml)

---

## Vad som uppdateras automatiskt

| Del | Push `main` + workflow | USB Run |
|-----|------------------------|---------|
| Webb / PWA | Hosting CI | — |
| App **UI** (prod `server.url`) | Hosting CI (ingen ny APK) | — |
| **APK** (native shell, widgets) | Denna workflow (valfritt) | Android Studio |
| Widget Java/XML | Ny APK | Ny APK |

---

## Secrets (GitHub Actions)

| Secret | Krävs | Beskrivning |
|--------|-------|-------------|
| `FIREBASE_SERVICE_ACCOUNT` | Ja | Samma JSON som Hosting CI — roll **Firebase App Distribution Admin** eller bred Firebase Admin |
| `VITE_FIREBASE_*` (6 st) | Ja | För `npm run build` i workflow |

Testare hanteras i Firebase Console — grupp **`familj`** (workflow skickar till den gruppen).

**Utan `gh` på Mac:** sätt secrets manuellt på  
https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0/settings/secrets/actions

---

## Kör manuellt (Actions)

1. GitHub → **Actions** → **Android App Distribution**
2. **Run workflow** → branch `main`
3. Testare får e-post med länk att installera APK

**Lokal build (samma som CI):**

```bash
cd ~/StudioProjects/Livskompassen3.0
npm run cap:sync:prod
cd android && ./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Första gången i Firebase Console

1. [App Distribution](https://console.firebase.google.com/project/gen-lang-client-0481875058/appdistribution) → **Get started**
2. Android-app `com.livskompassen.app` ska synas (samma som `google-services.json`)
3. Lägg till testare (e-post) eller grupp `familj`

---

## Felsökning

| Symptom | Åtgärd |
|---------|--------|
| Workflow fail — Gradle | Kör `npm run cap:sync:prod` lokalt; committa `android/` sync-artefakter om nödvändigt |
| Distribution 403 | Service account saknar App Distribution-rättighet |
| App visar gammal UI | Prod-APK ska byggts med `cap:sync:prod` (Hosting-URL i WebView) |
