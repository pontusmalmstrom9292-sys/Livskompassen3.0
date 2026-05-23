# Android — native hemskärms-widgets

**Beslut 2026-05-23** · **P1 implementerad** (Capacitor 6 + `AppWidgetProvider`)

---

## Arkitektur

```
[Hemskärm widget WH1–WH4]
        ↓ PendingIntent
MainActivity (Capacitor Bridge)
        ↓ evaluateJavascript
livskompassen-widget-nav → React Router
        ↓
/widget/inspelning | anteckning | kompass | hamn
        ↓
Samma WORM-pipeline som PWA (WH1 → ingestWidgetRecording)
```

**Inte** separat native inspelnings-UI — widget öppnar WebView-routen (mikrofon + Valv kräver inloggad session).

---

## Widget-katalog (Android)

| Provider | Label | Route |
|----------|-------|-------|
| `RecordWidgetProvider` | Inspelning | `/widget/inspelning?autostart=1` |
| `NoteWidgetProvider` | Anteckning | `/widget/anteckning` |
| `CompassWidgetProvider` | Kompass | `/widget/kompass` |
| `HamnWidgetProvider` | Hamn · BIFF | `/widget/hamn` |

Layout: `widget_tile.xml` — nordisk skymning, guldkant 1.5dp.

---

## Capacitor

| Fil | Innehåll |
|-----|----------|
| `capacitor.config.ts` | `appId: com.livskompassen.app`, `webDir: dist` |
| `android/` | Native shell (genererad + widgets) |
| `npm run cap:sync` | Build + sync |
| `npm run android:open` | Android Studio |

`google-services.json` → `android/app/` (Firebase Auth samma projekt).

---

## WH1 på Android

1. Användaren trycker **Inspelning**-widget.
2. App startar → autostart inspelning (efter etik-dialog första gången).
3. Stopp → upload `discreet/{ISO}_{slug}.webm` → `ingestWidgetRecording` → `saveVaultLog`.
4. Post låst; sammanfattning i `truth`.

Behörighet: `RECORD_AUDIO` i manifest + runtime (WebView `getUserMedia`).

---

## P2 (framtida)

| | |
|---|---|
| **1×1 ikon-only widget** | Endast guldprick → inspelning |
| **Foreground service** | Inspelning utan att WebView är synlig (policy + barn-säkerhet) |
| **Widget preview** | PNG i `res/drawable-nodpi` |

iOS WidgetKit: separat spec (ej denna fil).

---

## Installera (användare)

Se [`android/README.md`](../../android/README.md).
