# Offline-Android — uppföljningspromp (ny Cursor-chatt)

Kopiera allt under **---** till en **ny tom chatt** om du vill förfina eller utöka efter grundimplementation i repot.

---

Uppdrag: Offline-first för Livskompassen Android (Capacitor WebView).

Repo: Livskompassen3.0 (main). Läs [`docs/OFFLINE-ANDROID.md`](../OFFLINE-ANDROID.md) för nuläge.

Bakgrund (redan i repo):
- Firestore: `initializeFirestore` + `persistentLocalCache` + `persistentSingleTabManager` i [`firestore.ts`](../../src/modules/core/firebase/firestore.ts).
- Skrivpolicy: [`offlineWritePolicy.ts`](../../src/modules/core/firebase/offlineWritePolicy.ts) — bred allowlist (dagbok, planering, projekt, MåBra, ekonomi/tid); **block** endast `reality_vault` + `children_logs`. Ekonomi-mutationer även i [`timeEconomyFirestore.ts`](../../src/modules/core/firebase/timeEconomyFirestore.ts).
- Nätstatus: [`FirestoreNetworkChip.tsx`](../../src/modules/core/components/FirestoreNetworkChip.tsx) + [`firestoreNetworkStatus.ts`](../../src/modules/core/firebase/firestoreNetworkStatus.ts) (offline + «Synkar…»).

Välj **ett** av följande spår (skriv vilket i början av svaret):

**A)** Utöka: visa även “synkar…” när online men Firestore har väntande writes (kräver `waitForPendingWrites` / snapshot-metadata strategi).

**B)** Begränsa risk: blockera eller varna UI för **Valv/WORM**-skrivningar medan offline (lista routes i kod).

**C)** Android-specifikt: testa `cap:sync:prod`, flygplansläge, dokumentera edge cases i `OFFLINE-ANDROID.md`.

Krav: rör inte `firestore.rules` utan uttrycklig användarorder. Kör `npm run build` och `npm run smoke:locked-ux` före klart.

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
