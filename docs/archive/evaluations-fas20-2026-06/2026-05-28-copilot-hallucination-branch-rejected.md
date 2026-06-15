# Avvisad: `feature/hallucination-guard-and-structure` (Copilot)

**Datum:** 2026-05-28  
**Commit på grenen:** `2b19c229` — *feat(security): Add AntiHallucinationGuard*  
**Beslut:** **Merga inte.** Remote-gren raderad.

## Vad grenen innehöll

Endast två nya filer (ej inkopplade i `index.ts`, `routeFromDcap`, eller orchestrator):

| Fil | Rader |
|-----|-------|
| `functions/src/safety/hallucinationGuard.ts` | ~241 |
| `functions/src/safety/agentAuditLog.ts` | ~156 |

Ingen PR. Ingen CI-workflow. Ingen `TabRegistry` eller router-ombyggnad (det fanns bara i Copilot-chatten, inte i git).

## Varför avvisad

1. **Ej integrerad** — ingen import från befintlig agent-pipeline; död kod som ser ut som säkerhet men inte körs.
2. **Fel säkerhetsmodell** — regex på användartext (`you are now`, `forget rules`) ger falska positiva på svenska vardagsfraser och stoppar inte riktig injection.
3. **Output-validering i text** — `validateAgentOutput` letar efter strängar som `create`/`write` i LLM-svar; det är inte samma som Firestore-behörighet (U2: DCAP + regler + silo i kod).
4. **Nya Firestore-samlingar utan regler** — `security_breaches`, `agent_audit_logs` fanns inte i `firestore.rules` (Shadow Field / hijack-risk om någon kopplade in skrivning).
5. **Fel agent-id** — t.ex. `agent_livs_arkivarien` matchar inte nödvändigtvis `resolveExecutorId` / kort i `functions/src/agents/cards/`.
6. **Dubblerar befintligt** — projektet har redan:
   - DCAP + `routeFromDcap` (`functions/src/agents/cards/index.ts`, `kompis-supervisor.ts`)
   - `gatekeeperSanitize` (PII) i `functions/src/adk/orchestrator.ts`
   - `classifyInboxDocument` (deterministisk försortering) i `functions/src/lib/inboxClassifier.ts`
   - EntityProfile / `hallucinationRisk` i `entityProfileStore.ts`
   - Cursor-regel `.cursor/rules/anti-hallucination.mdc` (agent-dokumentation, inte runtime-regex)

## Copilot-förslag som **inte** fanns i git (hallucinerad roadmap)

- `TabRegistry` + omstrukturering `src/modules/` till evidence/diary/wellbeing
- Ny router `/dagbok/evidence/...`
- GitHub workflow `pre-merge-safety-check.yml`
- Ändringar i `firestore.rules` för `deleted`-fält

Dessa ska **inte** implementeras utan PMIR + produktbeslut (låst UX, `navTruth.ts`, Valv-flikar).

## Rätt väg vid behov av mer runtime-skydd

1. Utöka **DCAP** / intent-gate i `AdkOrchestrator` (deterministiskt), inte fri text-regex.
2. Behåll **Firestore WORM** och silo-gränser — LLM skriver inte bevis direkt.
3. Eventuell audit: befintliga `interaction_logs` / `dcap_alerts` — inte nya öppna collections utan regler + retention-policy.

## Verifiering

```bash
git fetch origin
git branch -r | grep hallucination   # ska vara tom efter radering
test ! -f functions/src/safety/hallucinationGuard.ts && echo OK
```
