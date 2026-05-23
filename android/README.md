# Livskompassen — Android (Capacitor + native widgets)

**Package:** `com.livskompassen.app`  
**Widgets:** WH1 Inspelning · WH2 Anteckning · WH3 Kompass · WH4 Hamn

**Byggguide (svenska, steg för steg + kostnad):** [`docs/design/BUILD-ANDROID-WIDGETS-SV.md`](../docs/design/BUILD-ANDROID-WIDGETS-SV.md)  
Spec: [`docs/design/ANDROID-WIDGETS-SPEC.md`](../docs/design/ANDROID-WIDGETS-SPEC.md)

---

## Krav

- Android Studio (Ladybug eller nyare)
- JDK 17
- Android SDK 34

---

## Bygg & kör

```bash
# Från repo-root
npm run cap:sync          # build web + kopiera till android/
npm run android:open      # öppnar Android Studio
```

I Android Studio: **Run** på enhet/emulator.

---

## Lägg till widget på hemskärmen

1. Installera appen (debug eller release APK).
2. Långtryck hemskärmen → **Widgets** / **Miniprogram**.
3. Sök **Livskompassen** — välj t.ex. **Inspelning**.
4. Tryck widgeten → appen öppnar `/widget/inspelning?autostart=1`.

WH1 inspelning: datumstämpel, AI-titel, WORM i Valvet (samma pipeline som web).

---

## Filer

| Sökväg | Roll |
|--------|------|
| `app/.../widgets/RecordWidgetProvider.java` | WH1 |
| `app/.../widgets/WidgetLaunch.java` | Deep-link till WebView |
| `app/.../MainActivity.java` | `livskompassen-widget-nav` event |
| `res/layout/widget_tile.xml` | Guld kant, mörk bakgrund |

Web bridge: `src/modules/widgets/WidgetDeepLinkBridge.tsx`
