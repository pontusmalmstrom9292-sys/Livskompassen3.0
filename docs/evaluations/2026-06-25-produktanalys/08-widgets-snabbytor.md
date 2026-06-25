# Prompt 8 — Widgets / snabbytor / mobil first

**Datum:** 2026-06-25  
**Plattform:** Cursor (Composer)  
**Typ:** Analys — inga kodändringar  
**Perspektiv:** Mobilstrateg · Android/iOS UX · systems thinking

---

## Nuläge (kort)

**Fyren:** `FyrenWidgetBar` + `FyrenSideQuickDock` — snabbåtgärder ovanför dock (Inkast, Brusfiltret, Voice-to-Vault, Snabbval, inspelning, anteckning, projekt, planering, Valv).

**Widget-routes:** `/widget/*` — inspelning · anteckning · kompass · hamn · familjen · stämpla · barnporten · snabbval · voice-vault · projekt · aktioner.

**Android (Capacitor):** `WidgetLaunch` → `WidgetDeepLinkBridge` → React Router. Native providers: **Diskret inspelning** (`RecordWidgetProvider`, label «Anteckningar»), Hamn, Kompass, Anteckning, Stämpla.

**Silo-koppling idag:**

| Route | Destination | Silo |
|-------|-------------|------|
| `/widget/anteckning` | `saveVaultLog` | **Valv/bevis** |
| `/widget/familjen` | `saveChildrenLog` | **Barnen** |
| `/widget/inspelning` | `widgetRecordingIngestSynapse` | **Valv** (WH1, etikgrind) |
| `/widget/voice-vault` | reality_vault | **Valv** |
| `/#inkast-lite` / Zen | `submitInkastLite` | **DCAP → senare routing** |
| `/widget/snabbval` | `HomeQuickModules` | **Blandat** (dagbok/uppgift/quiz) |
| `/widget/hamn` | Brusfilter/BIFF | **Hamn** (Speglar-zon) |

**Säkerhet:** `WidgetRecordingEthicsGate` · Valv kräver PIN/session · Zero Footprint via `useZeroFootprint` · barnlogg ≠ auto-promote Valv.

---

## 15 widget- / mikroflödesidéer

### 1. Silo-chip före spar

| Fält | Innehåll |
|------|----------|
| **Namn** | Silo-chip |
| **Syfte** | Tvinga explicit val: Dagbok · Bevis · Barn · MåBra · Planering innan save |
| **Situation** | Osäker var text/röst ska landa |
| **Bästa silo** | DCAP-routing (meta) |
| **Säkerhetskrav** | Ingen default till Valv; audit-logg på val; WORM per silo |
| **Implementation** | Web: `WidgetShell` steg 1 · Android: ingen preview-text på widget |

---

### 2. Diskret inspelning (WH1, förstärkt)

| Fält | Innehåll |
|------|----------|
| **Namn** | Anteckningar-chip |
| **Syfte** | Röst → Valv utan «inspelning» på hemskärmen |
| **Situation** | Bevis i konflikt, diskret fångst |
| **Bästa silo** | **Valv/bevis** |
| **Säkerhetskrav** | Etikgrind · autostart endast efter accept · ingen lokal fil kvar |
| **Implementation** | **Android AppWidget** (finns) + iOS Shortcuts-paritet senare |

---

### 3. Töm huvudet (Zen inkast)

| Fält | Innehåll |
|------|----------|
| **Namn** | Zen fångst |
| **Syfte** | Fullskärm textarea → `submitInkastLite` → stäng |
| **Situation** | Överbelastad, behöver tömma utan silo-beslut |
| **Best silo** | **Inkast/DCAP** (ej direkt journal) |
| **Säkerhetskrav** | Zero Footprint i UI; klassificering server-side |
| **Implementation** | PWA shortcut + Fyren «Inkast» · `ZenModeOverlay` |

---

### 4. Brusfiltret snabbklistra

| Fält | Innehåll |
|------|----------|
| **Namn** | Hamn-klistra |
| **Syfte** | Read clipboard → BIFF/Grey Rock-förslag, inget auto-send |
| **Situation** | SMS från ex vid låsskärm |
| **Bästa silo** | **Hamn/Speglar** |
| **Säkerhetskrav** | Zero Footprint on exit · ingen push · clipboard rensas valfritt |
| **Implementation** | `/widget/hamn` · Android Hamn-widget (finns) |

---

### 5. Barnobservation 1-rad

| Fält | Innehåll |
|------|----------|
| **Namn** | Livslogg-snabb |
| **Syfte** | Välj barn → neutral observation → `children_logs` WORM |
| **Situation** | Pojkarna sa något i bilen |
| **Bästa silo** | **Barnen** |
| **Säkerhetskrav** | **Ingen** auto-promote Valv · alias only · HITL vid evidence |
| **Implementation** | `/widget/familjen` (finns) · kom ihåg senaste barn |

---

### 6. Dagbok humör-only

| Fält | Innehåll |
|------|----------|
| **Namn** | Dagbok-puls |
| **Syfte** | 1–2 taps humör → journal (inte Valv) |
| **Situation** | Kvällsreflektion, låg energi |
| **Bästa silo** | **Dagbok/Hjärtat** |
| **Säkerhetskrav** | Separat collection · ingen preview på widget |
| **Implementation** | Web: utöka `HomeDagbokPanel` i `/widget/snabbval` |

---

### 7. MåBra andning 2 min

| Fält | Innehåll |
|------|----------|
| **Namn** | Andas-chip |
| **Syfte** | Timer + en rad; spar endast om användaren vill |
| **Situation** | Panik, RSD, hypervigilans |
| **Bästa silo** | **MåBra** |
| **Säkerhetskrav** | Default ephemeral · opt-in session save |
| **Implementation** | Ny `/widget/andning` · Fyren snabbval |

---

### 8. Planering P3 snabb-uppgift

| Fält | Innehåll |
|------|----------|
| **Namn** | En uppgift |
| **Syfte** | Skriv titel → lägg i P3 «Att göra» |
| **Situation** | ADHD «måste komma ihåg» utan planeringsdjup |
| **Bästa silo** | **Planering** |
| **Säkerhetskrav** | Ingen koppling till Valv/bevis |
| **Implementation** | `/widget/projekt` + `WidgetProjektPage` sheet (finns delvis) |

---

### 9. Voice-to-Valv med PIN-steg

| Fält | Innehåll |
|------|----------|
| **Namn** | Röst till Valv |
| **Syfte** | Tyst inspelning → `reality_vault` efter auth |
| **Situation** | Bevis som kräver tidsstämpel |
| **Bästa silo** | **Valv/bevis** |
| **Säkerhetskrav** | Auth + etik · CMEK transit · WORM append |
| **Implementation** | `/widget/voice-vault` (finns) · Fyren + side dock |

---

### 10. Valv snabbanteckning (låst)

| Fält | Innehåll |
|------|----------|
| **Namn** | Bevis-rad |
| **Syfte** | En rad text → `saveVaultLog` WORM |
| **Situation** | Händelse precis inträffat |
| **Bästa silo** | **Valv/bevis** |
| **Säkerhetskrav** | Auth · tydlig «låses»-copy · PIN för läsning |
| **Implementation** | `/widget/anteckning` (finns) — **inte** dagbok |

---

### 11. Morgonkompassen glance

| Fält | Innehåll |
|------|----------|
| **Namn** | Kompass-widget |
| **Syfte** | Visa dagens fokusord (efter inlogg) — ingen känslig text |
| **Situation** | Morgon, låg kapacitet |
| **Bästa silo** | **Planering/MåBra** (publikt läge) |
| **Säkerhetskrav** | Generiska labels på widget; detalj i app |
| **Implementation** | Android `CompassWidgetProvider` · `/widget/kompass` |

---

### 12. Stämpla tid

| Fält | Innehåll |
|------|----------|
| **Namn** | Stämpel-chip |
| **Syfte** | In/ut-stämpel arbetsliv |
| **Situation** | På jobbet, snabb logg |
| **Bästa silo** | **Arbetsliv/Vardagen** |
| **Säkerhetskrav** | Separat från barn/Valv |
| **Implementation** | Android `StampWidgetProvider` · `/widget/stampla` |

---

### 13. Åtgärder-dashboard

| Fält | Innehåll |
|------|----------|
| **Namn** | Aktioner |
| **Syfte** | WH1-inspelning + metadata i ett flöde |
| **Situation** | Strukturerad fångst efter händelse |
| **Bästa silo** | **Valv** (primärt) |
| **Säkerhetskrav** | Etikgrind · explicit commit |
| **Implementation** | `/widget/aktioner` · `WidgetActionDashboardPage` |

---

### 14. Barnporten HITL-ingång

| Fält | Innehåll |
|------|----------|
| **Namn** | Barnporten-snabb |
| **Syfte** | Barn-initierad signal → förälder granskar |
| **Situation** | Barn trycker «behöver prata» |
| **Bästa silo** | **Barnen/HITL** |
| **Säkerhetskrav** | **HITL** obligatorisk · ingen LLM auto-svar till barn |
| **Implementation** | `/widget/barnporten` (finns) · separat ikon/copy |

---

### 15. Panik dölj (global mikrointeraktion)

| Fält | Innehåll |
|------|----------|
| **Namn** | Dölj nu |
| **Syfte** | En tap: blur WebView, lås Valv, navigera neutral hem |
| **Situation** | Någon tittar på skärmen |
| **Bästa silo** | **Zero Footprint** (meta) |
| **Säkerhetskrav** | Rensa RAM-state · ingen sensitive thumbnail |
| **Implementation** | Capacitor plugin + alla `WidgetShell` · Quick Settings (Android) |

---

## 5 idéer för Android

### A1. App Shortcuts (long-press ikon)

| Fält | Innehåll |
|------|----------|
| **Namn** | Silo-shortcuts |
| **Syfte** | 4 statiska genvägar: Inkast · Hamn · Barn · Andning |
| **Situation** | Snabbare än widget utan hemskärmsyta |
| **Bästa silo** | Meta-routing |
| **Säkerhetskrav** | Deep-link med auth-gate · ingen content i shortcut label |
| **Implementation** | `shortcuts.xml` + `WidgetLaunch.pendingIntent` |

---

### A2. Quick Settings — «Dölj»

| Fält | Innehåll |
|------|----------|
| **Namn** | Panik-tile |
| **Syfte** | System-rail döljer app utan att öppna den |
| **Situation** | Akut plausible deniability |
| **Bästa silo** | Zero Footprint |
| **Säkerhetskrav** | Finish activity · FLAG_SECURE valfritt · rensa pending widget path |
| **Implementation** | Custom `TileService` → broadcast till MainActivity |

---

### A3. Widget utan textpreview

| Fält | Innehåll |
|------|----------|
| **Namn** | Neutral chip-rad |
| **Syfte** | Endast ikon + generisk label på launcher |
| **Situation** | Delad/enhet med barn |
| **Bästa silo** | Alla |
| **Säkerhetskrav** | `widget_discreet_title` mönster · aldrig senaste post |
| **Implementation** | Utöka `WidgetViews.chip` · audit alla providers |

---

### A4. Biometri → direkt route

| Fält | Innehåll |
|------|----------|
| **Namn** | Lås upp till widget |
| **Syfte** | Fingeravtryck öppnar `/widget/hamn` utan att flasha senaste sida |
| **Situation** | Konflikt-SMS under tidspress |
| **Bästa silo** | Hamn / Valv |
| **Säkerhetskrav** | Splash neutral · rensa WebView history on panic |
| **Implementation** | Capacitor + AndroidX Biometric · `WidgetDeepLinkBridge` first paint |

---

### A5. Offline inspelningskö

| Fält | Innehåll |
|------|----------|
| **Namn** | Köad WH1 |
| **Syfte** | Spela in offline → krypterad blob → flush vid nätverk |
| **Situation** | Tunn täckning, måste fånga nu |
| **Bästra silo** | Valv |
| **Säkerhetskrav** | EncryptedSharedPreferences · TTL · manuell radering · etikgrind före record |
| **Implementation** | Native buffer + `widgetRecordingCommit` (finns server-side) |

---

## 5 idéer för PWA / web

### W1. Web Share Target

| Fält | Innehåll |
|------|----------|
| **Namn** | Dela till Inkast |
| **Syfte** | Ta emot text/bild från OS «Dela» → inkast |
| **Situation** | Screenshot/mejl att klassificera senare |
| **Bästa silo** | Inkast/DCAP |
| **Säkerhetskrav** | Auth före upload · ingen localStorage av payload efter send |
| **Implementation** | `manifest.json` share_target · `/widget/anteckning?source=share` |

---

### W2. Manifest shortcuts (installera app)

| Fält | Innehåll |
|------|----------|
| **Namn** | Hemskärms-genvägar |
| **Syfte** | Snabbval · Hamn · Dagbok utan Fyren |
| **Situation** | iOS/Android «Lägg till på hemskärmen» |
| **Bästa silo** | Meta |
| **Säkerhetskrav** | Generiska namn · auth gate |
| **Implementation** | `shortcuts` i web manifest |

---

### W3. Fyren side-dock på desktop PWA

| Fält | Innehåll |
|------|----------|
| **Namn** | Kant-snabb |
| **Syfte** | `FyrenSideQuickDock` alltid synlig i standalone |
| **Situation** | Mac/PC arbetssession |
| **Bästa silo** | Meta |
| **Säkerhetskrav** | Döljbar · Zero Footprint on blur |
| **Implementation** | CSS + `readFyrenSideQuickHidden` (finns) |

---

### W4. Hold-to-record i dock

| Fält | Innehåll |
|------|----------|
| **Namn** | Fyren hold |
| **Syfte** | Håll Fyren-knappen → inspelning utan extra navigation |
| **Situation** | Mikrointeraktion under promenad |
| **Bästa silo** | Valv (WH1) |
| **Säkerhetskrav** | Etikgrind första gången · haptic feedback |
| **Implementation** | `fyrenWidgetContext` `isHolding` (finns delvis) |

---

### W5. WidgetShell «Stäng = rensa»

| Fält | Innehåll |
|------|----------|
| **Namn** | Rensa vid stäng |
| **Syfte** | All widget-state wiped on unmount/back |
| **Situation** | Delad dator |
| **Bästa silo** | Zero Footprint |
| **Säkerhetskrav** | Obligatorisk pattern för alla `/widget/*` |
| **Implementation** | `WidgetShell` + `useEffect` cleanup audit |

---

## 5 saker som absolut inte ska göras (integritetsrisk)

| # | Undvik | Varför |
|---|--------|--------|
| **X1** | Widget/live tile som visar senaste dagbok/Valv/barnlogg-text | Läckage på låsskärm · plausible deniability förstörd |
| **X2** | Auto-routing från widget till «fel» silo (t.ex. barnobs → Valv, MåBra → bevis) | Bryter tre silos · WORM-förorening |
| **X3** | Röstwidget utan etikgrind eller med lokal okrypterad fil kvar | Juridisk + säkerhetsrisk · WH1-kanon |
| **X4** | Push-notiser med konflikt-, barn- eller journalinnehåll | OS notification center = tredje part |
| **X5** | Recent apps / WebView-screenshot med känslig UI utan blur/`FLAG_SECURE` | Fysisk övervakning · Zero Footprint-hål |

---

## Silo-routing — rekommenderad karta

```
Snabb ingång → Auth? → Silo-val (om oklart) → WORM destination

Dagbok      → journal_entries
Bevis       → vault_log / reality_vault / widget ingest
Barn        → children_logs (HITL till Valv)
MåBra       → mabra_sessions / vit_entries (ej Kunskap)
Planering   → P3 tasks / projekt
Hamn        → ephemeral + Speglar (Zero Footprint default)
Inkast      → DCAP classify → rätt silo senare
```

---

## Prioriterad MVP-våg

| Våg | Leverans |
|-----|----------|
| **1** | #15 Panik dölj · #1 Silo-chip · W5 rensa vid stäng · A3 neutral chip |
| **2** | #6 Dagbok-puls · #7 Andning · W1 Share Target · A1 App Shortcuts |
| **3** | A2 Panik-tile · A5 offline kö · #11 Kompass glance · Barnporten polish |

---

## Koppling till locked UX

- **Planering P3** måste finnas kvar som mål för #8 — inte ersätta Kanban.
- **Barnfokus** ≠ widget snabb — olika flows; barnlogg via `/widget/familjen` only.
- **Valv** widget-routes kräver fortsatt PIN för läsning — widget är **ingång**, inte **arkivvy**.
