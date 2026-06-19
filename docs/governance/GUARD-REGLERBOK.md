# Guard- och Regelbok — Livskompassen v2

**Version:** 2026-06-19  
**Syfte:** Enhetlig governance före strategisk planering och YOLO-sprintar.  
**Cursor-regler:** `.cursor/rules/projectGuard.mdc` (index) · `.cursor/rules/guard-regelbok.mdc` (operativ)  
**Session:** Bygger på commit `fabc864` (prompt governance) och audit R1–R8 (2026-06-19).

---

## 1. Projektpolicies (sammanfattning)

Full kanon dupliceras inte här — följ länkade `.mdc`-regler.

| Princip | Kanon | Operativ regel |
|---------|-------|----------------|
| Tre silos | `grunder-kanon.mdc` U1 | Kunskap · Valv · Barnen — aldrig cross-RAG |
| WORM | `grunder-kanon.mdc` U3 | Append-only bevis; beteende + datum |
| DCAP före LLM | `grunder-kanon.mdc` U2 | Kod beslutar routing — inte modellen |
| Zero Footprint | `grunder-kanon.mdc` U4 | Speglar/Hamn utan persistent RAG |
| Kill Switch / Device Clear | `grunder-kanon.mdc` U4 | Rensa RAM/session vid logout/blur/panic |
| Locked UX | `locked-ux-features.mdc` | PMIR + Pontus OK före ändring |
| PMIR / merge | `git-main-trunk.mdc` | Rapport före merge/deploy |
| Deploy-gate | `yolo-vakt-gate.mdc` | smoke:predeploy PASS + YOLO GO |

---

## 2. Hallucinationsprotokoll

1. **Källor:** Endast kodbas, docs (`.md`, `.spec`, register), smoke-resultat och explicit användarinmatning.
2. **Osäkerhet:** Svara *"Ej tillräckligt data för bedömning."* — eller *"ej verifierat"* med exakt kommando för bevis.
3. **Spårbarhet:** Fil:rad vid kodreferenser; register vinner vid GAP-konflikt (`Arkiv-GAP-REGISTER.md`).
4. **Stub vs live:** Kontrollera `synapseBus.ts` och callables — inte bara äldre docs.
5. **Flagga:** Markera gissningar som hallucination; gissa aldrig deploy-status, secrets eller Vector-index.

Validering i governance-prompter: `npm run smoke:prompts` / `npm run smoke:guard`.

---

## 3. Locked UX (kortlista)

Full spec: `.context/locked-ux-features.md` · `locked-ux-features.mdc`.

- **Barnfokus** — `FamiljenBarnfokusDelegate`, `BARNFOKUS_QUESTIONS`, Superhub på `/familjen?tab=reflektion`
- **Valv Pansaret** — Mönster, Orkester, Kunskapsbank, Aktörskarta (`/valvet?vaultTab=…`)
- **Drawer** — Vardag + Valv (PIN); inga valv-länkar utan biometrisk session
- **Planering hybrid** — P3 Kanban kvar; projekt flexibelt
- **Barnporten HITL** — `SaveAsEvidencePrompt`; ingen auto-promote till Valv
- **Ikoner** — D1/M2/WH1/WH2 (`locked-icons.mdc`)

Smoke: `npm run smoke:locked-ux` vid Valv/Familjen/MåBra-ändringar.

---

## 4. PMIR-gates (hard stop)

| Område | Krav |
|--------|------|
| `firestore.rules` / `storage.rules` | PMIR + explicit Pontus OK (Fas 22.3 blockerad utan 22.2 PMIR) |
| Runtime-prompter (`sharedRules.ts`) | PMIR per `backend-agents.mdc` |
| Locked UX / Sacred | PMIR + uppdatera `.context/locked-ux-features.md` |
| Mass-radering | Arkiv-först + PMIR |
| App Check Enforce | Console — Pontus manuellt |
| Prod deploy | YOLO GO + `smoke:predeploy` PASS |

Mall: `docs/MERGE-IMPACT-RAPPORT.md`.

---

## 5. Subagent-checklista

Innan implementation eller deploy:

- [ ] Vilken zon/silo? (Hjärtat · Vardagen · Familjen · Valv)
- [ ] Rör det WORM, rules eller locked UX? → STOP utan PMIR
- [ ] Finns befintlig kanon/GAP? (`planering-kanon-guard.mdc`)
- [ ] Verifierat beteende i kod (fil:rad)?
- [ ] Prompt-ändring? → `npm run smoke:prompts`
- [ ] UX-lås? → `npm run smoke:locked-ux`
- [ ] Agents/synapser? → `npm run smoke:orkester`
- [ ] Pre-deploy? → `npm run smoke:predeploy:build`

---

## 6. YOLO-sprint — preamble

Kanon: `docs/YOLO-VAKT-GATE.md` · `yolo-vakt-gate.mdc`.

```
Read-only audit → GO/NO-GO → smoke:yolo (+ tier2) → PMIR vid stopp → named deploy
```

**NO-GO:** dirty tree · WORM/rules utan PMIR · locked UX-regression · smoke FAIL.

**Session-audit (R1–R8) — status efter governance-våg:**

| Risk | Beskrivning | Status |
|------|-------------|--------|
| R1 | `projectGuard.mdc` saknades | **Åtgärdad** — fil + guard-regelbok |
| R2 | `smoke:prompts` utanför gate | **Delvis** — i `smoke:tier1`, `smoke:predeploy`, `smoke:yolo` |
| R3 | Dirty working tree | **Öppen** — Pontus städar före deploy |
| R4 | `main` divergerad | **Öppen** — `pull --ff-only` före merge |
| R5 | Fas 22.3 rules-wire | **Stopp kvar** — vänta 22.2 PMIR |
| R6 | Governance ≠ runtime prompts | **Dokumenterad** — PMIR för `sharedRules.ts` |
| R7 | Locked UX-regression | **Guardrail** — smoke:locked-ux |
| R8 | App Check Enforce | **Manuell gate** — Pontus |

---

## 7. Prompt-inventering

### Governance (säker att skriva om)

| Fil | Roll | Validering |
|-----|------|------------|
| `prompts/safeClassificationPrompt.json` | Silo-klassificering (Cursor/manuell) | smoke:prompts |
| `prompts/guardedAgentInstruction.json` | Agent-grundinstruktion | smoke:prompts |
| `docs/prompts/SAKER-AI-PROMPTS.json` | Registry + mallar | smoke:prompts |
| `docs/prompts/SAKER-AI-PROMPTS.md` | Användning (mänsklig) | — |

### Runtime (dokumentera only — PMIR före ändring)

| Fil | Roll |
|-----|------|
| `functions/src/sharedRules.ts` | Alla prod agent-systemprompter |
| `functions/src/expertPrompts.ts` | Expertlägen (reality_checker, adhd_coach) |

**Driftnotis (R6):** Inkast-klassificering i prod använder `INKORG_SORTERARE_SYSTEM_PROMPT` i `sharedRules.ts`, inte `prompts/safeClassificationPrompt.json`. Håll semantik aligned via PMIR — inte ad hoc.

### Pipeline Studio (FTD — metadata)

| Fil | Callable | Silo |
|-----|----------|------|
| `docs/pipeline-studio/tools/flow_inkast_classify.json` | `previewInboxClassification` | multi |
| `docs/pipeline-studio/tools/flow_biff_rewrite.json` | `biffRewriteDraft` | hamn |
| `docs/pipeline-studio/tools/flow_brusfilter.json` | `processBrusfilter` | valv |
| `docs/pipeline-studio/tools/flow_valv_chat.json` | `valvChatQuery` | valv |
| `docs/pipeline-studio/tools/flow_pattern_assist.json` | mönster-assist | valv |
| `docs/pipeline-studio/tools/flow_dossier_foreword.json` | dossier | valv |

Validering FTD: `npm run pipeline:validate`.

### Cursor-regler med prompt-referenser

- `projectGuard.mdc`, `guard-regelbok.mdc`, `anti-hallucination.mdc`
- `backend-agents.mdc`, `backend-ingest-logic.mdc`, `pipeline-studio.mdc`
- `fas19/20/21/22-masterplan-guard.mdc` → pre-flight-prompter i `docs/prompts/FAS*-PREFLIGHT-SUPERPROMPT.md`

---

## 8. Compliance-tester

| Kommando | När |
|----------|-----|
| `npm run smoke:prompts` | Efter ändring i `prompts/` eller `docs/prompts/SAKER-AI-PROMPTS.json` |
| `npm run smoke:guard` | Alias — governance-filer + prompt-validering |
| `npm run smoke:predeploy` | Static gate före deploy (inkl. tier1 → prompts) |
| `npm run smoke:predeploy:build` | Full lokal gate (build + predeploy) |
| `npm run smoke:yolo` | YOLO-vakt batch (build + locked-ux + orkester + prompts m.m.) |
| `npm run smoke:locked-ux` | Valv, Familjen, Barnfokus, drawer, Hamn BIFF |
| `npm run smoke:orkester` | ADK, synapser, agents, inkast |
| `npm run smoke:innehall` | Content_class, INNEHALL-REGISTER |
| `npm run pipeline:validate` | Pipeline Studio FTD |

**Minimum före "klart":** `npm run build` + relevant smoke enligt diff.

---

## 9. Relaterade commits och docs

- **fabc864** — Kanoniska säkra AI-prompter + `smoke:prompts`
- **Fas 22** — `docs/evaluations/2026-06-18-fas22-masterplan-v2.md` (22.3 rules = PMIR-stopp)
- **YOLO** — `docs/YOLO-VAKT-GATE.md`
