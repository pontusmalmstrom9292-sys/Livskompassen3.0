# Pre-Merge Impact Report (PMIR)

**Datum:** 2026-05-28  
**Gren:** `cursor/capacitor-8-android-sdk36` → **`main`**  
**Agent / session:** Cursor — Capacitor 8 + Firebase 12 + Android SDK 36

---

## Följer med till main

- [x] **Capacitor 8** (`@capacitor/core/android/app/cli` ^8.3.x), **Firebase JS** ^12.13, **`@capacitor-firebase/authentication`** ^8.2
- [x] Android: `minSdk` 24, `compileSdk`/`targetSdk` 36, Gradle 8.14.3, JDK **21** (ingen Java-17-override i root `build.gradle`)
- [x] CI: Node **22**, Android workflow Java **21**
- [x] Smoke: MåBra Daglig Mix mount + bank parity (`smoke_locked_ux`, `smoke_innehall_register`)
- [x] Docs: Copilot `feature/hallucination-guard-and-structure` avvisad (ingen merge av den grenen)
- [x] Låst UX — `npm run smoke:locked-ux`: **PASS**

---

## Försvinner (vid gren-radering)

| Vad | Detalj |
|-----|--------|
| Gren (lokal + remote) | `cursor/capacitor-8-android-sdk36` |
| Commits som **inte** mergas | 0 (alla 3 commits avsedda för main) |
| Kod kvar **endast** på grenen | inget unikt efter merge |

**Commits (3):**

1. `577ad6e7` — chore(android): upgrade Capacitor 8 and Android SDK 36  
2. `79740fa7` — test(smoke): lock MåBra Daglig Mix mount and bank parity  
3. `e25bf476` — docs(git): record rejected Copilot hallucination-guard branch  

---

## Regelanalys (läst — inte gissad)

| Lager | Källor | Status |
|-------|--------|--------|
| **System** | U1–U5 oförändrade; inga `firestore.rules` / `sharedRules.ts` | **PASS** |
| **Design** | Locked UX smoke PASS; inga borttagna Valv/Barnfokus/Planering | **PASS** |
| **Säkerhet** | Auth via befintlig `nativeGoogleAuth.ts`; inga nya RAG-silos | **PASS** |

**OBS efter merge:** Utvecklare och CI måste använda **JDK 21** för Android (`temurin@21`). Android Studio: Gradle JDK = Eclipse Temurin 21.

---

## Smoke (på gren före merge)

| Kommando | Resultat |
|----------|----------|
| `npm run smoke:locked-ux` | **PASS** |
| `npm run smoke:orkester` | **PASS** |
| `npm run build` | **PASS** |
| `./gradlew assembleDebug` (JDK 21) | **PASS** (lokal verifiering) |

---

## Rekommendation

- [x] Merge till `main` + push `origin`
- [ ] Merge **utan** gren-radering (valfritt: radera `cursor/capacitor-8-android-sdk36` efter verifiering)
- [ ] Cherry-pick specifika commits: —
- [ ] **Avbryt** — anledning: —

---

## Godkännande

**Användaren:** ☐ godkänn merge · ☐ avbryt  
**Datum:** ___________
