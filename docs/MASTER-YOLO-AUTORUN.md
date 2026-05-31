# Master YOLO Autorun — en kö för hela projektet

**Syfte:** En kanonisk vågkö som samlar all öppen backlog (historiska planer → en sekvens). Starta **en gång** innan du lämnar Mac; terminal + Agent fortsätter med state och logg.

**Senast uppdaterad:** 2026-05-31 (§ Ny chatt vid full kontext)  
**State:** [`.orkester/master-state.json`](../.orkester/master-state.json)  
**Logg:** `docs/evaluations/YYYY-MM-DD-master-yolo-log.md`  
**Slutrapport:** `docs/evaluations/YYYY-MM-DD-master-yolo-leverans.md`

---

## Redan klart (kön implementerar inte om)

- Arkiv G1–G16 **done**
- Superhub v2 mergad (`feat/superhub-v2` → `main`)
- Hub-analys Fas 1 **done**
- 2026-05-29 cursor-planer **`closed`** — öppet = [`MODUL-GAP-OVERSIKT.md`](./MODUL-GAP-OVERSIKT.md)
- Content autorun våg 0–7 i repo

---

## Begränsning

| Mekanism | Utan dig? |
|----------|-----------|
| `npm run orkester:night` | **Ja** |
| Agent-vågar (YOLO) | **Ja** om Agent-chatt öppen + YOLO |
| Hooks `stop` + `ORKESTER_AUTORUN=1` | Kedja upp till `loop_limit` i [`.cursor/hooks.json`](../.cursor/hooks.json) |
| Manuell smoke #3/#4/#2d | **Nej** — vid återkomst |

---

## Start (innan du går)

**Terminal** (`Ctrl + ``):

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
export MASTER_AUTORUN=1 ORKESTER_AUTORUN=1
npm run master:yolo
npm run orkester:night
```

**Agent** (`Cmd + L`), **YOLO på**, klistra in [Startprompt](#startprompt) nedan. Låt **en** chatt vara öppen; stäng inte Cursor om lokal körning ska fortsätta.

---

## Startprompt

```
MASTER YOLO AUTORUN — full kö. Läs docs/MASTER-YOLO-AUTORUN.md och .orkester/master-state.json.
Fortsätt nextWaveId tills status done. Per våg: läs planfil → implementera ENDAST scope → standard smoke → vid PASS: commit → git pull --ff-only origin main → git push origin main → firebase deploy enligt tabell.
PMIR-stopp: SKIP + docs/evaluations/YYYY-MM-DD-blocker-<waveId>.md, uppdatera master-state, fortsätt nästa våg.
Ingen force-push. Bevara Locked UX, tre silos, WORM, prompts endast functions/src/sharedRules.ts.
Vid FAIL: max 3 försök samma våg, sedan logga failure och stoppa kön.
Jämför mot hela projektets kontext. Arbeta autonomt tills våg slutrapport (id slutrapport) eller hard stop.
```

---

## Standard smoke (våg 1–17, efter kod)

```bash
npm run build
cd functions && npm run build && cd ..
npm run smoke:locked-ux && npm run smoke:orkester
```

Lägg till **smoke-extra** från vågtabellen om angivet.

---

## Git + deploy (full autonomi — godkänd policy)

Efter **PASS** (vågar med `deploy` ≠ `none`):

```bash
git add -A
git commit -m "master-yolo: <waveId> — <kort varför>"
git pull --ff-only origin main
git push origin main
firebase use gen-lang-client-0481875058
```

Deploy enligt kolumn **Deploy** (aldrig `firebase deploy --only functions` utan namn; undvik full functions utan secret-plan).

| Deploy-värde | Kommando |
|--------------|----------|
| `hosting` | `firebase deploy --only hosting` |
| `functions:submitInkastLite` | `firebase deploy --only functions:submitInkastLite` (lägg till `classifyInboxDocument` om ändrad) |
| `none` | Hoppa deploy |

---

## Vågkö

| # | ID | Plan / källa | Smoke-extra | Deploy |
|---|-----|--------------|-------------|--------|
| 0 | `baseline` | `npm run orkester:night` (terminal, före Agent) | — | none |
| 1 | `doc-sync` | Uppdatera [`SENASTE-SAMMANFATTNING.md`](./evaluations/SENASTE-SAMMANFATTNING.md), superhub-rad i [`MODUL-GAP-OVERSIKT.md`](./MODUL-GAP-OVERSIKT.md) | none | none |
| 2 | `hub-gora` | [`2026-05-31-gora-ombyggnad-plan.md`](./evaluations/2026-05-31-gora-ombyggnad-plan.md) Fas 2+ | locked-ux | hosting |
| 3 | `hub-dagbok` | [`2026-05-31-dagbok-ombyggnad-plan.md`](./evaluations/2026-05-31-dagbok-ombyggnad-plan.md) Fas 2+ | smoke:speglar | hosting |
| 4 | `hub-familjen` | [`2026-05-31-familjen-ombyggnad-plan.md`](./evaluations/2026-05-31-familjen-ombyggnad-plan.md) Fas 2+ (ej Barnporten kanon-UI) | locked-ux | hosting |
| 5 | `hub-valv` | [`2026-05-31-valv-ombyggnad-plan.md`](./evaluations/2026-05-31-valv-ombyggnad-plan.md) Fas 2+ | locked-ux, smoke:valv | hosting |
| 6 | `hub-trygghet` | [`2026-05-31-trygghet-ombyggnad-plan.md`](./evaluations/2026-05-31-trygghet-ombyggnad-plan.md) Fas 2+ | smoke:design-modules | hosting |
| 7 | `hub-arbetsliv` | [`2026-05-31-arbetsliv-ombyggnad-plan.md`](./evaluations/2026-05-31-arbetsliv-ombyggnad-plan.md) Fas 2+ | smoke:arbetsliv | hosting |
| 8 | `hub-vardag` | [`2026-05-31-vardag-ombyggnad-plan.md`](./evaluations/2026-05-31-vardag-ombyggnad-plan.md) Fas 2+ | smoke:compass, smoke:mabra | hosting |
| 9 | `hub-kompass` | [`2026-05-31-kompass-ombyggnad-plan.md`](./evaluations/2026-05-31-kompass-ombyggnad-plan.md) Fas 2+ | smoke:design-modules | hosting |
| 10 | `mabra-fas2` | [`2026-05-29-mabra-cursor-plan.md`](./evaluations/2026-05-29-mabra-cursor-plan.md) Fas 2 kvar | smoke:innehall, locked-ux | hosting |
| 11 | `valv-samla` | [`2026-05-29-valv-samla-cursor-plan.md`](./evaluations/2026-05-29-valv-samla-cursor-plan.md) Fas 2 | locked-ux, orkester | hosting |
| 12 | `inkast-fas2` | [`2026-05-27-nasta-fas-plan.md`](./evaluations/2026-05-27-nasta-fas-plan.md) spår 4 — **ingen Gmail** | orkester, smoke:inbox | functions:submitInkastLite |
| 13 | `kunskap-ux` | [`2026-05-29-kunskap-cursor-plan.md`](./evaluations/2026-05-29-kunskap-cursor-plan.md) | orkester | hosting |
| 14 | `projekt-p2` | [`2026-05-29-projekt-cursor-plan.md`](./evaluations/2026-05-29-projekt-cursor-plan.md) + [`fas5d-backlog`](./evaluations/2026-05-31-fas5d-backlog.md) | locked-ux | hosting |
| 15 | `lifeos-d` | [`LIFE-OS-KOPPLINGAR-KOMIHAG.md`](./design/LIFE-OS-KOPPLINGAR-KOMIHAG.md) Fas D | locked-ux | hosting |
| 16 | `barnporten-fas2` | [`2026-05-29-barnporten-cursor-plan.md`](./evaluations/2026-05-29-barnporten-cursor-plan.md) Fas 2 (ej kanon-UI) | locked-ux, smoke:children | hosting |
| 17 | `planering-fas3` | [`2026-05-29-planering-cursor-plan.md`](./evaluations/2026-05-29-planering-cursor-plan.md) Fas 3–4 **utan Gmail** | locked-ux | hosting |
| 18 | `slutrapport` | Skriv `YYYY-MM-DD-master-yolo-leverans.md`, kör `npm run orkester:night` | full nattpass | hosting |

---

## PMIR-stopp (SKIP — logga, fortsätt kön)

Enligt [`2026-05-31-hub-syntes-nav.md`](./evaluations/2026-05-31-hub-syntes-nav.md) §4:

- Barnporten kanon-UI (tvåkorts inkorg)
- Familje-PIN på `/familjen`
- G18 dölj Bevis-flik
- Ändringar i `firestore.rules` (t.ex. `project_rules`, `planning_email_rules`)
- Gmail OAuth / Google Calendar
- [`2026-05-31-fas5c-inkorg-beslut.md`](./evaluations/2026-05-31-fas5c-inkorg-beslut.md) (DEFER)
- Kunskap live ingest våg 8 (`seed_kampspar_profile` efter din granskning)

**Vid SKIP:** `docs/evaluations/YYYY-MM-DD-blocker-<waveId>.md` + `master-state.json` → `skippedWaves`.

---

## Utanför kön (du vid återkomst)

- Manuell smoke **#3, #4, #2d** — [`2026-05-31-fas5a-user-checklist.md`](./evaluations/2026-05-31-fas5a-user-checklist.md)
- Superhub domän-checklista — [`2026-06-01-superhub-leverans.md`](./evaluations/2026-06-01-superhub-leverans.md)
- Genkit V1 wait, NotebookLM, BBIC dossier `reportType`

---

## Ny chatt när kontexten är full

**Regel:** *«Låt en chatt vara öppen»* (ovan) gäller **under pågående** autorun i samma session — inte att en full tråd måste hållas vid liv.

| Signal | Gör |
|--------|-----|
| Tröghet, upprepade fel, varning om kontext | **Ny** Agent-chatt (`Cmd + L`) |
| Bara smoke/deploy | **Terminal** — `npm run orkester:night` |
| Kö redan `done` | Ny **smal** chatt per uppgift — kör inte om hela kön |

**Handoff (läs i ordning):**

1. [`.orkester/master-state.json`](../.orkester/master-state.json) — `status`, `skippedWaves` (lokal, gitignored)
2. Senaste [`docs/evaluations/*-master-yolo-leverans.md`](./evaluations/) + [`*-master-yolo-log.md`](./evaluations/)
3. Relevant [`docs/evaluations/*-blocker-<waveId>.md`](./evaluations/) om du tar en SKIP-våg
4. Statusplan: [`docs/evaluations/2026-06-01-master-yolo-status.md`](./evaluations/2026-06-01-master-yolo-status.md)
5. Manuell app: [`docs/evaluations/2026-06-01-USER-nasta-steg.md`](./evaluations/2026-06-01-USER-nasta-steg.md)

**En våg = en chatt** — använd [Per-våg Agent-prompt](#per-våg-agent-prompt-mall) nedan.

### Fortsätt efter handoff (klistra i ny chatt)

```
Fortsätt Master YOLO efter handoff. Läs docs/evaluations/YYYY-MM-DD-master-yolo-leverans.md och .orkester/master-state.json.
Kör INTE om hela kön om status done. Välj EN öppen sak:
- Manuell Fas 5A enligt docs/evaluations/2026-06-01-USER-nasta-steg.md, eller
- En SKIP-våg efter mitt godkännande (läs motsvarande blocker-*.md + planfil i MASTER-YOLO-tabellen).
Standard smoke före commit. Ingen force-push. Bevara Locked UX och tre silos.
Jämför mot hela projektets kontext. Arbeta autonomt tills uppgiften PASS eller tydlig blocker.
```

Återstarta hela kön endast med `npm run master:yolo --reset` + [Startprompt](#startprompt).

---

## Vid återkomst (ett steg)

1. Öppna [`.orkester/master-state.json`](../.orkester/master-state.json) — `nextWaveId`, `completedWaves`, `failures`, `skippedWaves`
2. Öppna senaste `docs/evaluations/*-master-yolo-leverans.md` eller `*-master-yolo-log.md`
3. Om deploy körts: manuell Fas 5A enligt [`2026-06-01-USER-nasta-steg.md`](./evaluations/2026-06-01-USER-nasta-steg.md)
4. Full kontext i gammal chatt → [Ny chatt när kontexten är full](#ny-chatt-när-kontexten-är-full)

---

## Per-våg Agent-prompt (mall)

```
MASTER YOLO — våg <waveId>. Läs docs/MASTER-YOLO-AUTORUN.md rad för <waveId>.
Plan: <planfil>. Implementera ENDAST Fas 2+ / scope i planen. PMIR-stopp enligt MASTER-YOLO.
Efter kod: standard smoke + smoke-extra. Vid PASS: commit, pull --ff-only, push origin main, deploy.
Uppdatera .orkester/master-state.json och append docs/evaluations/YYYY-MM-DD-master-yolo-log.md.
Jämför mot hela projektets kontext. Arbeta autonomt tills vågen PASS, SKIP eller 3 FAIL.
```

---

## Relaterat

- [`ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md) — terminal nattpass (våg 0)
- [`ORKESTER-BACKLOG-PLANS.md`](./ORKESTER-BACKLOG-PLANS.md) — ikoner/git A–D
- [`MODUL-GAP-OVERSIKT.md`](./MODUL-GAP-OVERSIKT.md) — öppet per modul
- [`.cursor/agents/orkester-conductor.md`](../.cursor/agents/orkester-conductor.md)
- [`SKOGSPAKET-LATHUND.md`](./SKOGSPAKET-LATHUND.md) — distans + en uppgift
