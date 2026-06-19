# Säker AI — promptmallar (användning)

## Syfte

Det här registret innehåller **governance-mallar för Cursor-agenter och manuell klassificering**. Filerna är **inte** runtime callables i Firebase/Functions. Produktion använder egna systemprompter i kod (se nedan).

## Filer

| Fil | Roll |
|-----|------|
| `docs/prompts/SAKER-AI-PROMPTS.json` | Kanoniskt register: korta mallar, placeholders och korsreferenser |
| `prompts/safeClassificationPrompt.json` | Utökad **Säker Klassificering** (tre silos, JSON-svar, `review` vid osäkerhet) |
| `prompts/guardedAgentInstruction.json` | Utökad **AI Agent Säkerhetsinstruktion** (WORM, silo, låsta flöden) |

## Validering

Kör från projektrot:

```bash
npm run smoke:prompts
```

Skriptet (`scripts/validate-prompts.mjs`) kontrollerar att JSON-filerna är konsistenta med registret.

## Så använder du mallarna

### 1. Säkerhetsinstruktion (system)

- **Registry:** mall `ai-agent-sakerhetsinstruktion` i `SAKER-AI-PROMPTS.json`
- **Full text:** `prompts/guardedAgentInstruction.json` → fältet `systemInstruction`
- **Användning:** Klistra in som system-/regelblock i Cursor när en agent ska arbeta mot Livskompassen (fakta endast, tre silos, låsta UX-flöden). Ingen placeholder.

### 2. Säker klassificering (dokument → silo)

- **Registry:** mall `saker-klassificering` med placeholder `{{documentText}}`
- **Full text:** `prompts/safeClassificationPrompt.json` → `systemInstruction` + förväntat JSON-schema
- **Användning:** Ersätt `{{documentText}}` med rå inkast-/dokumenttext (eller bifoga texten efter instruktionen). Agenten ska välja **en** silo (Kunskap / Valv / Barnen) eller `review` med motivering **"Ej tillräckligt data"** när bevis saknas.

Osäkerhetsfras (registry): **Ej tillräckligt data** / **Ej tillräckligt data för bedömning.**

## Korsreferenser (MUST läsa vid agentarbete)

| Regel | Innehåll |
|-------|----------|
| `.cursor/rules/anti-hallucination.mdc` | Läs kod/docs före påstående; smoke före "klart" |
| `.cursor/rules/grunder-kanon.mdc` | Tre silos, DCAP före LLM, WORM, Zero Footprint |
| `.cursor/rules/locked-ux-features.mdc` | Barnfokus, Valv-flikar, Barnporten HITL m.m. |
| `.cursor/rules/domän-covert-narcissism.mdc` | Routing bevis/barn/Hamn/Kunskap; inga diagnos-etiketter i WORM |

## Produktion (runtime)

Inkorg/sortering i molnet använder **`INKORG_SORTERARE_SYSTEM_PROMPT`** i `functions/src/sharedRules.ts` — inte JSON-filerna i `docs/prompts/` eller `prompts/` direkt. Håll registry och `prompts/*.json` synkade med samma principer; ändra prod-beteende via kod + deploy enligt `docs/DEPLOY.md`.
