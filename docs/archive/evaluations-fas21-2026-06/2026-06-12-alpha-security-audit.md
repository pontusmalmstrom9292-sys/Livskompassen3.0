# Agent α — Security & silo-audit

**Datum:** 2026-06-12  
**Branch:** `main`  
**Auditor:** specialist-security-auditor  
**Källor:** `.context/security.md`, `firestore.rules`, `functions/src/sharedRules.ts`, `.cursor/rules/grunder-kanon.mdc`, `functions/src/lib/callableGuards.ts`

---

## Smoke

| Script | Resultat |
|--------|----------|
| `npm run smoke:valv-security` | **PASS** |
| `npm run smoke:innehall` | **PASS** |

---

## Verifieringstabell

| Kontroll | Status | Evidens |
|----------|--------|---------|
| **U1 — Tre silos (ingen cross-RAG i användar-callables)** | **PASS** | `knowledgeVaultAgent` → `kampsparQueryRag` (`kampspar`/`kb_docs` only); `valvChatAgent` → `vaultRag` (`reality_vault` only); `childrenLogsAgent` → `childrenLogsQueryRag` (`children_logs` only). Vävaren (`kampsparRag.ts`) läser journal+valv+kampspar — tillåten metadata-vävning, ej användar-RAG (`.cursor/rules/memory-silo.mdc`). |
| **U5.5 — Barnen routing guard** | **PASS** | `knowledge.ts` → `shouldRouteKompisToBarnen` redirect utan Kunskap-RAG. |
| **WORM — `reality_vault`** | **PASS** | create + `isValidRealityVaultCreate` + `keys().hasOnly`; update/delete `false`. |
| **WORM — `journal`** | **PASS** | create + `isValidJournalCreate`; update/delete `false`; `isSensitiveAuth` på read/create. |
| **WORM — `children_logs`** | **PASS** | create + `isValidChildrenLogCreate` + visibility; update/delete `false`; `private_child` döljs vid read. |
| **WORM — `dossier_snapshots`** | **PASS** | read owner+sensitive; create/update/delete `false` (Admin SDK). |
| **WORM — `dcap_alerts`** | **PASS** | read owner; create/update/delete `false` (Admin SDK). |
| **Legacy `/vault` read-only** | **PASS** (fixad) | create/update/delete `false`. Read krävde ej `isSensitiveAuth` — **GAP fixad** (se nedan). |
| **Kunskap WORM — `kampspar`/`kb_docs`** | **PARTIAL** | update/delete `false`; client create tillåten utan `keys().hasOnly` — shadow-fält möjliga om direkt Firestore-write (prod använder callables/Admin SDK). |
| **App Check på LLM-callables** | **PASS (kod)** | `callableGuards.ts` → `guardSensitiveCallableV1/V2` + `APP_CHECK_ENFORCE=true`. Emulator/dev: av. Console-enforcement: **USER/deploy**. |
| **Rate limits** | **PASS** | `_rate_limits` client write `false`; `assertRateLimit` i guards. |
| **Auth på callables** | **PASS** | LLM/Valv/Kunskap via `guardSensitiveCallable*`; `notifyNewFile` webhook secret fail-closed; `invalidateSession` auth-only (ej LLM). |
| **Zero Footprint logout** | **PASS** | `signOutUser` → `endVaultSession` → `invalidateServerSession`; smoke verifierar `authService.ts`. |
| **Valv WebAuthn** | **PASS** | `issueVaultSession` + `vaultWebAuthn.ts`; smoke:valv-security PASS. |
| **Prompts centraliserade** | **PASS** | Silo-prompts i `sharedRules.ts` (`LIVS_ARKIVARIEN`, `SANNING_ANALYTIKERN`, barnen-agent). |
| **Sacred Features (7)** | **PASS (statisk)** | Verklighetsvalvet, Sanningens Sköld, Morgonkompassen, Dossier, Speglar, Draft Layer, Device Clear — inga regressioner i smoke. Kill Switch borttagen 2026-06-01 (ersatt Device Clear). |

---

## Öppna GAP (ej fixade i denna audit)

| ID | Beskrivning | Prioritet |
|----|-------------|-----------|
| Kunskap shadow fields | `kampspar`/`kb_docs` saknar `wormKeysOnly` på client create | Låg — prod-ingest via callables |
| App Check Console | `APP_CHECK_ENFORCE=true` kräver Firebase Console-registrering | Deploy/USER |
| U2.5 HITL exports | Känsliga exports utan full HITL | Open (`.context/security.md`) |
| Manuell smoke | Valv PIN, Barnen live (#3, #4) | USER |

---

## Minimal fix (denna audit)

**Fil:** `firestore.rules`  
**Ändring:** Legacy `/vault` read `isOwner()` → `isOwnerSensitive()` — samma e-postverifieringskrav som `reality_vault` för migrerade bevisrader.

**Deploy:** `firebase deploy --only firestore:rules` (efter godkännande).

---

## Slutsats

Layered Defense och tre-silo-arkitekturen håller i kod och rules. WORM-bevisvägar (`reality_vault`, `journal`, `children_logs`, `dossier_snapshots`, `dcap_alerts`) är korrekt låsta. Smoke PASS. En uppenbar rules-GAP (legacy vault read utan sensitive auth) är åtgärdad.
