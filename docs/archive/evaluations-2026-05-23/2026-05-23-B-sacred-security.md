# Systemkontroll — B — Sacred Features + Layered Defense — 2026-05-23

**Trigger:** Read-only säkerhetsaudit efter widget/Android-merge.

**Källor lästa:** `.context/security.md`, `firestore.rules`, `functions/src/index.ts`, `functions/src/sharedRules.ts`, `src/modules/core/security/killSwitch.ts`, `src/modules/core/auth/useZeroFootprint.ts`, `src/modules/core/auth/AuthGate.tsx`, `functions/src/lib/vaultRag.ts`, `functions/src/lib/kampsparQueryRag.ts`, `functions/src/lib/childrenLogsQueryRag.ts`, `functions/src/jobs/retentionJob.ts`.

---

## Sammanfattning

Layered Defense **1–7** är implementerad i kod utan mock-auth. Alla sju Sacred Features finns kvar med routes, WORM-regler och callables. Tre silor hålls i användar-facing RAG; Vävaren har explicit tillåten korsläsning för metadata. **GAP:** CMEK är script-baserad (`setup_gcp_cmek.sh`) — runtime-verifiering ej automatiserad; `NavigationDrawer` saknas (UX, ej säkerhetsbrott).

---

## Layered Defense — lager 1–7

| Lager | Mekanism | Bevis | Status |
|-------|----------|-------|--------|
| **1 Identitet** | Firebase Auth + `ownerId`/`userId` | `firestore.rules:4-18`, `AuthGate.tsx` | **PASS** |
| **2 Åtkomst WORM** | create-only på bevis | `firestore.rules:21-43`, `95-98`, `115-118` | **PASS** |
| **3 Kryptering CMEK** | Cloud KMS | `scripts/setup_gcp_cmek.sh`, bucket `livskompassenv2` | **partial** — infra finns; ej smoke-testad |
| **4 Session Zero Footprint** | blur/timeout/logout | `useZeroFootprint.ts`, `invalidateSession` (`index.ts:120-126`) | **PASS** |
| **5 AI-gräns** | DCAP, ingen LLM-auth | Alla callables: `if (!context.auth)`; `sharedRules.ts` | **PASS** |
| **6 Silo** | Separata RAG-vägar | Se § Tre silor | **PASS** |
| **7 Nödutgång** | Kill Switch + WebAuthn | `killSwitch.ts`, `webauthn.ts`, Fyren long-press | **PASS** |

---

## Sacred Features (7)

| Feature | Kod | Rules / callable | Status | Verifiera |
|---------|-----|------------------|--------|-----------|
| **Verklighetsvalvet** | `VaultPage.tsx`, PinGate, Fyren 3s | `reality_vault` WORM | **PASS** | Smoke #2, #16–17 |
| **Sanningens Sköld** | create-only client | `update, delete: false` | **PASS** | Firestore Console |
| **Morgonkompassen** | `CompassModuleStrip`, `checkins` | WORM checkins | **PASS** | `smoke:compass` |
| **Dossier-Generator** | `DossierPage`, wizard | `generateDossier`; snapshots client write blocked | **PASS** | `smoke:dossier` |
| **Speglings-Systemet** | `SpeglingsSystem`, `speglingsMirror` | Session-only compare | **PASS** | `smoke:speglar` |
| **Zero Footprint** | `App.tsx` + `useZeroFootprint` | `invalidateSession` | **PASS** | Logout/blur test |
| **Kill Switch** | `useShakeToKill`, `KILL_SWITCH_EVENT` | Rensar store + synapse | **PASS** | Manuell shake |

---

## Tre silor — cross-RAG-kontroll

| Callable | Tillåten läsning | Förbjuden läsning | Status |
|----------|-----------------|-------------------|--------|
| `knowledgeVaultQuery` | `kampspar`, `kb_docs` | `reality_vault`, `children_logs` | **PASS** — `kampsparQueryRag.ts` |
| `valvChatQuery` | `reality_vault` | `kampspar`, `children_logs` | **PASS** — `vaultRag.ts` |
| `childrenLogsQuery` | `children_logs` | valv/kampspar | **PASS** — `childrenLogsQueryRag.ts:54` |
| `weaveJournalEntry` (Vävaren) | journal + valv + kampspar (metadata) | Ej user-chat | **PASS** — tillåten enligt `memory-silo.mdc` |

**Widget:** `ingestWidgetRecording` skriver `reality_vault` (`category: tyst_inspelning`) — korrekt silo.

---

## WORM — collections (rules)

| Collection | Client create | Client update/delete |
|------------|---------------|----------------------|
| `checkins` | ja | nej |
| `journal` | ja | nej |
| `reality_vault` | ja | nej |
| `children_logs` | ja | nej |
| `transactions` | ja | nej |
| `kampspar`, `kb_docs` | ja | nej |
| `dossier_snapshots` | nej (Admin SDK) | nej |
| `dcap_alerts`, `inbox_queue` | nej (Admin SDK) | nej |
| `entity_profiles`, `system_synapses` | nej (Admin SDK) | nej |

**Retention allowlist:** `retentionJob.ts:17-27` — inkl. `transactions` (ekonomi WORM).

---

## Callable auth

| Function | Auth | Secret / special |
|----------|------|------------------|
| `knowledgeVaultQuery` | Firebase Auth | — |
| `valvChatQuery` | Firebase Auth | — |
| `analyzeMessage` | Firebase Auth | DCAP |
| `generateDossier` | Firebase Auth | — |
| `speglingsMirror` | Firebase Auth | — |
| `notifyNewFile` | Webhook secret | fail-closed |
| `invalidateSession` | Firebase Auth | Zero Footprint |

**Förbjudet hittat:** Inga hårdkodade prompts utanför `sharedRules.ts` i agent-lager (verifierat via grep på `SYSTEM_PROMPT` imports).

---

## GAP / risk

| Risk | Allvar | Åtgärd |
|------|--------|--------|
| CMEK ej smoke-verifierad | Medel | Manuell bucket-policy-koll |
| `duress-PIN` | Låg | `module_plan.md` — planned |
| iOS PWA Kill Switch | Låg | `core/module_plan.md` — planned test |

---

## Rekommenderat nästa steg

Efter nästa deploy: kör Sacred smoke #1–7 i `SMOKE_CHECKLIST.md` mot Hosting — ett steg, en modul i taget.

---

## Blocker

Ingen säkerhetsblockerare identifierad i kodgranskning.
