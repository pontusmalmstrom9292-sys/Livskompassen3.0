# Android — native hemskärms-widgets

**Beslut 2026-05-23** · **P1 implementerad** (Capacitor 6 + `AppWidgetProvider`)

**Byggguide:** [`BUILD-ANDROID-WIDGETS-SV.md`](./BUILD-ANDROID-WIDGETS-SV.md) — förutsättningar, `cap:sync`, Android Studio, hemskärm, kostnad.

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

| Provider | Label (hemskärm) | Route |
|----------|------------------|-------|
| `RecordWidgetProvider` | **Anteckningar** (diskret) | `/widget/inspelning?autostart=1&discreet=1` |
| `NoteWidgetProvider` | Anteckning | `/widget/anteckning` |
| `CompassWidgetProvider` | Kompass | `/widget/kompass` |
| `HamnWidgetProvider` | Hamn · BIFF | `/widget/hamn` |

WH1-layout: `widget_discreet_note.xml` — anteckningsikon, guldkant, **ingen** «Inspelning»-text. Övriga widgets: `widget_tile.xml`.

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

## WH1 på Android (diskret)

1. Användaren trycker **Anteckningar**-widget (neutral etikett utåt).
2. App startar → autostart inspelning (efter etik-dialog första gången).
3. Stopp → upload `discreet/{ISO}_{slug}.webm` → `ingestWidgetRecording` (titel/sammanfattning).
4. **Metadata-steg (valfritt):** vem / vad / varför i appen → `lockWidgetRecordingToVault` → `saveVaultLog` WORM.
5. Post låst; kontext + sammanfattning i `truth`.

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

- **Steg för steg + gratis/kostnad:** [`BUILD-ANDROID-WIDGETS-SV.md`](./BUILD-ANDROID-WIDGETS-SV.md)
- **Kort teknisk översikt:** [`android/README.md`](../../android/README.md)
