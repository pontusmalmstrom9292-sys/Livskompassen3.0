# YOLO-rapport: Mobil scroll, Google-auth, app-sweep (2026-07-11)

**Plattform:** Cursor Agent · **Deploy:** NO-GO (väntar Pontus OK)

## Sammanfattning

Fixat mobilscroll (nested scroll på Hjärtat, vh-klippning i superhubs), Google-auth state-sync utan manuell reload, samt 28 nya E2E-tester för scroll, dock och legacy-redirects.

## Ändringar

### Mobilscroll (P0–P3)
- **Hjärtat:** `lockViewport` endast desktop (`useMinWidthSm`); `flowWithIsland` i DagbokInputSuperModule + CSS
- **Superhubs:** `.superhub-scroll-island` med `100dvh` minus dock (MåBra, Planering, Ekonomi, Arbetsliv, Familjen)
- **Overlays:** `useScrollLock()` stack — Modal, Sheet, ResurserOverlay
- **Arkiv:** `h-screen` → `min/max-h-[100dvh]`

### Google-auth
- `onAuthStateChanged` registreras direkt vid mount (UI uppdateras utan F5)
- `markSkipAnonymousOnce` persist i localStorage (5 min TTL) för PWA redirect
- `syncAuthUserToStore()` efter popup/native login
- `AuthErrorBoundary` runt AppShell (fallback vid vit skärm)
- EmailAuthPanel: `navigate(replace)` efter lyckad Google-popup

## Testresultat

| Gate | Resultat |
|------|----------|
| smoke:predeploy:build | PASS (build OK) |
| smoke:auth-login | PASS (AUTH-G1) |
| smoke:android-platform | PASS |
| typecheck:core-strict | PASS |
| E2E YOLO-suite (38 tester) | PASS |
| smoke:module-lock | **FAIL** — berör locked moduler (bugfix-scope, kräver Pontus OK) |
| freeport-premium-compare | FAIL (pre-existing visuell regression, ej blocker för denna fix) |

## Kvarvarande risker

| Plattform | Risk | Åtgärd |
|-----------|------|--------|
| Mobilwebb | Scroll på mycket kort innehåll | OK — ingen body-lock |
| PWA redirect | Full reload fortfarande förväntat | skip-anonymous TTL hjälper |
| Android APK | SHA-1 måste matcha keystore | Verifiera med `./gradlew signingReport` |
| Auth | AppUnlockGate fingeravtryck kan blockera | Avmarkera vid login om fast |

## YOLO-vakt: GO med villkor

**GO** för lokal test och commit efter Pontus OK på:
1. Locked module touches (scroll/auth bugfix)
2. Ingen prod-deploy utan manuell verifiering på telefon

## Ett nästa steg (när du är tillbaka)

1. Logga in med Google på telefonen **utan att ladda om**
2. Scrolla längst ner på `/hjartat?tab=reflektion`
3. Om båda fungerar → säg till så kan vi deploya efter `npm run build:web && npx cap sync android` för APK
