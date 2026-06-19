# Tips vs Livskompassen governance — GAP-matris

**Datum:** 2026-06-19  
**Syfte:** Mappa externa AI-governance-tips mot vad som redan finns i repot.  
**Verifiering:** commits `fabc864`, `e001040a9` · `npm run smoke:guard`

---

## Sammanfattning

| Status | Antal |
|--------|-------|
| **DONE** | 5 |
| **PARTIAL** | 3 |
| **GAP** | 2 |
| **N/A** | 1 |

---

## Matris

| # | Externt tips | Vår implementation | Status | Anteckningar |
|---|--------------|-------------------|--------|--------------|
| 1 | `rules/projectGuard.mdc` | `.cursor/rules/projectGuard.mdc` + `guard-regelbok.mdc` + `docs/governance/GUARD-REGLERBOK.md` | **DONE** | Index + operativ regel + mänsklig kanon. Valideras av `smoke:guard`. |
| 2 | Prompts JSON templates | `prompts/safeClassificationPrompt.json` v1.1 · `prompts/guardedAgentInstruction.json` v1.1 · `docs/prompts/SAKER-AI-PROMPTS.json` v2 | **DONE** | Governance-only — inte runtime. Se R6 i GUARD-REGLERBOK. |
| 3 | `validateGuards.js` | `scripts/validate-prompts.mjs` · `npm run smoke:prompts` · `npm run smoke:guard` | **DONE** | Node ESM, inte JS CommonJS. Alias i `package.json`. |
| 4 | Expert agent directive templates | `docs/prompts/EXPERT-AGENT-DIRECTIVES.json` (ny) · `.cursor/agents/*.md` | **PARTIAL** | JSON-registry tillagt; Cursor-agenter fanns redan. Ingen auto-injection i Composer — manuell @-mention eller superprompt. |
| 5 | Hallucination guard policy | `anti-hallucination.mdc` · GUARD-REGLERBOK §2 · fras i alla prompt-JSON | **DONE** | Kanonfras: *"Ej tillräckligt data för bedömning."* |
| 6 | Cursor orchestration YAML (Composer) | ADK `SynapseBus` · `orkester-conductor` · `.cursor/agents/` · `docs/YOLO-VAKT-GATE.md` § Parallella startprompter | **N/A** | Livskompassen använder Cursor Task-agenter + runtime ADK — inte Composer YAML. Kartlägg behov i superprompt, implementera inte YAML utan PMIR. |
| 7 | YOLO sprint checklist | `docs/YOLO-VAKT-GATE.md` (12 punkter) · `.cursor/rules/yolo-vakt-gate.mdc` · `.cursor/agents/yolo-vakt.md` · GUARD-REGLERBOK §6 | **DONE** | `npm run smoke:yolo` via `scripts/smoke_yolo_gate.mjs`. |
| 8 | Commit hook for validation | — | **GAP** | Ingen repo-root `.husky/` eller aktiv `pre-commit` som kör `smoke:guard`. Manuell gate + CI `smoke:predeploy`. PMIR om hook ska införas. |
| 9 | Risk-alert flags in reports | GUARD-REGLERBOK §6 R1–R8 · superprompt Fas 4 riskregister | **PARTIAL** | Dokumenterat i kanon/superprompt — inte automatiska flaggor i kod eller PMIR-mall. |
| 10 | Prompt chaining per domain | `docs/pipeline-studio/tools/flow_*.json` · superprompt Fas 1–3 · `specialist-innehall-dirigent` | **PARTIAL** | FTD för runtime flows; Cursor-side kedjor beskrivs i superprompt — ingen generisk `chain.yaml`. |

---

## Detaljer per PARTIAL/GAP

### 4 — Expert directives (PARTIAL)

| Finns | Saknas |
|-------|--------|
| `.cursor/agents/yolo-vakt.md`, `specialist-*`, `livskompassen-master-architect.md` | Enhetlig JSON-registry (nu: `EXPERT-AGENT-DIRECTIVES.json`) |
| Guard-fraser i prompt-JSON | Automatisk laddning i varje agent-session |

### 7 — YOLO + smoke:prompts (PARTIAL under R2)

| Finns | Saknas |
|-------|--------|
| `smoke:prompts` i `smoke:tier1`, `smoke:predeploy` (via tier1) | `docs/YOLO-VAKT-GATE.md` listar inte `smoke:prompts` i kodblocket (rad 35–47) |
| Ocommittad rad i `scripts/smoke_yolo_gate.mjs`: `runNpm('smoke:prompts')` | Commit + doc-sync |

### 8 — Commit hook (GAP)

Rekommendation (PMIR): lätt `pre-commit` som endast kör `npm run smoke:guard` när `prompts/` eller `docs/prompts/` eller `.cursor/rules/projectGuard.mdc` ändrats — inte full `smoke:yolo`.

### 9 — Risk-alert flags (PARTIAL)

Använd i Plan-mode superprompt: H/M/L + fil:rad. Inför i `docs/MERGE-IMPACT-RAPPORT.md` som valfri sektion vid nästa PMIR-runda.

### 10 — Prompt chaining (PARTIAL)

| Domän | Kedja idag |
|-------|------------|
| Inkast | `flow_inkast_classify.json` → DCAP → silo |
| Hamn | `flow_biff_rewrite.json` |
| Valv | `flow_valv_chat.json`, `flow_pattern_assist.json` |
| Cursor Plan | `STRATEGIC-PLAN-MASTER-SUPERPROMPT.md` Fas 1–3 |

---

## Relaterade filer

- Kanon: `docs/governance/GUARD-REGLERBOK.md`
- Plan superprompt: `docs/prompts/STRATEGIC-PLAN-MASTER-SUPERPROMPT.md`
- Expert registry: `docs/prompts/EXPERT-AGENT-DIRECTIVES.json`
- Validering: `scripts/validate-prompts.mjs`
