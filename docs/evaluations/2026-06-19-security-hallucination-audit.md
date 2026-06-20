# Säkerhets- & anti-hallucinationsaudit — 2026-06-19

**Typ:** Parallell specialist-audit + kodfix + smoke-gate  
**Branch:** `cursor/security-hallucination-audit-f878`  
**Verdict:** **GO** för merge (statisk gate) · **PMIR krävs** för CRITICAL/HIGH kvarstående

---

## Agenter som körts

| Agent | Fokus | Resultat |
|-------|-------|----------|
| `specialist-security-auditor` | firestore.rules, sharedRules, WORM, callables | CRITICAL×1, HIGH×4, MEDIUM×9, PASS solid |
| Memory silo guard | Tre silos, cross-RAG, Zero Footprint | PASS kärn-RAG · WARN×2 (åtgärdade) |
| Explore | Smoke-inventering | 40+ scripts kartlagda · GAP-lista |

---

## Smoke (körd)

```bash
npm run smoke:predeploy   # PASS (inkl. ny smoke:dcap-routing)
cd functions && npm run build  # PASS
```

Nytt i denna branch:
- `npm run smoke:dcap-routing` — DCAP→executor, ragContext-block, Kunskap entity bundle

---

## Åtgärdat i denna branch (WARN/HIGH — minimal diff)

| # | Problem | Fix |
|---|---------|-----|
| 1 | Valv-metadata (MOTPART/Grey Rock) i `knowledgeVaultQuery` | `loadKunskapEntityBundle()` — filtrerar MOTPART/PROTECTION |
| 2 | Klient `ragContext` injection i `analyzeMessage` | Ignoreras alltid; tom array till supervisor |
| 3 | `KOMPIS_SYSTEM_PROMPT` lovade RAG men kod gav bara journal | Prompt skärpt: endast given dagbokskontext |
| 4 | Död hook `useJournalAndVaultData` läste valv utan session | Borttagen (endast arkiv-referens kvar) |
| 5 | Governance smoke saknade anti-hallucination + grunder | Utökad `validate-prompts.mjs` |
| 6 | Ingen smoke för DCAP-routing | Ny `scripts/smoke_dcap_routing.mjs` i predeploy |

---

## Kvarstående — CRITICAL (PMIR + Pontus OK)

### Native biometri utan server-attestation

**v1 åtgärdat 2026-06-19:** Challenge-kedja — se [`2026-06-19-pmir-biometric-challenge-v1.md`](./2026-06-19-pmir-biometric-challenge-v1.md).

**Fas 2 kvar:** Play Integrity / DeviceCheck via App Check enforce (Console, Pontus).

---

## Kvarstående — HIGH (nästa våg)

| # | Issue | Minimal fix |
|---|-------|-------------|
| 1 | `notifyNewFile` — `ownerId` från body utan Drive-ägarskap | Slå upp Drive-filägare via API |
| 2 | `kampspar`/`kb_docs` saknar `keys().hasOnly` i rules | `isValidKampsparCreate()` i firestore.rules (**PMIR**) |
| 3 | Doc vs kod: `isAnonymousDevUser()` oanvänd | Synka `.context/security.md` eller wire dev-only |
| 4 | `/orakel` mockLoad i prod route | Flytta till `/dev/*` |

---

## PASS — solid grund (oförändrat)

- **Tre silos:** `knowledgeVaultQuery`, `valvChatQuery`, `childrenLogsQuery` — collection-scoped
- **WORM:** append-only rules + client `assertWorm` + retention allowlist
- **SynapseBus:** 4/4 handlers live (ej stub)
- **DCAP:** heuristik före LLM, confidence gate 0.75 → review
- **Zero Footprint:** kill switch, vault idle, Speglar ephemeral
- **Epistemic guard:** Hamn `theoryWithoutEvidence` utan vault-read
- **Prompt centralisering:** prod via `sharedRules.ts`

---

## YOLO-vakt

| Gate | Status |
|------|--------|
| `smoke:predeploy` | **PASS** |
| Dirty tree | Committas i denna branch |
| firestore.rules ändrad | **Nej** — ingen PMIR-stopp |
| Locked UX borttagen | **Nej** |
| WORM undergrävd | **Nej** |

**Deploy:** Functions-ändringar kräver `firebase deploy --only functions:analyzeMessage,functions:knowledgeVaultQuery,...` efter merge — fråga Pontus.

---

## Nästa rekommenderade smoke (ej implementerade)

1. `smoke:cross-silo-live` — live callable med cross-domain bait
2. `smoke:uncertainty-runtime` — tom RAG → degraded svar
3. `smoke:gap-register-sync` — register vs kod-drift

---

*Genererad av Cloud Agent audit 2026-06-19.*
