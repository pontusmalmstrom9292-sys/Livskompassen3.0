# Fas 14B.1b — App Check enforce (fail-closed prod) — 2026-06-15

**Status:** PASS — Console Enforce aktiv (Pontus 2026-06-17)  
**Förutsättning:** Explicit Pontus OK till fail-closed prod (chat 2026-06-15)  
**Fortsätter:** [`2026-06-15-fas14-chat2-security-14b.md`](./2026-06-15-fas14-chat2-security-14b.md)

---

## Utfört

| Steg | Resultat | Evidens |
|------|----------|---------|
| `APP_CHECK_ENFORCE=true` | **DONE** | `functions/.env.gen-lang-client-0481875058` (gitignored, ej committad) |
| `cd functions && npm run build` | **PASS** | `tsc` exit 0 |
| Callable deploy (DEPLOY.md §1.4) | **PASS** | 13 functions uppdaterade i `europe-west1`; env laddad vid deploy |
| Smoke `smoke:mabra` | **PASS** | coach, transformator, vit_chat, guardrail, WORM |
| Smoke `smoke:kunskap` | **PASS** | ingest + query + citations |
| Smoke `smoke:valv-security` | **PASS** | session lifecycle + callableGuards |

**Deploy-lista (körd):**

`issueVaultSession`, `beginVaultWebAuthnChallenge`, `valvChatQuery`, `analyzeMessage`, `knowledgeVaultQuery`, `childrenLogsQuery`, `speglingsMirror`, `mabraCoach`, `generateDossier`, `weaveJournalEntry`, `ingestWidgetRecording`, `generateEmbedding`, `ingestKnowledgeDocument`

**Gjorde INTE:** Web reCAPTCHA-registrering, debug token, hosting rebuild (redan klart Fas 13).  
**Gjorde INTE:** `firestore.rules`-ändring (PMIR-stopp).

---

## Kod (oförändrad — verifierad)

| Artefakt | Roll |
|----------|------|
| `functions/src/lib/callableGuards.ts` | `isAppCheckEnforcementEnabled()` → fail-closed när `APP_CHECK_ENFORCE=true`; emulator bypass |
| `src/modules/core/firebase/appCheck.ts` | Web reCAPTCHA v3 + Android CustomProvider |
| `src/main.tsx` | `initAppCheck()` före React mount |

Fail-closed beteende: saknad App Check-token → `failed-precondition` *"App Check-verifiering krävs."*

---

## Console Enforce — klart (2026-06-17)

1. Öppna [Firebase Console → App Check](https://console.firebase.google.com/project/gen-lang-client-0481875058/appcheck).
2. Välj **Cloud Functions** (eller APIs → Cloud Functions).
3. Aktivera **Enforce** (inte bara Monitor).

Utan Console-enforce blockeras fortfarande inte anrop på Firebase-nivå — functions-koden är nu fail-closed, men dubbellager (Console + kod) är kanon.

**Manuell prod-smoke efter Enforce:** Inloggning → MåBra coach / Kunskap / Valv — inga `failed-precondition` för App Check.

**Android (om ej redan):** Bekräfta Play Integrity-registrering för `com.livskompassen.app` i samma App Check-projekt.

---

## Säkerhetsinvarianter

| Invariant | Status |
|-----------|--------|
| WORM — inga client update/delete på bevis | **PASS** (ej rörd) |
| Tre silos — ingen cross-RAG | **PASS** (smoke:kunskap, smoke:mabra) |
| Zero Footprint — `invalidateSession` vid logout | **PASS** (ej rörd) |
| Prompts endast `sharedRules.ts` | **PASS** |
| Ingen mock-auth/crypto | **PASS** |
| LLM beslutar inte auth/ägarskap | **PASS** |
| Locked UX orörd | **PASS** (ingen UI-ändring) |
| `firestore.rules` orörd | **PASS** |

---

## Slutsats

Fas 14B.1b **PASS** för agent-delen: env enforce, build, callable deploy och smoke gröna. Prod fail-closed är aktiv i Functions-kod. Sista steget är Console **Enforce** på Cloud Functions (Pontus).
