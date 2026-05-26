# Firestore offline (web + Android WebView)

## Vad som är påslaget

| Del | Fil / beteende |
|-----|------------------|
| **Lokal cache (IndexedDB)** | [`firestore.ts`](../src/modules/core/firebase/firestore.ts) — `initializeFirestore` med `persistentLocalCache` + `persistentSingleTabManager` (en WebView-tab, passar Capacitor). Ersätter äldre `enableIndexedDbPersistence`. |
| **Init-fallback** | Vid dubbel init (HMR, multitab) fångas fel → `getFirestore(app)` utan krasch; dev-logg i konsolen. |
| **Skrivpolicy offline** | [`offlineWritePolicy.ts`](../src/modules/core/firebase/offlineWritePolicy.ts) — `assertOfflineWriteAllowed` före skrivningar. |
| **Nät / synk-chip** | [`FirestoreNetworkChip`](../src/modules/core/components/FirestoreNetworkChip.tsx) — offline eller «Synkar…» via [`firestoreNetworkStatus.ts`](../src/modules/core/firebase/firestoreNetworkStatus.ts). |

## Vad får köas offline?

| Tillåtet offline | Blockerat offline (kräver nät) |
|------------------|--------------------------------|
| **checkins** (Morgonkompass / check-in) | **reality_vault** (Valv), **children_logs**, **journal**, **mabra_sessions**, **transactions** |
| Läsning från cache (listor du redan hämtat) | **planning_tasks**, **projects**, **project_blocks**, profiler (setDoc) |

WORM/evidence-sparning kastar `OfflineWriteBlockedError` med svensk text — UI får visa felet; inget tyst SDK-kö för Valv.

Server-regler i [`firestore.rules`](../firestore.rules) gäller fortfarande vid sync.

## Test (Android)

1. Prod WebView: `npm run cap:sync:prod` → kör från Android Studio.
2. Logga in med nät på.
3. **Flygplansläge** → chip: «Offline — check-ins sparas lokalt; Valv kräver nät». Navigera till sidor med cachad Firestore-data.
4. Försök spara Valv/barnlogg → ska misslyckas direkt med felmeddelande (inte bara hänga).
5. Spara en check-in offline (om flödet finns i UI) → ska gå lokalt.
6. Stäng av flygplansläge → chip «Synkar…» kort, sedan försvinner; data uppdateras.

## Capacitor / shell

- `INTERNET` i AndroidManifest krävs fortfarande.
- Med `CAPACITOR_SERVER_URL` / `cap:sync:prod` laddas UI från hosting — **första öppning utan nät** kan misslyckas om shell inte är bundlat. Offline-cache gäller efter minst en lyckad inloggning + Firestore-läs.

## Auth (separat)

[`FIREBASE-AUTH-LATHUND.md`](./FIREBASE-AUTH-LATHUND.md)
