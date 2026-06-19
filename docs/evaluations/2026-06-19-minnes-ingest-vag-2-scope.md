# Minnes ingest våg 2 — implementationsscope

**Datum:** 2026-06-19  
**Status:** Read-only scope memo  
**Spår:** Minnes-Arkitekten / ingest våg 2a + 2b

---

## 1. Verifierad nulägesbild

Följande är verifierat i kod:

- `ingestWidgetRecording` analyserar bara idag och returnerar ingen klassificering eller persist-routing: `functions/src/callables/agents.ts:644-666`.
- Widgetflödet laddar upp ljud + sparar sedan direkt i Valvet via `saveVaultLog`, alltså helt utanför `routeInboxToWorm`: `src/modules/features/widgets/api/widgetVaultRecording.ts:97-155`.
- Delad inkastklassificering finns redan, inklusive heuristiker och `buildInboxClassifyBlob()`: `functions/src/lib/inboxClassifier.ts:74-349`.
- Delad routing finns redan och kan skriva till `reality_vault`, `children_logs`, `journal`, `planning_tasks`, `kb_docs` eller `inbox_queue`: `functions/src/lib/inboxPersist.ts:281-439`.
- `sourceRef` är redan ett tillåtet WORM-fält för både `reality_vault` och `children_logs`: `firestore.rules:88-160`, `src/modules/core/types/firestore.ts:21-42`.
- Vault-session för callables finns redan som befintligt mönster via `vaultSessionToken` / `withVaultSessionPayload()`: `functions/src/lib/vaultSessionGate.ts:99-141`, `src/modules/core/auth/vaultServerSession.ts:59-67`.

**Rekommendation:** håll våg 2a minimal och återanvänd befintligt `sourceRef`. Introducera **inte** ett nytt `provenance`-mapfält i WORM-dokument i denna våg, eftersom det då också kräver `firestore.rules` + `wormPayload.ts` schemaändring.

---

## 2. Våg 2a — exakta filer/funktioner för provenance fields

### Mål

Ge widget-inspelningar en **stabil, maskinläsbar proveniens** utan att öppna rules-scope. Minsta säkra formen är:

- `storagePath` i frontend/transport
- `sourceRef` i WORM-post
- fortsatt `recordedAtIso` / `durationSeconds` i `truth`-texten, inte som nya top-level WORM-fält

### Exakta ändringar

| Fil | Funktion / typ | Ändring |
|---|---|---|
| `src/modules/core/firebase/storage.ts` | `uploadDiscreetRecording()` | Ändra returtyp från `Promise<string>` till `Promise<{ storagePath: string; downloadUrl: string }>` så widgetflödet får en stabil referens, inte bara URL. Nu returneras bara download URL: `src/modules/core/firebase/storage.ts:65-80`. |
| `src/modules/features/widgets/api/widgetVaultRecording.ts` | `PreparedWidgetRecording` | Lägg till `storagePath` och helst färdig `sourceRef` på prepared-objektet. Nu finns bara `evidenceUrl`, `recordedAtIso`, `transcript`, `durationSeconds`: `src/modules/features/widgets/api/widgetVaultRecording.ts:18-24`. |
| `src/modules/features/widgets/api/widgetVaultRecording.ts` | `prepareWidgetRecording()` | Spara både `downloadUrl` och `storagePath` från upload-steget och bygg ett stabilt `sourceRef`, t.ex. `storage:vault_evidence/.../discreet/...`. |
| `src/modules/features/widgets/api/widgetVaultRecording.ts` | `lockWidgetRecordingToVault()` | Skicka `sourceRef` till `saveVaultLog()`. `VaultLog.sourceRef` finns redan i typen: `src/modules/core/types/firestore.ts:21-42`. |

### Minsta diff för 2a

**Ingen** ändring krävs i:

- `firestore.rules`
- `functions/src/lib/wormPayload.ts`
- `functions/src/sharedRules.ts`
- `functions/src/lib/widgetRecordingAnalyze.ts`

Detta gäller **om** 2a stannar vid befintligt `sourceRef` och inte introducerar nya WORM-fält.

### Viktig guardrail

Om produktvillkoret för 2a egentligen betyder nya separata WORM-fält som `provenance`, `storagePath`, `recordedAtIso` eller `durationSeconds` i `reality_vault`, då blir scope större och kräver:

- `firestore.rules:88-114`
- `functions/src/lib/wormPayload.ts:9-33`
- eventuellt `src/modules/core/types/firestore.ts:21-42`

Det är **inte** minimal 2a.

---

## 3. Våg 2b — exakta filer/funktioner för widget -> classify -> routeInboxToWorm

### Mål

Flytta widgetens one-shot-ingest från:

`widget upload -> analyze -> saveVaultLog`

till:

`widget upload -> analyze -> classifyInboxDocument -> routeInboxToWorm`

utan ny callable och utan cross-silo.

### Exakta ändringar

| Fil | Funktion / typ | Ändring |
|---|---|---|
| `functions/src/callables/agents.ts` | `ingestWidgetRecording()` | Utöka callable så den tar emot `transcript`, `recordedAt`, `durationSeconds`, `evidenceUrl`, `sourceRef`/`storagePath`, samt använder befintlig `vaultSessionToken` när bevis auto-persisteras. Idag kör den bara `analyzeWidgetRecording()` och returnerar analys: `functions/src/callables/agents.ts:644-666`. |
| `functions/src/callables/agents.ts` | `ingestWidgetRecording()` | Efter analys: bygg klassificeringsblob med `buildInboxClassifyBlob(...)`, kör `classifyInboxDocument(...)`, därefter `routeInboxToWorm(...)`. Returnera minst `classification`, `action`, `collection`, `docId`, `queueId`, `title`. |
| `functions/src/lib/inboxClassifier.ts` | `heuristicInboxClassify()` | Lägg till widget-specifik deterministisk gren för `sourceModule: widget_recording` eller liknande. Rekommenderad default: `bevis`, med barnoverride när `Kasper`/`Arvid` + barnsignal hittas. Detta bevarar widgetens nuvarande bevis-intent men låter Barnen-route fånga rätt fall. Nu finns ingen widget-specifik heuristik alls: `functions/src/lib/inboxClassifier.ts:74-277`. |
| `functions/src/lib/inboxClassifier.ts` | `buildInboxClassifyBlob()` | Återanvänd befintlig helper. Ingen stor omskrivning behövs, men widgetflödet måste börja skicka ett tydligt `sourceModule`. |
| `functions/src/lib/inboxPersist.ts` | `routeInboxToWorm()` | Utöka signaturen med `sourceRef?: string` eller likvärdig override så widgetflödet inte tvingas genom `drive:`-format. Nu bygger downstream persist-funktioner sourceRef från `driveFileId`: `functions/src/lib/inboxPersist.ts:79-129`, `131-193`, `281-439`. |
| `functions/src/lib/inboxPersist.ts` | `persistVaultFromInbox()` | Sluta hårdkoda `driveInboxSourceRef(input.driveFileId)`; använd generisk `sourceRef` om den finns, annars drive-default. |
| `functions/src/lib/inboxPersist.ts` | `persistChildrenLogFromInbox()` | Samma som ovan: använd generisk `sourceRef` om skickad. |
| `functions/src/lib/wormPayload.ts` | helper-lager | Byt ut eller komplettera `driveInboxSourceRef()` med en generell builder, t.ex. `buildInboxSourceRef(kind, rawId)` eller separat `widgetInboxSourceRef(storagePath)`. Nu finns bara drive-specifik helper: `functions/src/lib/wormPayload.ts:56-58`. |
| `src/modules/features/widgets/api/widgetVaultRecording.ts` | `ingestWidgetRecordingToVault()` | Ändra från direkt Valv-save till callable-baserad routing. Behåll gärna exportnamnet i denna våg för att minimera UI-churn, men låt implementationen gå via `ingestWidgetRecording` callable. |
| `src/modules/features/widgets/api/widgetVaultRecording.ts` | `prepareWidgetRecording()` | Skicka `downloadUrl`, `sourceRef` och widgetens `sourceModule` vidare till callable-payloaden. |
| `src/modules/features/widgets/api/actionDashboardApi.ts` | `saveActionVaultRecording()` | Anpassa returhanteringen från vault-only (`vaultId`) till generell route-respons (`collection/docId/queueId/title`). Idag antar API-lagret att resultatet alltid är Valv: `src/modules/features/widgets/api/actionDashboardApi.ts:220-265`. |

### Rekommenderad minimal routingpolicy för widget

1. **Default:** `sourceModule: widget_recording` -> `bevis`
2. **Barnoverride:** om widgettranskript tydligt är barnobservation -> `barnen`
3. **Trauma/LVU/osäkerhet:** fail-closed till `review` / `inbox_queue`
4. **Ingen auto-kunskap** som default för widget, även om texten råkar låta som "fakta"

Detta ligger närmast nuvarande produktsemantik, där widgetcopy explicit säger Valvet: `src/modules/features/widgets/pages/WidgetRecordPage.tsx:40-46`, `104-115`.

### Vault-session detalj som måste wire:as

`routeInboxToWorm()` köar `bevis` när `hasVaultSession === false`: `functions/src/lib/inboxPersist.ts:303-327`. Därför måste 2b återanvända befintlig callable-session:

- frontend: `withVaultSessionPayload(...)` från `src/modules/core/auth/vaultServerSession.ts:59-67`
- backend: `assertVaultSession()` / `readVaultSessionToken()` i `functions/src/lib/vaultSessionGate.ts:21-25`, `99-141`

Annars blir widget-bevis **review-kö** i stället för direkt `reality_vault`.

### Explicit icke-mål i minimal 2b

- Ingen ny callable
- Ingen ändring i ADK-synapser
- Ingen ändring i `notifyNewFile`
- Ingen prompt-omskrivning i `sharedRules.ts`
- Ingen rules-ändring om 2a håller sig till `sourceRef`

---

## 4. Minimal diff-estimat

### 2a — provenance only

| Fil | Estimat |
|---|---:|
| `src/modules/core/firebase/storage.ts` | 8-14 rader |
| `src/modules/features/widgets/api/widgetVaultRecording.ts` | 18-30 rader |
| **Summa 2a** | **26-44 rader** |

### 2b — route via inbox pipeline

| Fil | Estimat |
|---|---:|
| `functions/src/callables/agents.ts` | 45-70 rader |
| `functions/src/lib/inboxPersist.ts` | 35-60 rader |
| `functions/src/lib/wormPayload.ts` | 10-18 rader |
| `functions/src/lib/inboxClassifier.ts` | 12-22 rader |
| `src/modules/features/widgets/api/widgetVaultRecording.ts` | 25-45 rader |
| `src/modules/features/widgets/api/actionDashboardApi.ts` | 8-16 rader |
| **Summa 2b (utan UI-copy)** | **135-231 rader** |

### Liten men verklig följdrisk utanför backend-scope

Två UI-filer hårdkodar idag Valvet som enda utfall:

- `src/modules/features/widgets/components/ActionDashboard.tsx:197-201`
- `src/modules/features/widgets/pages/WidgetRecordPage.tsx:40-46`, `92-108`

Om 2b börjar returnera `barnen`, `journal` eller `queued`, behövs sannolikt **12-25 rader** copy/status-justering i ett senare steg. Jag rekommenderar att detta markeras som separat frontend-tail, inte bakas in i minnes/backend-diffen om målet är minimal scope.

---

## 5. Smoke tests att lägga till

### A. Ny statisk smoke: `scripts/smoke_widget_ingest.mjs`

Syfte: säkra att widget one-shot faktiskt använder samma pipeline som Inkast.

Kontroller:

- `functions/src/callables/agents.ts` innehåller:
  - `ingestWidgetRecording`
  - `classifyInboxDocument`
  - `buildInboxClassifyBlob`
  - `routeInboxToWorm`
- `src/modules/features/widgets/api/widgetVaultRecording.ts` innehåller:
  - `withVaultSessionPayload`
  - callable-namnet `ingestWidgetRecording`
- one-shot-vägen importerar inte längre `saveVaultLog` direkt om 2b fullt aktiveras

**Föreslaget scriptnamn:** `npm run smoke:widget-ingest`

### B. Utöka `scripts/smoke_inbox_sort.mjs`

Lägg till två fall:

1. `sourceModule: widget_recording` + neutral ex-/konflikttranskript -> `bevis`
2. `sourceModule: widget_recording` + `Kasper`/`Arvid` + barnsignal -> `barnen`

Det verifierar att 2b inte gör widget till implicit Kunskap-ingest.

### C. Utöka `scripts/smoke_orkester_wiring.mjs`

Lägg till statisk kontroll att `ingestWidgetRecording` nu går via delad inbox-pipeline, inte bara analys.

### D. Kör efter implementation

Minsta verifiering efter 2a/2b:

```bash
cd functions && npm run build
cd .. && npm run smoke:inbox
npm run smoke:orkester
```

Lägg dessutom till:

- `npm run smoke:vault-worm` om bevisvägen fortfarande ska persistera direkt
- `npm run smoke:children` om widget nu kan auto-routa till Barnen

---

## 6. Deploy function names

### Function deploy

Minimal 2b kan återanvända befintligt exportnamn:

- `ingestWidgetRecording` — exporten finns redan i `functions/src/index.ts:45-65`

**Deploy-rad för backenddelen:**

```bash
cd functions && npm run build
firebase deploy --only functions:ingestWidgetRecording
```

### Frontend deploy

Eftersom både `widgetVaultRecording.ts` och sannolikt `actionDashboardApi.ts` ändras i 2a/2b behövs även hosting-deploy när vågen är färdig:

```bash
npm run build
firebase deploy --only hosting
```

**Ingen** separat deploy behövs för:

- `notifyNewFile`
- `submitInkastLite`
- ADK-synapser

så länge scope hålls till befintlig widget-callable + delade lib-filer.

---

## 7. Rekommenderad ordning

1. **2a först:** returnera `storagePath` och skriv `sourceRef`
2. **2b därefter:** återanvänd samma callable-namn och samma `vaultSessionToken`-mönster
3. **UI-copy separat om behövs:** endast om widget ska kunna visa annat än "Låst i Valvet"

**Ett nästa steg:** godkänn `sourceRef-only` som minimal 2a, så kan 2b byggas utan rules- eller promptscope.
