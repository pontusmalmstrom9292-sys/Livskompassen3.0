# Cursor — modellval & YOLO-optimering (Livskompassen)

**Syfte:** Praktisk guide för Pontus + agenter — byggd ovanpå befintlig YOLO-vakt, smoke-scripts och `.cursor/rules/`.  
**Regel (agent):** [`.cursor/rules/model-routing.mdc`](../.cursor/rules/model-routing.mdc)  
**Deploy-gate:** [`docs/YOLO-VAKT-GATE.md`](./YOLO-VAKT-GATE.md)  
**Extern orkester (ChatBox/Gem):** [`docs/external-ai/chatbox/MODEL-PICKER.md`](./external-ai/chatbox/MODEL-PICKER.md)

---

## Vad som *inte* går att automatisera

Cursor låter dig **inte** tvinga modellbyte från projektregler (varken gamla `.cursorrules` eller moderna `.mdc`). Modellväljaren i IDE:t styrs alltid av dig.

Det går däremot att:

- instruera agenten att **påminna** om modellbyte,
- **stoppa** vid PMIR/säkerhet om fel modell används,
- **styra när** regler laddas (globs, `@`-referens) för lägre tokenkostnad,
- koppla **rätt smoke-tier** till rätt typ av YOLO-körning.

---

## 1b. Fråga dig vs agenten väljer själv

| Du behöver ingripa | Agenten sköter själv |
|--------------------|----------------------|
| PMIR, deploy, merge, `firestore.rules` | Trivial UI/copy |
| Stor refaktor om huvudchatten kör lätt modell | Subagent med rätt `model` i Task |
| Kostnadspreferens (billigare modell) | Backend via `gpt-5.5-high` subagent |
| Osäkerhet — agenten presenterar **ett** rekommenderat val | Flerstegs-loop efter *"kör själv"* / *"bygg till perfektion"* |

**Praktiskt:** Du behöver inte byta modell för varje delsteg. Säg *"kör själv med subagents"* — då delegerar agenten tunga delar till rätt modell medan du kan sitta kvar i en snabbare huvudmodell.

---

## 1c. Flerstegs perfektionsloop (tung kod)

När funktionen är **stor, säkerhetskritisk eller många filer** — be agenten (eller låt den själv) köra:

1. **Utforska** — kartlägg kod och risker (`explore`)
2. **Planera** — REASONS / PMIR vid behov
3. **Bygg** — implementation med `gpt-5.5-high` (backend) eller Sonnet (UI)
4. **Granska** — `bugbot` + ev. `security-review` (readonly)
5. **Verifiera** — `specialist-smoke-runner` + rätt smoke-tier
6. **Fixa** — upprepa tills PASS (max ~5 varv, sedan ett eskalationssteg till dig)

**Ett kommando att klistra in:**

```
Kör flerstegs perfektionsloop enligt @model-routing: utforska → planera → bygg → granska → smoke → fixa tills PASS. Välj själv lämplig subagent-modell per fas. Jämför mot hela projektet. Sluta inte förrän smoke PASS eller PMIR-stopp.
```

---

## 1. Projektregel: `model-routing.mdc`

Fil: [`.cursor/rules/model-routing.mdc`](../.cursor/rules/model-routing.mdc)

| Egenskap | Värde | Varför |
|----------|-------|--------|
| `alwaysApply` | `false` | Laddas inte i varje prompt — sparar tokens |
| Anrop | `@model-routing` i chatten | När du startar YOLO, deploy eller stor våg |
| Innehåll | Modell → uppgift, smoke-tier, subagents, PMIR-stopp | Ersätter generiska "Claude 3.5"-exempel |

**Säkerhetsspärr:** Vid komplex WORM/PMIR/refaktor utan resonerande modell ska agenten börja med en tydlig varning och **ett** nästa steg — inte köra vidare som om allt vore en enkel CSS-fix.

---

## 2. Smoke-hierarki (optimerad — använd rätt tier)

Projektet har redan flera smoke-kommandon. Använd **minsta tier som räcker**:

```
smoke:yolo  ⊂  smoke:predeploy  ⊂  smoke:predeploy:build  ⊂  smoke:super-yolo
```

| Tier | Kommando | Tid ungefär | När |
|------|----------|-------------|-----|
| **A — Snabb** | `YOLO_SKIP_BUILD=1 npm run smoke:yolo` | Kort | UI-copy, liten komponent, snabb iteration |
| **B — Static gate** | `npm run smoke:predeploy` | Medel | Efter `functions` build, utan frontend build |
| **C — Deploy gate** | `npm run smoke:predeploy:build` | Längre | **Merge, deploy, YOLO GO** (kanon) |
| **D — Live** | `npm run smoke:predeploy:live` | + nätverk | Efter deploy, kräver `.env` |
| **E — Release** | `npm run smoke:super-yolo` | Längst | Stor release, inte daglig loop |

### Vad varje tier täcker (kort)

**`smoke:yolo`** (`scripts/smoke_yolo_gate.mjs`): build (valfritt) + manifest, chrome-header, locked-ux, orkester, plausible-deniability, valv-security, innehall, prompts.

**`smoke:predeploy`**: tier1 (design-modules, agents-ui, synapse, inkast, weaver-hitl, biff, …) + valv-security, plausible-deniability, locked-icons, barn-epistemik, epistemic-guard, dcap-routing.

**`smoke:predeploy:build`**: functions + frontend build + `smoke:predeploy` — **detta är deploy-minimum**.

Tier 2 domän-extra (Valv, Hamn, Inkast, …): se matris i [`YOLO-VAKT-GATE.md`](./YOLO-VAKT-GATE.md).

---

## 3. YOLO-körningar — tre spår

### Spår 1: Daglig kod (Cursor Agent + YOLO UI)

1. Välj modell efter tabell nedan.
2. Slå på **YOLO** i Agent om du vill att verktyg körs utan ständiga frågor.
3. Efter kod: rätt smoke-tier (oftast Tier A eller C).
4. Vid touch av WORM/rules: `/yolo-vakt` först.

### Spår 2: Deploy (YOLO-vakt)

Sekvens (oförändrad kanon):

1. `git diff origin/main...HEAD` — klassificera zon.
2. `/yolo-vakt` → GO / NO-GO.
3. Vid GO: `npm run smoke:predeploy:build` + Tier 2 vid behov.
4. Pontus OK vid PMIR.
5. Named deploy enligt [`DEPLOY.md`](./DEPLOY.md).
6. Audit: `docs/evaluations/YYYY-MM-DD-yolo-audit.md`.

### Spår 3: Autorun (terminal + Agent)

| Kö | Start | State |
|----|-------|-------|
| Nattpass (ingen LLM) | `npm run orkester:night` | `.orkester/runs/` |
| Master YOLO | `npm run master:yolo` | `.orkester/master-state.json` |
| Fas 22 | `npm run fas22:autorun` | `.orkester/fas22-state.json` |

**Regel:** En våg = en chatt. Ny chatt vid full kontext — se [`MASTER-YOLO-AUTORUN.md`](./MASTER-YOLO-AUTORUN.md).

---

## 4. Modellval i Cursor (Livskompassen-stack)

| Uppgift | Cursor-modell | Smoke | Agent |
|---------|---------------|-------|-------|
| WORM, `firestore.rules`, säkerhetsaudit | Claude Opus 4.8 Thinking | Tier C + Tier 2 | `/yolo-vakt` |
| Functions, ADK, synapser | GPT-5.5 High | Tier B/C | `specialist-adk-weaver` |
| React, Superhub, locked UX | Claude Sonnet 4.6 Thinking | Tier A + `smoke:locked-ux` | zon-builder |
| Enfil-debug, scripts | GPT-5.4 / Codex High | mål-smoke | — |
| Snabb CSS/copy | Composer 2.5 Fast | Tier A | — |
| Repo-hygien, checklistor | GPT-5.4 Mini (ChatBox) / Codex | `smoke:manifest` | — |

För arbete **utanför** Cursor (ChatBox, Gemini Gem, Flow): följ [`MODEL-PICKER.md`](./external-ai/chatbox/MODEL-PICKER.md) — **GATE:** ingen prod-build före godkänd Deep Research / PMIR.

### Parallellregel (spara förvirring)

- Max **2** chattar samtidigt.
- **OK:** audit + research, SPEC + diagram.
- **Aldrig:** två modeller på samma fil; backend ∥ frontend upload.

---

## 5. Token-optimering med `.mdc`

| Mekanism | Exempel | Effekt |
|----------|---------|--------|
| `alwaysApply: false` | `model-routing.mdc`, `yolo-vakt-gate.mdc` | Laddas bara vid `@` eller agent-request |
| Globs | `design-calm.mdc` → `src/**/*.tsx` | UI-regler bara vid UI-filer |
| Kärn-index | `.cursor/index.mdc` (~300 tokens) | WORM/silo/DCAP alltid, resten pekare |
| `@model-routing` | Start av YOLO/deploy-chatt | Full modell+smoke-matris utan ständig kostnad |

Globala regler i Cursor Settings → Rules for AI: använd sparsamt för **beteende** (ett steg i taget, ingen JADE) — duplicera inte hela YOLO-kanon där; den ligger i repo.

---

## 6. Subagents och modell (agent väljer proaktivt)

I Cursor Task kan subagents få explicit `model` (t.ex. `claude-opus-4-8-thinking-high` för security-auditor). Det påverkar **inte** huvudchattens modell — bara den delegerade uppgiften. **Agenten ska välja modell utan att du byter manuellt**, såvida inte PMIR/deploy kräver ditt OK.

| Subagent | Roll | Modell |
|----------|------|--------|
| `explore` | Kartlägg kod | inherit |
| `yolo-vakt` | Read-only GO/NO-GO | inherit |
| `specialist-security-auditor` | WORM/silo audit | Opus 4.8 Thinking |
| `specialist-adk-weaver` | SynapseBus, ADK | GPT-5.5 High |
| `specialist-smoke-runner` | Kör smoke | GPT-5.4 High |
| `bugbot` | Diff-granskning | inherit |
| `orkester-conductor` | Nattpass-delegation | GPT-5.5 High |

**Dina triggers:** *"kör själv"*, *"använd bästa modell"*, *"bygg till perfektion"* → agenten startar flerstegs-loop enligt §1c.

---

## 7. Snabbreferens — ett steg per situation

| Situation | Gör detta |
|-----------|-----------|
| Litet UI-fix | Composer fast → `YOLO_SKIP_BUILD=1 npm run smoke:yolo` |
| Callable/backend | GPT-5.5 → `npm run smoke:predeploy:build` |
| Deploy | `/yolo-vakt` → Tier C PASS → Pontus OK → named deploy |
| Full kontext i chatt | Ny chatt + handoff från `master-state.json` |
| Osäker på modell | `@model-routing` + fråga agenten |
| Tung funktion / perfektion | *"Kör flerstegs-loop enligt @model-routing"* (§1c) |

---

## Relaterat

- [`.cursor/rules/yolo-vakt-gate.mdc`](../.cursor/rules/yolo-vakt-gate.mdc)
- [`.cursor/agents/yolo-vakt.md`](../.cursor/agents/yolo-vakt.md)
- [`docs/MASTER-YOLO-AUTORUN.md`](./MASTER-YOLO-AUTORUN.md)
- [`docs/ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md)
- [`.cursor/rules/orkester-autorun.mdc`](../.cursor/rules/orkester-autorun.mdc)
