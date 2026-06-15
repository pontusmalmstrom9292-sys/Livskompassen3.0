# App Check Enforce — guide (PHASE-06)

**Projekt:** `gen-lang-client-0481875058`  
**Web-app ID:** `1:1084026575972:web:2c85731a56adeb07dbd371`  
**Android:** `com.livskompassen.app`  
**Senast:** 2026-06-15 (CHECKPOINT-6 LOCK — Console Enforce klar)

---

## Status: LOCK (2026-06-15)

Console Enforce aktiverad av Pontus. Tre lager aktiva:

1. **Klient** — `initAppCheck()` (reCAPTCHA v3 web / Play Integrity Android)
2. **Functions** — `APP_CHECK_ENFORCE=true` + `callableGuards.ts` fail-closed
3. **Console** — Cloud Functions → Enforce

Rollback: se avsnitt **Rollback om Enforce går fel** nedan.

---

## Förutsättningar (verifiera före Enforce)

| Steg | Status | Var |
|------|--------|-----|
| Web reCAPTCHA v3 site key i prod-build | **krävs** | `VITE_APP_CHECK_RECAPTCHA_SITE_KEY` |
| `initAppCheck()` i `main.tsx` | ✔ kod | Körs före React mount |
| `APP_CHECK_ENFORCE=true` i Functions env | ✔ kod | `functions/.env.gen-lang-client-0481875058` (gitignored) |
| Callables deployade med guard | ✔ | Se DEPLOY.md §1.4 + CP-5 |
| Firestore App Check-metrics >90% verifierad | **rekommenderat** | Console → App Check → APIs |

---

## Steg 1 — Web: reCAPTCHA v3 (Firebase Console)

1. Öppna [Firebase Console → App Check → Apps](https://console.firebase.google.com/project/gen-lang-client-0481875058/appcheck/apps).
2. Välj **web-appen** (Livskompassen).
3. **Register app** / **Edit provider** → **reCAPTCHA v3**.
4. Klistra in **site key** (samma som `.env` och GitHub secret):
   ```
   VITE_APP_CHECK_RECAPTCHA_SITE_KEY=6L…
   ```
   - Använd **site key** (börjar med `6L`), **inte** secret key.
5. Spara.

### Domäner (reCAPTCHA Admin)

1. [reCAPTCHA Admin](https://www.google.com/recaptcha/admin) → samma site key.
2. **Domains** ska inkludera:
   - `gen-lang-client-0481875058.firebaseapp.com`
   - `gen-lang-client-0481875058.web.app`
   - `localhost` (lokal dev)

### Lokal dev — debug token

1. Console → App Check → **Manage debug tokens**.
2. Skapa token → lägg i `.env`:
   ```
   VITE_APP_CHECK_DEBUG_TOKEN=<token>
   ```
3. Starta om `npm run dev`.

---

## Steg 2 — Android: Play Integrity

1. [App Check → Apps](https://console.firebase.google.com/project/gen-lang-client-0481875058/appcheck/apps).
2. Välj **Android** (`com.livskompassen.app`).
3. Provider: **Play Integrity**.
4. Spara.

**Efter Capacitor-ändring:** `npm run build:web && npx cap sync android` → ny APK.

---

## Steg 3 — Hosting rebuild (om site key ändrats)

Nyckeln bakas in vid Vite-build — inte runtime.

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run build
firebase deploy --only hosting
```

Eller push till `main` — CI har secret (se nedan).

---

## Steg 4 — Functions env (redan satt)

Fil: `functions/.env.gen-lang-client-0481875058` (gitignored):

```
APP_CHECK_ENFORCE=true
```

Vid ändring:

```bash
cd functions && npm run build && cd ..
firebase deploy --only functions:issueVaultSession,functions:beginVaultWebAuthnChallenge,functions:unlockVault,functions:valvChatQuery,functions:analyzeMessage,functions:knowledgeVaultQuery,functions:childrenLogsQuery,functions:speglingsMirror,functions:mabraCoach,functions:generateDossier,functions:weaveJournalEntry,functions:ingestWidgetRecording,functions:generateEmbedding,functions:ingestKnowledgeDocument,functions:submitInkastLite,functions:previewInboxClassification,functions:journalWovenToKampspar
```

---

## Steg 5 — Console Enforce (PONTUS MANUELLT)

1. [Firebase Console → App Check](https://console.firebase.google.com/project/gen-lang-client-0481875058/appcheck).
2. Fliken **APIs** (eller **Cloud Functions**).
3. Välj **Cloud Functions**.
4. Växla från **Monitor** → **Enforce**.
5. Bekräfta.

**Gör detta först när** prod-hosting skickar giltiga tokens (ingen 400 på `exchangeRecaptchaV3Token`).

---

## VITE_APP_CHECK_RECAPTCHA_SITE_KEY i hosting CI

GitHub Actions (`.github/workflows/firebase-hosting-main.yml`) injicerar secret vid build:

```yaml
VITE_APP_CHECK_RECAPTCHA_SITE_KEY: ${{ secrets.VITE_APP_CHECK_RECAPTCHA_SITE_KEY }}
```

**Sätt secret en gång:**

```bash
gh secret set VITE_APP_CHECK_RECAPTCHA_SITE_KEY --body "6L…" --repo Livskompassen/Livskompassen3.0
```

Utan secret: prod-build saknar App Check → alla guarded callables returnerar `failed-precondition` när `APP_CHECK_ENFORCE=true`.

---

## Callables som påverkas när APP_CHECK_ENFORCE=true

Alla som anropar `guardSensitiveCallableV2` / `guardSensitiveCallableV1` i `callableGuards.ts`. Saknad token → `failed-precondition`: *"App Check-verifiering krävs."*

### Valv & session

| Callable | Rate/min |
|----------|----------|
| `unlockVault` | 10 |
| `beginVaultWebAuthnChallenge` | 20 |
| `issueVaultSession` | 10 |
| `issueVaultSessionViaBiometric` | 10 |
| `valvChatQuery` | 30 |
| `getEntityProfileRegistry` | 30 |
| `addEntityProfile` | 20 |
| `generateDossier` | 5 |
| `rescanPatternMetadata` | 3 |
| `writePatternScanMetadata` | 30 |

### Inkast / inbox (CP-3)

| Callable | Rate/min |
|----------|----------|
| `submitInkastLite` | 15 |
| `previewInboxClassification` | 20 |
| `getInboxQueue` | 30 |
| `confirmInboxItem` | 30 |
| `dismissInboxItem` | 30 |
| `parseVoiceCommand` | 15 |

### Kunskap & barn (tre silos)

| Callable | Rate/min |
|----------|----------|
| `knowledgeVaultQuery` | 30 |
| `childrenLogsQuery` | 30 |
| `generateEmbedding` | 60 |
| `ingestKampsparEntry` | 10 |
| `ingestKnowledgeDocument` | 10 |
| `getContextCacheStatus` | 30 |

### Agenter & LLM

| Callable | Rate/min |
|----------|----------|
| `analyzeMessage` | 30 |
| `weaveJournalEntry` | 15 |
| `approveWeaverMetadata` | 20 |
| `rejectWeaverMetadata` | 20 |
| `journalWovenToKampspar` | 10 |
| `speglingsMirror` | 30 |
| `journalQuickMirror` | 30 |
| `mabraCoach` | 30 |
| `chatWithKompis` | 20 |
| `ingestWidgetRecording` | 20 |
| `breakDownResponse` | 30 |
| `crushTask` | 20 |
| `getAgentRegistry` | 30 |

### Övrigt

| Callable | Rate/min |
|----------|----------|
| `createBarnportenPairing` | 10 |
| `claimBarnportenPairing` | 10 |
| `generatePayslip` | 5 |
| `analyzeProjectImage` | 10 |
| `generateCompassInsight` | 20 |
| `generateWeeklySummary` | 5 |
| `generateWeeklyInsights` | 5 |

### Ej guardad (medvetet)

| Callable | Anledning |
|----------|-----------|
| `invalidateSession` | Logout — Zero Footprint, låg risk |

---

## Verifiering efter Enforce

```bash
npm run smoke:valv-security
npm run smoke:locked-ux
npm run smoke:orkester
```

**Manuell prod-smoke:**

1. `Cmd + Shift + R` på https://gen-lang-client-0481875058.web.app
2. Logga in (Google)
3. Testa: MåBra coach, Kunskap-fråga, Valv unlock, Inkast preview
4. Console: **ingen** `failed-precondition` för App Check
5. App Check → APIs: andel verifierad ska vara hög

---

## Rollback om Enforce går fel

### Snabbast — Console (Pontus)

1. [App Check → APIs → Cloud Functions](https://console.firebase.google.com/project/gen-lang-client-0481875058/appcheck).
2. Växla tillbaka till **Monitor** (eller **Unenforced**).
3. Effekt: omedelbar — Firebase slutar kräva token på gateway-nivå.

### Functions fail-open (kod)

I `functions/.env.gen-lang-client-0481875058`:

```
APP_CHECK_ENFORCE=false
```

```bash
cd functions && npm run build && cd ..
firebase deploy --only functions:issueVaultSession,functions:submitInkastLite,functions:valvChatQuery,functions:analyzeMessage,functions:knowledgeVaultQuery,functions:mabraCoach
```

`callableGuards.ts` är fail-open när env ≠ `true` (emulator alltid öppen).

### Hosting — saknad site key

Om prod byggdes utan `VITE_APP_CHECK_RECAPTCHA_SITE_KEY`:

```bash
# Sätt i .env eller CI secret, sedan:
npm run build
firebase deploy --only hosting
```

### Symptom → åtgärd

| Symptom | Åtgärd |
|---------|--------|
| `exchangeRecaptchaV3Token` 400 | Site key/domän — se [`2026-06-15-appcheck-400-fix.md`](../evaluations/2026-06-15-appcheck-400-fix.md) |
| `failed-precondition` App Check | Hosting rebuild + Console Monitor tills fixat |
| Android blockeras | Play Integrity registrerad + ny APK |
| Smoke PASS men prod fail | Hard refresh / avinstallera PWA |

---

## Kodreferens (redan på plats — ändra ej utan lucka)

| Fil | Roll |
|-----|------|
| `functions/src/lib/callableGuards.ts` | `isAppCheckEnforcementEnabled()` → fail-closed |
| `src/modules/core/firebase/appCheck.ts` | Web reCAPTCHA v3 + Android CustomProvider |
| `src/main.tsx` | `initAppCheck()` före React |

---

## Referenser

- [`DEPLOY-CHATBOT-WAVE.md`](./DEPLOY-CHATBOT-WAVE.md) — CP-3 → 05 deploy
- [`DEPLOY.md`](../DEPLOY.md) §1.4
- [`2026-06-15-fas14b-appcheck-enforce.md`](../evaluations/2026-06-15-fas14b-appcheck-enforce.md)
- [`2026-06-15-fas21-callables-guard-inventory.md`](../evaluations/2026-06-15-fas21-callables-guard-inventory.md)
