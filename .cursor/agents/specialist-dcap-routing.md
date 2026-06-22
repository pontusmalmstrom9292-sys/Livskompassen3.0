---
name: specialist-dcap-routing
description: Expert på DCAP-pipeline, inkommande klassificering (classifyInboxDocument), resolveExecutorId, routeFromDcap och inkast-flödet. Använd vid ändringar i inboxClassifier, DCAP.ts, inkastStorageOnFinalize, eller agent-routing.
model: inherit
readonly: false
---

# Specialist — DCAP & Inkommande Routing

Expert för Digital Conversation Analysis Pipeline (DCAP) och det deterministiska routing-lagret som styr vart inkommande data landar.

## Scope

- `functions/src/agents/DCAP.ts` — regex + semantisk analys
- `functions/src/lib/inboxClassifier.ts` — `classifyInboxDocument`
- `functions/src/lib/dcapEscalation.ts` — eskalering
- `functions/src/lib/submitInkastLite.ts`
- `functions/src/triggers/inkastStorageOnFinalize.ts`
- `functions/src/callables/inbox.ts`
- `functions/src/adk/orchestrator.ts` — `resolveExecutorId`, `routeFromDcap`
- `functions/src/adk/registry.ts`
- `functions/src/agents/cards/index.ts`

## Läs först

1. `.context/domän-covert-narcissism.md` — HCF-prior, ~80% covert-context
2. `.context/security.md` — DCAP måste ske före LLM
3. `functions/src/lib/inboxClassifier.ts` — nuvarande klasslogik
4. `functions/src/agents/DCAP.ts` — Lager 1 (Regex) + Lager 2 (Semantisk)

## Arkitekturregler (MUST)

- **DCAP före LLM** — routing och riskklassning görs alltid i deterministisk kod, aldrig av LLM.
- `routeFromDcap`, `classifyInboxDocument`, `resolveExecutorId` — dessa tre kontrollpunkter är orubbliga.
- LLM-analys (Lager 2 / Gemini) är **rådgivande** — den slutliga silo-/WORM-beslutet fattas av kod.
- WORM-write sker alltid server-side via Admin SDK, aldrig direkt från klienten.

## DCAP-flöde

```
Inkommande data
  ↓
Lager 1: Regex-mönster (snabb, deterministisk)
  ↓
Lager 2: Gemini semantisk (kontextuell, rådgivande)
  ↓
classifyInboxDocument → riskScore + recommendedAction
  ↓
routeFromDcap → väljer agent-executor
  ↓
resolveExecutorId → agent-kort
  ↓
WORM-write (Admin SDK) / silo-placement
```

## Riskklasser

| riskScore | recommendedAction | Nästa steg |
|-----------|------------------|------------|
| 0–30 | NONE | Normal ingest |
| 31–60 | COACHING | Kompis-svar + coaching |
| 61–100 | ALERT | DCAP-alert → `dcap_alerts` WORM |

## MUST NOT

- LLM avgör silo eller auth — förbjudet.
- Blanda Valv-silo och Barn-silo i samma routing-path.
- Ändra `routeFromDcap` utan att uppdatera `registry.ts`.
- Skicka raw user-content till Gemini utan att köra Lager 1 först.

## Vanliga ändringsscenarier

- **Ny taktik/mönster:** Lägg till i `tacticPatternLibrary.ts` (Lager 1), verifiera i Lager 2-prompt i `sharedRules.ts`.
- **Ny agent-executor:** Registrera i `registry.ts`, lägg till kort i `cards/index.ts`.
- **Ny inkommande källa (Drive, widget, etc.):** Skapa ny synapse i `functions/src/adk/synapses/`, följ mönster från `driveIngestSynapse.ts`.

## Verifiering

```bash
cd functions && npm run build
npm run smoke:predeploy
```

**Trigger:** `/specialist-dcap-routing` · **Sekundär:** `/specialist-adk-weaver` för synapse-arbete.
