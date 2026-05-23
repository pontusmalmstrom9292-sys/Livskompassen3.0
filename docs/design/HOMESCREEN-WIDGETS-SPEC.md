# Hemskärms-widgets (utanför appen)

**Beslut 2026-05-23** · **P0:** PWA-genvägar · **P1:** Native Android `AppWidgetProvider` (Capacitor)  
**Android-spec:** [`ANDROID-WIDGETS-SPEC.md`](./ANDROID-WIDGETS-SPEC.md) · **iOS WidgetKit:** P2

---

## Varför PWA-genvägar först

| Plattform | P0 (nu) | P2 |
|-----------|---------|-----|
| **iOS** | `manifest.shortcuts` → öppnar `/widget/…` i standalone | WidgetKit + App Groups |
| **Android** | Native widgets WH1–WH4 (`android/…/widgets/`) | Foreground service inspelning (P2) |

Varje genväg = **egen hemskärms-ikon** med **minimal skärm** (ingen dock, ingen distraktion).

---

## Widget-katalog (WH)

| ID | Namn | Route | Kärnfunktion |
|----|------|-------|----------------|
| **WH1** | **Inspelning** | `/widget/inspelning` | Mikrofon → transkription → **AI-titel** → WORM + ljudfil + textsammanfattning |
| **WH2** | Anteckning | `/widget/anteckning` | En rad → valv (`widget_anteckning`) |
| **WH3** | Kompass | `/widget/kompass` | Aktiv tidskompass, ett check-in |
| **WH4** | Hamn | `/widget/hamn` | Klistra SMS → BIFF (kort) |
| **WH5** | Familjen | `/widget/familjen` | Snabb barnfokus-rad (neutral) |

**WH1 är kritisk** — se inspelningspipeline nedan.

Mockups: [`references/homescreen-widgets.png`](./references/homescreen-widgets.png) · in-app strip: [`WIDGET-BAR-SPEC.md`](./WIDGET-BAR-SPEC.md)

---

## WH1 — Inspelning (pipeline)

```
[Mikrofon start]
    → parallellt: MediaRecorder + Web Speech (sv-SE)
[Stopp]
    → upload Storage: vault_evidence/{uid}/discreet/{ISO}_{slug}.webm
    → Callable ingestWidgetRecording(transcript, recordedAt)
    → { title, summary, category }
    → saveVaultLog WORM:
         action: widget_inspelning
         category: tyst_inspelning (eller analys)
         truth: SAMMANFATTNING + TRANSKRIPT + metadata
         evidenceUrl: ljudfil
         isLocked: true
[UI] «Låst i Valvet» + titel + öppna Valv
```

### Krav (låsta)

| Krav | Implementation |
|------|----------------|
| **Datumstämpel** | `recordedAt` ISO i filnamn + Firestore `createdAt` |
| **Namn efter analys** | `ingestWidgetRecording` (Gemini) eller fallback från transkript |
| **Lås i valvet** | `saveVaultLog` + `isLocked: true` + WORM |
| **Textsammanfattning** | I `truth` under `SAMMANFATTNING:` |
| **Ingen synlig REC** | WH1-widget: diskret våg/dot — **inte** röd REC (barn-säkerhet) |
| **Kill switch** | Avbryt inspelning, rensa buffer (befintlig store) |

### Valv-visning

Listpost visar **analys-titel** (första raden i `truth` eller `action`-metadata).  
Fil: länk via `evidenceUrl`. Full transkript i expanderad vy (P1 `VaultLogList`).

---

## Installera på hemskärmen (Mac/iPhone)

1. Öppna Livskompassen i Safari/Chrome (inloggad).
2. **Dela** → **Lägg till på hemskärmen**.
3. För **WH1:** håll inne PWA-ikonen → **Genvägar** (Android) eller lägg till separat genväg via manifest (iOS 16.4+ shortcuts vid long-press på ikon).

---

## Kod

| Fil | Roll |
|-----|------|
| `public/manifest.webmanifest` | `shortcuts[]` WH1–WH5 |
| `src/modules/widgets/` | Routes + UI |
| `src/modules/core/components/FyrenWidgetBar.tsx` | In-app kant-lista (samma åtgärder) |
| `functions` `ingestWidgetRecording` | Titel + sammanfattning |
