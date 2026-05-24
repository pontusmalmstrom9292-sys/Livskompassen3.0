# Bygga Android-widgets (WH1–WH4) — steg för steg

**Mål:** Native hemskärms-widgets (Inspelning, Anteckning, Kompass, Hamn) via Capacitor + Android `AppWidgetProvider`.  
**Teknisk spec:** [`ANDROID-WIDGETS-SPEC.md`](./ANDROID-WIDGETS-SPEC.md)

---

## Är det gratis?

| Del | Kostnad |
|-----|---------|
| **Android Studio** | Gratis |
| **JDK 17** | Gratis (ingår i Android Studio) |
| **Capacitor / widget-kod** | Gratis (open source) |
| **Debug-APK på egen telefon** | Gratis — ingen Google Play-registrering krävs |
| **Firebase (dev/test)** | Spark free tier räcker för utveckling (Auth, Firestore, Storage, Functions med måttlig användning) |
| **AI-titel på inspelning** | `ingestWidgetRecording` (Gemini) — räknas mot GCP/Firebase när funktionen deployats; vid lokal test utan deploy används fallback-titel från transkript |
| **Google Play (valfritt senare)** | Engångsavgift ~25 USD om du publicerar i butiken — **inte** nödvändigt för widgets på din egen telefon |

**Kort svar:** Bygga och köra widgets lokalt på din Android-telefon är **gratis**. Driftkostnad kommer först när du använder molntjänster (Firebase/GCP) i skala — inte från själva widget-bygget.

---

## Förutsättningar (en gång)

1. **Node.js** — redan för Livskompassen (`npm install` i repo-root).
2. **Android Studio** — ladda ner från [developer.android.com/studio](https://developer.android.com/studio) (gratis).
3. **JDK 17** — Android Studio erbjuder att installera det vid första start.
4. **Android SDK 34** — installeras via Android Studio → **Settings → Languages & Frameworks → Android SDK**.
5. **Telefon:** USB-kabel, **Utvecklaralternativ** + **USB-felsökning** påslaget (eller använd emulator i Studio).

Projektet innehåller redan:

- `android/` — Capacitor-shell + widgets (`RecordWidgetProvider`, `NoteWidgetProvider`, `CompassWidgetProvider`, `HamnWidgetProvider`)
- `capacitor.config.ts` — `appId: com.livskompassen.app`
- `android/app/google-services.json` — Firebase (samma projekt som webben)

---

## Steg 1 — Synka webben till Android

Öppna terminal i **repo-root** (`Livskompassen2.0`):

```bash
npm install
npm run cap:sync
```

Detta bygger web-appen (`dist/`) och kopierar till `android/app/src/main/assets/`.

---

## Steg 2 — Öppna i Android Studio

```bash
npm run android:open
```

Vänta tills Gradle sync är klar (första gången kan ta några minuter).

---

## Steg 3 — Kör på telefon eller emulator

1. Anslut telefon (USB-felsökning) **eller** skapa en **Virtual Device** (AVD) i Studio.
2. Välj enheten i verktygsfältet.
3. Klicka **Run** (grön ▶).

Appen **Livskompassen** installeras. Logga in med samma Firebase-konto som på webben.

*(Alternativ i terminal: `npm run android:run` — sync + kör om CLI stödjer det.)*

---

## Steg 4 — Lägg widget på hemskärmen

1. **Långtryck** på hemskärmen (tom yta).
2. Välj **Widgets** (svenska Android kan visa **Miniprogram** eller **Widgetar**).
3. Scrolla till **Livskompassen**.
4. Dra widget till skärmen — t.ex. **Inspelning** (WH1).

| Widget | Funktion |
|--------|----------|
| **Inspelning** | Öppnar inspelning → datum, AI-titel, lås i Valvet |
| **Anteckning** | Snabb rad → Valv |
| **Kompass** | Check-in (morgon/dag/kväll) |
| **Hamn · BIFF** | Grey Rock / BIFF |

Tryck på widgeten → appen öppnar rätt `/widget/…`-sida.

**WH1 första gången:** kort etik-info → godkänn → inspelning kan starta automatiskt. Mikrofonbehörighet godkänns i appen.

---

## Steg 5 — Efter kodändringar

Varje gång du ändrat React/web:

```bash
npm run cap:sync
```

Kör **Run** igen i Android Studio (eller `npm run android:run`).

Ändringar **endast** i Java/XML under `android/` kräver oftast bara **Run** — inte alltid ny `cap:sync`.

---

## Firebase / backend (separat från widget-bygget)

Widgets använder samma backend som webben:

| Funktion | Kräver |
|----------|--------|
| Inloggning | Firebase Auth (konfigurerad) |
| WH1 inspelning → Valv | Firestore + Storage + deployad `ingestWidgetRecording` |

Deploy functions (när du vill ha full AI-titel):

```bash
cd functions && npm run build
firebase deploy --only functions:ingestWidgetRecording
```

Utan deploy fungerar inspelning ändå — med **fallback-titel** från datum/transkript.

Hosting (web/PWA) är separat: `npm run build && firebase deploy --only hosting` — inte krävs för native APK som bundlar `dist/` lokalt.

---

## Felsökning (kort)

| Problem | Åtgärd |
|---------|--------|
| «Unable to locate Java» | Öppna Android Studio → installera JDK 17 via Settings |
| Gradle sync fail | **File → Sync Project with Gradle Files** |
| Widget syns inte | App måste vara **installerad** minst en gång via Run |
| Inspelning sparas inte | Logga in i appen; kontrollera nätverk och Firestore-regler |
| Mikrofon nekad | Appinställningar → Livskompassen → Tillåt mikrofon |

---

## Relaterade filer

| Fil | Innehåll |
|-----|----------|
| [`android/README.md`](../../android/README.md) | Kort teknisk översikt |
| [`ANDROID-WIDGETS-SPEC.md`](./ANDROID-WIDGETS-SPEC.md) | Arkitektur WH1–WH4 |
| [`HOMESCREEN-WIDGETS-SPEC.md`](./HOMESCREEN-WIDGETS-SPEC.md) | PWA + Android |
