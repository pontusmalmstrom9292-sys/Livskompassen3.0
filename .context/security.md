# Säkerhet, Biometri och Integritet

Säkerheten i Livskompassen v2 är rigorös på grund av hanteringen av djupt personlig psykologisk data. **Mock-säkerhet är strängt förbjudet.**

**Relaterat:** [`.context/arkiv-minne.md`](./arkiv-minne.md) · [`docs/GCP-INVENTORY-LATEST.md`](../docs/GCP-INVENTORY-LATEST.md) · [`docs/SMOKE_CHECKLIST.md`](../docs/SMOKE_CHECKLIST.md) · [`docs/specs/modules/Arkiv-GAP-REGISTER.md`](../docs/specs/modules/Arkiv-GAP-REGISTER.md)

---

## Layered Defense (försvar i lager)

| Lager | Mekanism | Kod / regler |
|-------|----------|--------------|
| 1 — Identitet | Firebase Auth + `ownerId`/`userId`; prod: `VITE_REQUIRE_EMAIL_AUTH=true` | `firestore.rules`, `AuthGate`, `requireEmailAuth.ts` |
| 2 — Åtkomst | WORM append-only; inga client-updates på bevis | `firestore.rules` (`update, delete: if false`) |
| 3 — Kryptering | CMEK via Cloud KMS (crypto-shredding) | `scripts/setup_gcp_cmek.sh` |
| 4 — Session | Draft Layer (IndexedDB utkast) + Valv idle timeout + Device Clear | `clearDeviceSession`, `useZeroFootprint` idle |
| 5 — AI-gräns | LLM får aldrig styra auth, ägarskap eller WORM | DCAP, Gräns-Arkitekten, `sharedRules.ts` |
| 6 — Silo | Tre kunskapsytor — **MUST NOT** blanda RAG | Se § Tre silor |
| 7 — Nödutgång | Device Clear (Inställningar) + WebAuthn gate | Fyren, `clearDeviceSession` |

**Regel:** Varje ny feature måste passera minst lager 1, 2, 5 och 6 innan deploy.

---

## Sacred Features — register och verifiering

Dessa funktioner får **inte** försvagas eller mockas. Verifiera via [`docs/SMOKE_CHECKLIST.md`](../docs/SMOKE_CHECKLIST.md) efter varje deploy.

| Sacred Feature | Vad den skyddar | Verifiering |
|----------------|-----------------|-------------|
| **Verklighetsvalvet** | WORM-bevis (`reality_vault`), long-press + PIN/WebAuthn | Smoke #2, #11, #16–17 |
| **Sanningens Sköld** | Evidenslagring utan redigering/radering | WORM rules + `reality_vault` create-only |
| **Morgonkompassen** | Daglig orientering utan överbelastning | `/kompasser` check-in → `checkins` |
| **Dossier-Generator** | Immutable export (`dossier_snapshots`) | `generateDossier` smoke PASS |
| **Speglings-Systemet** | Validering utan fixande; lokal session tills rensning | Smoke #9, #14–15 |
| **Draft Layer** | Utkast i IndexedDB tills sync eller «Rensa enheten» | `src/modules/capture/` |
| **Device Clear** | Frivillig lokal rensning (ersätter Kill Switch) | Inställningar → Rensa enheten |

**Permanent minne:** WORM-collections (`reality_vault`, `children_logs`, `journal`, `dcap_alerts`, `dossier_snapshots`, `evolution_ledger`) raderas **aldrig** av retention. Se [`.context/arkiv-minne.md`](./arkiv-minne.md).

---

## Tre silor (MUST NOT blandas)

| Silo | Firestore | RAG callable | Agent |
|------|-----------|--------------|-------|
| Kunskap | `kampspar`, `kb_docs` | `knowledgeVaultQuery` | Livs-Arkivarien |
| Valv | `reality_vault` | `valvChatQuery` | Sannings-Analytikern |
| Barnen | `children_logs` | — (Dossier read) | Mönster-Arkivarien (planerad) |

**Blocker:** Cross-silo RAG är ett säkerhetsbrott. Vävaren (`weaveJournalEntry`) taggar metadata — skild från användar-facing chat.

---

## Session, Draft Layer och Device Clear

- **Draft Layer:** Capture-utkast sparas i IndexedDB tills sync eller «Rensa enheten».
- Valv-unlock hålls i session; idle timeout 1 h (`useZeroFootprint`).
- **`invalidateSession`** vid utloggning och Device Clear — rensar server-side Vertex/ADK cache.
- **Kill Switch (skaka) borttagen** 2026-06-01 — ensam-boende; använd Inställningar → Rensa enheten.
- **Förbjudet:** Cross-RAG; etiketter («narcissist») som WORM-fakta utan granskning.

---

## WebAuthn och Fyren

- **WebAuthn Passkeys:** Privat nyckel lämnar aldrig Secure Enclave/TPM.
- **Long-press Fyren (3s):** Gate till Verklighetsvalvet.

---

## WORM och Firestore

Append-only collections (create ja, update/delete nej):

- `reality_vault`, `children_logs`, `journal`, `dcap_alerts`, `dossier_snapshots`, `evolution_ledger`
- `kampspar` / `kb_docs`: WORM create; separat retention tillåten (ersätter **inte** barn/valv)

**Retention:** `scheduledRetentionJob` (G5 **done**) — allowlist exkluderar permanent minne.

**Källkod:** [`firestore.rules`](../firestore.rules)

**Phase 19 (Backend FREEZE, 2026-06-11):** WORM-silos kräver `email_verified` för Google/e-post, eller anonym provider (dev). Create validerar `keys().hasOnly([...])` per collection (1.6).

**Phase 19 (Backend FREEZE):** App Check + rate limits på LLM-callables — se [`docs/DEPLOY.md`](../docs/DEPLOY.md) § Phase 19.

---

## Callable Functions — auth-krav

| Function | Auth | Silo / anteckning |
|----------|------|-------------------|
| `knowledgeVaultQuery` | Firebase Auth | Kunskap |
| `valvChatQuery` | Firebase Auth | Valv only |
| `analyzeMessage` | Firebase Auth | Safe Harbor / BIFF |
| `generateDossier` | Firebase Auth | Läser WORM, skriver snapshot |
| `speglingsMirror` | Firebase Auth | Zero Footprint session |
| `mabraCoach` | Firebase Auth | Opt-in coach |
| `notifyNewFile` | **Webhook secret** | Drive → `kb_docs`; fail-closed utan secret |
| `issueVaultSession` | Firebase Auth + **WebAuthn (server)** | Valv server-session efter Fyren |
| `beginVaultWebAuthnChallenge` | Firebase Auth | WebAuthn challenge före Valv-session |
| `invalidateSession` | Firebase Auth | Zero Footprint (server cache wipe) |
| `approveWeaverMetadata` / `rejectWeaverMetadata` | Firebase Auth | Vävaren HITL → `reality_vault` metadata |

**Live inventering:** [`docs/GCP-INVENTORY-LATEST.md`](../docs/GCP-INVENTORY-LATEST.md)

---

## Kryptografisk säkerhet via CMEK

- **Cloud KMS:** Customer-Managed Encryption Keys för Firestore och Storage där policy kräver det.
- **Crypto-shredding:** Nyckelrotation/invalidering = omedelbar dataförstöring.
- **Spårbarhet:** Cloud Logging för alla KMS-operationer.

---

## GDPR och AADC (Children's Code)

- **AADC:** High privacy by default. Profilering och geolokalisering avstängt som standard.
- **Transparens:** Användare informeras om hur AI processar data.
- **Lagring:** Interaktionsloggar får inte sparas på obestämd tid (utom WORM permanent minne enligt arkitekturinvariant).
- **Barnen:** `children_logs` — extra strikt ägarskap; ingen cross-silo RAG.

---

## Skydd mot manipulation (DCAP)

Digital Conversation Analysis Pipeline skyddar mot psykologiskt missbruk och projektion.

1. **Explicit (Regex):** Direkta språkliga indikatorer på bristande empati.
2. **Implicit (Domain-adapted BERT):** Kontext över tid (DARVO m.m.).
3. **Åtgärd:** Grey Rock-coachning via Kompis/Safe Harbor.

---

## Indirekt prompt injection ↔ projektion (G10)

- **Paritet:** Samma försvarslager som mot gaslighting/DARVO — indirekt prompt injection (dolda instruktioner i Drive-dokument, SMS, mejl) behandlas som **projektion/manipulation**, inte systeminstruktion.
- **Deterministisk kod:** LLM-output får aldrig styra auth, dataägarskap eller WORM-beslut. DCAP + Gräns-Arkitekten körs före routing; injicerad text saneras till Clean Input.
- **Kanon:** Grunder slide G10 · [`GRANS_ARKITEKTEN_SYSTEM_PROMPT`](../functions/src/sharedRules.ts)

---

## Öppna säkerhets-GAP (spåras)

| ID | Beskrivning | Status |
|----|-------------|--------|
| U5.5 | Kompis → Barnen routing guard | **delvis** — `barnenModuleRouteGuard.ts` i `knowledgeVaultQuery` |
| U2.5 | HITL för känsliga exports | **done** — approveWeaverMetadata hanterar HITL |
| Zero Footprint logout | `signOutUser` utan `invalidateSession` | **done** — `authService.ts` anropar `invalidateServerSession` |
| Valv WebAuthn bypass | `issueVaultSession` utan biometri | **done** — server verifierar via `vaultWebAuthn.ts` |
| Manuell smoke app | #3 Valv, #4 Barnen, #2d | **USER** — se [`SMOKE_RESULTS.md`](../docs/SMOKE_RESULTS.md) |
| App Check på callables | LLM/Valv utan enhetsattest | **LOCK** — `APP_CHECK_ENFORCE=true` + Console Enforce completed 2026-06-17 |
| Rate limits LLM | DoS på Vertex/Gemini | **done (kod)** — `_rate_limits` + `callableGuards.ts` |
| Anonym auth + WORM | Prod ska kräva e-post | **delvis** — `VITE_REQUIRE_EMAIL_AUTH` + rules `isSensitiveAuth` |
| WORM shadow fields | Extra fält på create | **done** — `keys().hasOnly` i rules |

G7–G16 backend: **done** — [`Arkiv-GAP-REGISTER.md`](../docs/specs/modules/Arkiv-GAP-REGISTER.md)

---

## Pre-deploy checklist (kort)

1. `cd functions && npm run build` — exit 0
2. `npm run build` (frontend) — exit 0
3. Inga prompts utanför `functions/src/sharedRules.ts`
4. Inga secrets i git
5. Kör relevanta rader i [`docs/SMOKE_CHECKLIST.md`](../docs/SMOKE_CHECKLIST.md)
6. Jämför functions-lista mot [`docs/GCP-INVENTORY-LATEST.md`](../docs/GCP-INVENTORY-LATEST.md)
