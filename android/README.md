# Livskompassen — Android (Capacitor + native widgets)

**Package:** `com.livskompassen.app`  
**Widgets:** WH1 Anteckningar (diskret) · WH2 Anteckning · WH3 Kompass · WH4 Hamn

**Byggguide (svenska, steg för steg + kostnad):** [`docs/design/BUILD-ANDROID-WIDGETS-SV.md`](../docs/design/BUILD-ANDROID-WIDGETS-SV.md)  
Spec: [`docs/design/ANDROID-WIDGETS-SPEC.md`](../docs/design/ANDROID-WIDGETS-SPEC.md)

---

**App-ikon (guld kompass):** `npm run android:icons` från repo-root (källa: `docs/design/themes/app-icon-livskompassen.png`).

## Krav

- Android Studio (Ladybug eller nyare)
- JDK 17
- Android SDK 34

---

## Bygg & kör

```bash
# Från repo-root — lokal dev (bundlad dist/)
npm run cap:sync
npm run android:open

# Prod: WebView laddar live Hosting (uppdateras vid push till main)
npm run cap:sync:prod
npm run android:open      # Run i Studio (USB) — engång eller vid widget-ändring
```

I Android Studio: **Run** på enhet/emulator.

**Gradle sync fail** (`Could not read script …/capacitor-cordova-android-plugins/…`): kör `npm run cap:sync:prod` i repo-root, sedan **File → Sync Project with Gradle Files**.

---

## Lägg till widget på hemskärmen

1. Installera appen (debug eller release APK).
2. Långtryck hemskärmen → **Widgets** / **Miniprogram**.
3. Sök **Livskompassen** — välj **Anteckningar** (WH1, diskret).
4. Tryck widgeten → appen öppnar `/widget/inspelning?autostart=1&discreet=1`.

WH1 inspelning: datumstämpel, AI-titel, WORM i Valvet (samma pipeline som web).

---

## Filer

| Sökväg | Roll |
|--------|------|
| `app/.../widgets/RecordWidgetProvider.java` | WH1 diskret → inspelning |
| `app/.../widgets/WidgetLaunch.java` | Deep-link till WebView |
| `app/.../MainActivity.java` | `livskompassen-widget-nav` event |
| `res/layout/widget_discreet_note.xml` | WH1: anteckningsikon + guldkant |
| `res/layout/widget_tile.xml` | WH2–WH4: guld kant, mörk bakgrund |

Web bridge: `src/modules/widgets/WidgetDeepLinkBridge.tsx`
