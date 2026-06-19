# Tips-gap-matris — externa råd vs Livskompassen

**Version:** 2026-06-19 (våg 1 analys)  
**Syfte:** Jämför tips från extern planeringschatt mot faktisk implementation i repo.  
**Kanon:** [`GUARD-REGLERBOK.md`](GUARD-REGLERBOK.md) · [`.cursor/rules/projectGuard.mdc`](../../.cursor/rules/projectGuard.mdc)

**Strategisk analys (batch 01–11):** [`2026-06-19-forbattringstips-analys.md`](../evaluations/2026-06-19-forbattringstips-analys.md) · inbox [`docs/inbox/forbattringstips/`](../inbox/forbattringstips/)

Uppdatera efter strategisk Plan-session: [`STRATEGIC-PLAN-MASTER-SUPERPROMPT.md`](../prompts/STRATEGIC-PLAN-MASTER-SUPERPROMPT.md).

---

## Sammanfattning

| Status | Antal |
|--------|-------|
| **DONE** | 9 |
| **PARTIAL** | 2 |
| **GAP** | 1 |
| **N/A** | 1 |

---

## Huvudtabell

| # | Externt tips | Vår implementation | Status | Anteckningar |
|---|--------------|-------------------|--------|--------------|
| 1 | `rules/projectGuard.mdc` | [`.cursor/rules/projectGuard.mdc`](../../.cursor/rules/projectGuard.mdc) + [`guard-regelbok.mdc`](../../.cursor/rules/guard-regelbok.mdc) + [`GUARD-REGLERBOK.md`](GUARD-REGLERBOK.md) | **DONE** | Index + operativ regel + mänsklig kanon |
| 2 | Prompts JSON templates | [`prompts/safeClassificationPrompt.json`](../../prompts/safeClassificationPrompt.json) v1.1 · [`prompts/guardedAgentInstruction.json`](../../prompts/guardedAgentInstruction.json) v1.1 · [`docs/prompts/SAKER-AI-PROMPTS.json`](../prompts/SAKER-AI-PROMPTS.json) | **DONE** | Governance-only; runtime = `sharedRules.ts` (R6) |
| 3 | `scripts/validateGuards.js` | [`scripts/validate-prompts.mjs`](../../scripts/validate-prompts.mjs) · `npm run smoke:prompts` · `npm run smoke:guard` | **DONE** | ESM + governance-filvalidering |
| 4 | Expert agent directive templates | [`docs/prompts/EXPERT-AGENT-DIRECTIVES.json`](../prompts/EXPERT-AGENT-DIRECTIVES.json) v2 · [`.cursor/agents/`](../../.cursor/agents/) | **DONE** | yolo-vakt, security-auditor, architect, ux-guardian, verifier, smoke-runner, hcf-domän, orkester-conductor |
| 5 | Hallucination guard policy | GUARD-REGLERBOK §2 · [`anti-hallucination.mdc`](../../.cursor/rules/anti-hallucination.mdc) · alla prompt-JSON | **DONE** | *"Ej tillräckligt data för bedömning."* |
| 6 | Cursor orchestration YAML (Composer) | ADK SynapseBus · Cursor Task · [`orkester-conductor`](../../.cursor/agents/orkester-conductor.md) | **N/A** | Extern YAML ersatt; chaining i superprompt |
| 7 | YOLO sprint-checklista | GUARD-REGLERBOK §6 · [`docs/YOLO-VAKT-GATE.md`](../YOLO-VAKT-GATE.md) · [`yolo-vakt.md`](../../.cursor/agents/yolo-vakt.md) | **DONE** | Checklista 1–12 |
| 8 | Commit-hook för validering | — | **GAP** | Valfritt; CI/tier1 kör `smoke:guard` via `smoke:predeploy` |
| 9 | Risk-alert flags i rapporter | Superprompt Fas 4 · GUARD-REGLERBOK R1–R8 | **PARTIAL** | H/M/L i Plan-output — ingen auto-kodflagga utan PMIR |
| 10 | Prompt chaining per domän | Superprompt Fas 1 · [`flow_*.json`](../pipeline-studio/tools/) · EXPERT-AGENT-DIRECTIVES | **PARTIAL** | FTD runtime + Cursor-side kedjor dokumenterade |
| 11 | Guard- och Regelbok | [`GUARD-REGLERBOK.md`](GUARD-REGLERBOK.md) | **DONE** | Governance-våg 2026-06-19 |
| 12 | `smoke_yolo_gate.mjs` + smoke:prompts | [`scripts/smoke_yolo_gate.mjs`](../../scripts/smoke_yolo_gate.mjs) | **DONE** | Commit `2e878ea6f` |

---

## Commits (referens)

| Commit | Innehåll |
|--------|----------|
| `fabc864` | Kanoniska säkra AI-prompter + `smoke:prompts` |
| `e001040a9` | Governance-regler + GUARD-REGLERBOK |
| `2e878ea6f` | `smoke_yolo_gate.mjs` — `runNpm('smoke:prompts')` i YOLO gate |

---

## Kvarvarande GAP

| GAP | Rekommendation |
|-----|----------------|
| Pre-commit hook | **DEFER** — PMIR om Pontus vill `.husky/pre-commit` med `smoke:guard` vid prompt/rule-ändring |

---

## Inbox batch 01–11 (2026-06-19)

Källa: extern planeringschatt → [`docs/inbox/forbattringstips/`](../inbox/forbattringstips/). Full klassificering: [`2026-06-19-forbattringstips-analys.md`](../evaluations/2026-06-19-forbattringstips-analys.md).

| Tema | Klass | Anteckning |
|------|-------|------------|
| Smart Inkast + submitInkastLite + DCAP | **KEEP** | G10 done · inboxClassifier live |
| ChameleonInputShell + SuperModule | **KEEP** | `ChameleonInputShell.tsx` · smoke:superhub |
| Zustand state | **KEEP** | package.json |
| WORM evolution_ledger | **KEEP** | firestore.rules |
| Fristående UploadText / Joyride / supermodules-path | **DEFER** | Annan prod-struktur |
| CI Jest/Cypress/Snyk · staging/canary | **DEFER** | Prod: smoke:predeploy i GH Actions |
| IndexedDB/Workbox offline-kö | **PARTIAL** | workbox deps · våg 2 kandidat |
| Andnings-feedback vid upload | **KEEP** (princip) | våg 2 UX |
| Local Vault · hash chain · stealth exit · Dead Man's Switch | **PMIR** | batch 04 |
| RBAC hasRole rules · cross-RAG · gamification · Gmail · self-healing · projektions-profil | **REJECT** | U1/U6 · batch 04 |

**YOLO 2026-06-19:** smoke:predeploy PASS · merge NO-GO (dirty tree).


---

## Smoke

```bash
npm run smoke:guard
```
