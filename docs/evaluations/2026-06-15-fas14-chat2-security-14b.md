# Fas 14B — Chat 2 Security Auditor — 2026-06-15

**Status:** PASS (agent) — Console App Check + MåBra deploy väntar explicit Pontus OK  
**Fortsätter:** [`2026-06-15-fas14-chat1-security-14b.md`](./2026-06-15-fas14-chat1-security-14b.md)

---

## Smoke (denna session)

| Script | Resultat |
|--------|----------|
| `npm run smoke:valv-security` | **PASS** |
| `npm run smoke:plausible-deniability` | **PASS** |
| `npm run smoke:mabra` | **PASS** (live callable + WORM) |
| `npm run smoke:innehall` | **PASS** |
| `npm run smoke:vault-worm` | **PASS** (bonus — legacy rules ej brutna) |
| `cd functions && npm run build` | **PASS** |

**Ingen `firestore.rules`-ändring** (PMIR-stopp).

---

## 14B.1 App Check enforce

| Del | Status | Evidens |
|-----|--------|---------|
| Klient web | **PASS (kod)** | `src/modules/core/firebase/appCheck.ts` — reCAPTCHA v3 + debug token i dev |
| Klient init | **PASS** | `src/main.tsx` → `initAppCheck()` före React mount |
| Klient Android | **PASS (kod)** | `@capacitor-firebase/app-check` + `CustomProvider`; `android/capacitor.settings.gradle` |
| Functions guard | **PASS (kod)** | `callableGuards.ts` → `isAppCheckEnforcementEnabled()` + `guardSensitiveCallableV1/V2` |
| Fail-open prod | **PASS (avsiktligt)** | `functions/.env.gen-lang-client-0481875058`: `APP_CHECK_ENFORCE=false` |
| Emulator bypass | **PASS** | `FUNCTIONS_EMULATOR=true` → enforcement av |
| Callable-fel UX | **PASS** | `callableErrorMessage.ts` hanterar App Check-meddelande |
| Console registrering (Web reCAPTCHA + debug token) | **DONE (tidigare)** | `.env` har `VITE_APP_CHECK_RECAPTCHA_SITE_KEY` + `VITE_APP_CHECK_DEBUG_TOKEN`; Fas 13 hosting deploy PASS (`SMOKE_RESULTS.md`) |
| Android Play Integrity | **Ej verifierat i denna audit** | Bekräfta i Console om redan gjort — annars engångs |
| Functions enforce (fail-closed) | **KVAR — USER** | `functions/.env.*` har `APP_CHECK_ENFORCE=false` → sätt `true` + deploy callables |
| Console enforcement toggle (Functions) | **KVAR — USER** | App Check → Cloud Functions → Enforce (efter klient + functions deploy) |

**Gör INTE om:** Web-registrering, reCAPTCHA site key, debug token, hosting rebuild — redan klart.

**Kvar (endast om du vill fail-closed prod):**

1. Bekräfta Android Play Integrity i Console (om inte redan).
2. `APP_CHECK_ENFORCE=true` i `functions/.env.gen-lang-client-0481875058` → `cd functions && npm run build` → deploy callables-lista i DEPLOY.md.
3. Console: aktivera enforcement på Cloud Functions.
4. Manuell smoke: inloggning + LLM-anrop utan `failed-precondition`.

---

## 14B.3 Plausible deniability audit

| Kontroll | Resultat | Evidens |
|----------|----------|---------|
| Valv-ord dolda utan session | **PASS** | `NavigationDrawer.tsx` — Valv-sektion endast när `vaultOpen` (`isVaultUnlocked \|\| hasVaultGate()`) |
| Bevis-flik dold | **PASS** | `navFlags.ts` `HIDE_BEVIS_TAB` default true; `tabRegistry.ts` filtrerar `bevis` utan `vaultSessionOpen` |
| Hjärtat blockerar `?tab=bevis` | **PASS** | `AppRoutes.tsx` redirect till Valvet |
| Dagbok utan auto-sync till Valv | **PASS** | `useJournalFlow.ts` — ingen `saveVaultLog` / `reality_vault` |
| `private_child` dolt | **PASS** | `firestore.rules` + klientfilter i `firestore.ts` |
| Bevis-routing kräver Valv-session | **PASS** | `assertVaultSession` i `valv.ts`, `agents.ts`, `inbox.ts` |
| Zero Footprint logout | **PASS** | `signOutUser` → `endVaultSession` → `invalidateServerSession` |
| Regression | **INGEN** | `smoke:plausible-deniability` PASS |

**GAP:** Ingen kodändring krävd.

---

## 14B.4 Legacy `vault` collection audit (read-only)

**Rules** (`firestore.rules` rad 309–313):

```
match /vault/{docId} {
  allow read: if isOwnerVault();
  allow create, update, delete: if false;
}
```

| Bedömning | Åtgärd |
|-----------|--------|
| Read-only, WORM-aligned (`isOwnerVault`) | **Behåll** |
| Prod skriver till `reality_vault` | **Bekräftat** (kommentar MT-2) |
| Radera rules-block | **DEFER** — kräver PMIR + prod Firestore Console: 0 dokument i `vault` |
| Backend läser fortfarande legacy | **OBS** — `functions/src/callables/generateWeeklyInsights.ts` rad 45: `db.collection('vault')` — migrera till `reality_vault` **före** rules-borttagning |

**Prod-koll (Pontus, manuell):**

Firebase Console → Firestore → collection `vault` → verifiera dokumentantal (förväntat 0 eller migrerade rader).

**Smoke:** `smoke:vault-worm` PASS på `reality_vault` (update/delete nekad, shadow fields nekad).

---

## 14B.5 MåBra 3.0 deploy prep

**Kanon:** [`2026-06-14-mabra-3.0-implementation.md`](./2026-06-14-mabra-3.0-implementation.md)

| Artefakt | Status | Evidens |
|----------|--------|---------|
| Rules R1 (`primaryGoal*`) | **I repo** | `user_daily_focus` — `isValidUserDailyFocusWrite` |
| Rules R2 (`vit_entries` WORM) | **I repo** | `match /vit_entries` — create only, `isOwnerCreateSensitive` |
| Rules R3 (`recovery_profile`) | **I repo** | `match /recovery_profile` — L4 isolerad |
| Rules R5 (session enum) | **I repo** | `mabra_sessions` + `isValidMabraSessionCreate` |
| `functions:mabraCoach` | **Bygg klar** | `agents.ts` — `guardSensitiveCallableV2` + `mabraCoachGuard` + bankId |
| Prompts | **PASS** | Endast `sharedRules.ts` (smoke:innehall) |
| Tre silos | **PASS** | MåBra → ingen Kunskap RAG (smoke:innehall) |
| Live smoke | **PASS** | coach, transformator, vit_chat, guardrail ex-text |

**Deploy (ENDAST efter explicit Pontus OK + PMIR för rules):**

```bash
firebase deploy --only firestore:rules
firebase deploy --only functions:mabraCoach
firebase deploy --only hosting
```

---

## Säkerhetsinvarianter (verifierade)

| Invariant | Status |
|-----------|--------|
| WORM — inga client update/delete på bevis | **PASS** |
| Tre silos — ingen cross-RAG | **PASS** |
| Zero Footprint — `invalidateSession` vid logout | **PASS** |
| Prompts endast `sharedRules.ts` | **PASS** |
| Ingen mock-auth/crypto | **PASS** |
| LLM beslutar inte auth/ägarskap | **PASS** |
| Locked UX orörd | Ej rörd denna session |

---

## Blocker (ägare: Pontus)

| # | Blocker | Nästa steg |
|---|---------|------------|
| 1 | `APP_CHECK_ENFORCE=true` + callable deploy | Functions env + DEPLOY.md §1.4 deploy-lista |
| 2 | Console enforcement toggle (Cloud Functions) | Efter steg 1 — inte samma som registrering |
| 3 | MåBra 3.0 rules + `mabraCoach` deploy | Explicit OK → PMIR → deploy-kommandon ovan |
| 4 | Legacy `vault` rules-borttagning | Prod Firestore-koll (0 rader?) + migrera `generateWeeklyInsights` + PMIR |

---

## Slutsats

Fas 14B agent-audit **PASS**. Kod, rules (oförändrade), smoke och functions build håller Layered Defense och plausible deniability utan regression. Kvarvarande arbete är **operativt** (Console App Check, env, deploy) — väntar explicit godkännande från Pontus.
