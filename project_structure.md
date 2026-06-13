# Projektstruktur & Arkitekturöversikt - Livskompassen 3.0

Denna fil ger en strukturerad, teknisk översikt över kodbasens organisation, dess Zustand-tillståndshantering, dess huvudkomponenter samt dess Firebase-integrationsmönster.

---

## 1. Hierarkisk Trädvy (Källkod)

Nedan visas en förenklad trädvy över `src/`-katalogen för att belysa hur kodbasen är organiserad:

```text
src/
├── App.tsx                        # Appens root-skal med leverantörer (providers) och globala vyer
├── main.tsx                       # Applikationens startpunkt och DOM-inläsning
├── index.css                      # Globala stilar och designsystemets CSS-variabler
├── dataconnect-generated/         # Automatiskt genererad kod för Firebase Data Connect
├── components/                    # Globala skal och paneler (blandat legacy och layout)
│   ├── LayoutShell.tsx            # Huvudnavigering (Kompass, Valvet, Orakel)
│   ├── VaultOverview.tsx          # Oföränderlig valvvy (lyssnar på reality_vault)
│   └── Morgonkompassen.tsx        # [LEGACY] Oanvänd komponent som körs mot lokal mock-data
├── services/                      # Delade databas-tjänster (Services)
│   ├── CompassService.ts          # API för intentioner och fokussparning
│   ├── OracleService.ts           # Hybrid-data för stress/kapacitets-indikatorer
│   └── VaultService.ts            # Klientlogik för WORM-valvet (reality_vault)
├── store/                         # Legacy- / Root-tillstånd (stores)
│   ├── MorningStore.ts            # Mockad butik för legacy-Morgonkompassen
│   ├── NavigationStore.ts         # Navigationsvy-tillstånd (activeView)
│   └── useVaultStore.ts           # Zustand-brygga för valvhistorik
├── modules/                       # Domändrivna särkopplade funktionsmoduler (Feature Modules)
│   ├── core/                      # Kärnfunktionalitet för ramverket
│   │   ├── auth/                  # Säkerhet, Sessioner, Zero-Footprint
│   │   ├── firebase/              # Databas-init, offline-cache, WORM-regler
│   │   ├── theme/                 # Temahantering (Obsidian Calm / Nordic Dusk)
│   │   ├── store/                 # Kärntillstånd (sosStore, toastStore, index.ts)
│   │   └── pages/                 # Huvudsidor (HomePage, ValvetRoutePage, ThemeLabPage)
│   ├── morning/                   # Den aktiva, datakopplade Morgonkompassen
│   │   ├── MorningCompass.tsx     # Reaktiva 3-fokus-vyer & anpassningsbara protokoll
│   │   └── morningStore.ts        # Kopplat till user_daily_focus & insight_summaries
│   ├── oracle/                    # Mönsterorakel och visualisering
│   │   ├── OracleDashboard.tsx    # Recharts-grafer med stress- & konfliktdatakorrelationer
│   │   └── OracleStore.ts         # Hämtar data från OracleService
│   ├── reflection/                # Reflektionsmodul (Dagbok & veckosummeringar)
│   ├── support/                   # Kognitivt stöd (Paralysbrytaren)
│   ├── valv_ekonomi/              # Ekonomiplattformen (kontrakt, impulskö, budget)
│   ├── features/                  # Specialiserade underfunktioner
│   │   ├── voiceToVault/          # Röstinspelning och Web Speech API-transkription
│   │   ├── dailyLife/             # Välmående, drogfrihet och MåBra (vagusnerven)
│   │   └── family/                # Trygg hamn, Barnporten, barnloggar
│   ├── inkast/                    # Inbox, manuella formulär och sorteringsköer
│   └── shared/                    # Återanvändbara UI-komponenter, konstanter och typer
```

---

## 2. Zustand-Stores (Tillståndshantering)

Zustand används för både globalt kontexttillstånd och modulspecifik logik. Här är sammanfattningen över de viktigaste butikerna:

### Kärn- och Globala Stores (i `src/modules/core/store/` & `src/store/`)
*   **`useStore` (`src/modules/core/store/index.ts`):** 
    Applikationens centrala nervsystem. Hanterar användarsessioner (`user`, `isAuthenticated`), globala UI-lägen (`activeDrawer`, `compassFilter`, `isVaultUnlocked`, `isMenuOpen`) samt övergripande systemstatus (`isLoading`, `error`). Innehåller även `resetState()` som anropar säkerhetsfunktioner för sessioner.
*   **`useNavigationStore` (`src/store/NavigationStore.ts`):** 
    Håller reda på det aktiva gränssnittet i huvudskalet (antingen `COMPASS`, `VAULT` eller `ORACLE`).
*   **`useSOSStore` (`src/modules/core/store/sosStore.ts`):** 
    Enkelt booleskt tillstånd för det globala SOS/Akut-läget för att snabbt ladda kognitiva jordningsövningar.
*   **`useToastStore` (`src/modules/core/store/toastStore.ts`):** 
    Hanterar tidsbegränsade systemnotifieringar (`success`, `error`, `warning`, `info`) med en inbyggd kö- och avfärdarmekanism.
*   **`useVaultStore` (`src/store/useVaultStore.ts`):** 
    Hanterar lokalt cachad historik för valvet samt laddnings- och felstater vid WORM-insättningar via `VaultService`.

### Modulspecifika Stores (i `src/modules/<modul>/store/`)
*   **`useMorningCompassStore` (`src/modules/morning/morningStore.ts`):** 
    Hanterar de tre dagliga fokusområdena, hämtar den senaste AI-genererade insikten från `insight_summaries` och sparar användarfeedback (acceptera, neka eller justera protokoll) direkt till `user_insights`.
*   **`useOracleStore` (`src/modules/oracle/OracleStore.ts`):** 
    Innehåller och hanterar datamängden för visualisering (stress, kapacitet, arbetstimmar, konflikter) och hämtar denna reaktivt via `OracleService`.
*   **`useParalysisStore` (`src/modules/support/store/paralysisStore.ts`):** 
    Driver "Paralysbrytaren" genom att bryta ner överväldigande arbetsblock till exakt ett hanterbart mikrosteg åt gången.
*   **`useQuickCaptureStore` (`src/modules/features/voiceToVault/store/useQuickCaptureStore.ts`):** 
    Hanterar status för röstinspelning, mikrofontillstånd och generering av transkription via Web Speech API.

---

## 3. Viktiga Komponenter & Ansvarsområden

*   **`LayoutShell` (`src/components/LayoutShell.tsx`):** 
    Det visuella fundamentet som omsluter appen. Ansvarar för den minimala navigeringsbryggan i toppen och växlar asynkront (via `lazy` + `Suspense`) mellan de tre huvudvyerna.
*   **`MorningCompass` (`src/modules/morning/MorningCompass.tsx`):** 
    Huvudskärmen för daglig planering. Den utför debouncerad automatisk sparning av de tre fokusområdena under tiden användaren skriver, och visar en proaktiv "Mönster-Arkivarie"-banner med AI-rekommendationer baserade på stressnivåer.
*   **`VaultOverview` (`src/components/VaultOverview.tsx`):** 
    En säker, isolerad historikvy. Startar en realtids-prenumeration (`onSnapshot`) mot användarens krypterade/skyddade poster i `reality_vault` och formaterar dem kronologiskt utan möjlighet till redigering (WORM-bevis).
*   **`OracleDashboard` (`src/modules/oracle/OracleDashboard.tsx`):** 
    Datavisualisering. Mappar ihop och visar kurvor över stress/kapacitets-trender samt analyserar korrelationer mellan höga stressnivåer, övertid och konflikter.
*   **`BiochemicalShieldHub` (`src/komponenter/BiochemicalShieldHub.tsx`):** 
    Självregleringsverktyg. Erbjuder hjälpmedel för vagusnervstimulering, "Grey Rock"-mallar för att hantera hotfull kommunikation samt omedelbara fysiologiska nedvarvningstekniker.
*   **`QuickCaptureOverlay` (`src/modules/features/voiceToVault/components/QuickCaptureOverlay.tsx`):** 
    En globalt flytande röstknapp som transkriberar tal och skickar det direkt till inboxens sorteringskö eller valvet utan att störa den aktiva vyn.

---

## 4. Firebase-integrationsmönster

Integrationen mot Firebase bygger på ett tydligt skiktat mönster för att säkerställa säkerhet och determinism:

### A. Datakällor & Klientinteraktion
1.  **Repository Services:** Klientkod anropar aldrig Firestore-funktioner direkt. All interaktion går genom dedikerade services (t.ex. `VaultService.ts`, `CompassService.ts`) eller specialiserade firestore-filer (t.ex. `economyFirestore.ts`).
2.  **Realtidslyssnare:** Vyer som valvet använder `onSnapshot` för reaktiv uppdatering av gränssnittet. För vanliga dokumentanrop används asynkrona `getDoc` / `getDocs`.
3.  **Lokal Offline-cache:** Initierad i `firestore.ts` med `persistentLocalCache` och `persistentMultipleTabManager`. Detta garanterar att appen fungerar i miljöer utan täckning, och sparar lokala ändringar till IndexedDB vilka synkroniseras automatiskt när enheten återansluter.

### B. Säkerhet & WORM-Enforcement (Write Once, Read Many)
1.  **Klientvalidering:** Innan data skickas körs `assertWormPayload` som kastar ett hårt JavaScript-fel om nycklar för modifiering (`updatedAt`, `deletedAt`, `revision`) skickas med till en WORM-samling.
2.  **Servervalidering (Firestore Rules):** 
    Den slutgiltiga och ogenomträngliga sanningen skyddas i `firestore.rules`.
    *   **Förhindra ändring:** Regler som `allow update, delete: if false;` garanterar att dokument i `reality_vault`, `journal`, `checkins` och `dossier_snapshots` aldrig kan manipuleras eller tas bort när de väl har skrivits.
    *   **Ägarskap:** Alla läsningar kräver att användarens `uid` matchar fältet `ownerId` eller `userId`.
    *   **Cloud Functions-exklusivitet:** Känsliga samlingar (t.ex. `dcap_alerts`, `dossier_snapshots`, `insight_summaries`, `inbox_queue`) har regeln `allow create, update, delete: if false;` för alla klienter. Dessa samlingar kan uteslutande skrivas av Cloud Functions med hjälp av Firebase Admin SDK.
