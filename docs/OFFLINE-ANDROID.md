# Firestore offline (web + Android WebView)

## Vad som är påslaget

| Del | Fil / beteende |
|-----|------------------|
| **Lokal cache (IndexedDB)** | [`firestore.ts`](../src/modules/core/firebase/firestore.ts) — `initializeFirestore` med `persistentLocalCache` + `persistentSingleTabManager` (en WebView-tab, passar Capacitor). Ersätter äldre `enableIndexedDbPersistence`. |
| **Init-fallback** | Vid dubbel init (HMR, multitab) fångas fel → `getFirestore(app)` utan krasch; dev-logg i konsolen. |
| **Skrivpolicy offline** | [`offlineWritePolicy.ts`](../src/modules/core/firebase/offlineWritePolicy.ts) — `OFFLINE_WRITE_ALLOWLIST` + block för Valv/barn; `assertOfflineWriteAllowed` före skrivningar (inkl. [`timeEconomyFirestore.ts`](../src/modules/core/firebase/timeEconomyFirestore.ts)). |
| **Nät / synk-chip** | [`FirestoreNetworkChip`](../src/modules/core/components/FirestoreNetworkChip.tsx) — offline eller «Synkar…» via [`firestoreNetworkStatus.ts`](../src/modules/core/firebase/firestoreNetworkStatus.ts). |

## Vad får köas offline? (synkas när nät finns)

Skrivningar till följande collections får ligga i Firestore SDK-kön när `navigator.onLine === false` (samma cache som IndexedDB):

- **checkins**, **journal**, **planning_tasks**, **projects**, **project_blocks**
- **mabra_sessions**, **mabra_progress**
- **economy_profiles**, **transactions**
- **time_entries**, **economy_ledger**, **economy_fixed_bills**, **budget_savings**

**Blockerat offline** (kräver nät innan skrivning — `OfflineWriteBlockedError`):

- **reality_vault** (Valv)
- **children_logs** (Barnloggar / evidens)

**Övrigt:** Kunskapsingest (`ingestKampsparEntry` m.m.) går via Cloud Functions — kräver nät oavsett. Läsning från cache fungerar för data som redan hämtats.

Server-regler i [`firestore.rules`](../firestore.rules) gäller vid commit efter sync.

## Test (Android)

1. Prod WebView: `npm run cap:sync:prod` → kör från Android Studio.
2. Logga in med nät på.
3. **Flygplansläge** → chip med text om offline + Valv.
4. Spara **dagbok** eller **planeringsuppgift** offline → ska lyckas lokalt; slå på nät → «Synkar…» sedan synkad data.
5. Försök **Valv**- eller **barnlogg**-sparning offline → tydligt fel direkt.
6. Stäng av flygplansläge → väntande writes skickas.

## Capacitor / shell

- `INTERNET` i AndroidManifest krävs fortfarande.
- Med `CAPACITOR_SERVER_URL` / `cap:sync:prod` laddas UI från hosting — **första öppning utan nät** kan misslyckas om shell inte är bundlat. Offline-cache gäller efter minst en lyckad inloggning + Firestore-läs.

## Auth (separat)

[`FIREBASE-AUTH-LATHUND.md`](./FIREBASE-AUTH-LATHUND.md)
