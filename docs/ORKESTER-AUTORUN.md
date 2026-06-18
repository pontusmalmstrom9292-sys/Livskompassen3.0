# Orkester Autorun — nattpass & specialister

**Syfte:** Deterministisk batch-körning medan du sover + Cursor-specialister för fortsatt vävning imorgon.

**Senast uppdaterad:** 2026-06-16

---

## Rollout nattpass (Cursor-native Block A+B)

Fokuserad autorun för superhub-rollout — ersätter manuell smoke så långt det går:

```bash
npm run rollout:night
```

Kanon: [`evaluations/2026-06-06-cursor-native-autorun.md`](./evaluations/2026-06-06-cursor-native-autorun.md)

| Fas | Kommando |
|-----|----------|
| rollout-smoke | `npm run smoke:rollout` |
| functions-build | `functions` build |
| frontend-build | `npm run build` |
| lint | ESLint (optional) |

State: `.orkester/rollout-state.json` · Rapport: `docs/evaluations/YYYY-MM-DD-rollout-natt.md`

---

## Fas 19 Sprint (done 2026-06-18)

Historisk: [`FAS19-SPRINT-AUTORUN.md`](./FAS19-SPRINT-AUTORUN.md) · state `.orkester/fas19-state.json`

---

## Fas 20 Sprint (aktiv — Master YOLO)

För Fas 20.1–slutrapport enligt godkänd masterplan: [`FAS20-SPRINT-AUTORUN.md`](./FAS20-SPRINT-AUTORUN.md)

```bash
export FAS20_AUTORUN=1 ORKESTER_AUTORUN=1 MASTER_AUTORUN=1
npm run fas20:autorun
npm run orkester:night
```

State: `.orkester/fas20-state.json` · Logg: `docs/evaluations/YYYY-MM-DD-fas20-vag-<id>.md`

---

## Master YOLO (hela projektets öppna kö)

För lång autonom körning (våg 0–18, commit/push/deploy): [`MASTER-YOLO-AUTORUN.md`](./MASTER-YOLO-AUTORUN.md) — **historisk, done**

```bash
export MASTER_AUTORUN=1 ORKESTER_AUTORUN=1
npm run master:yolo
npm run orkester:night
```

State: `.orkester/master-state.json` · Logg: `docs/evaluations/YYYY-MM-DD-master-yolo-log.md`

---

## Två sätt att köra

### 1. Terminal (deterministisk — ingen LLM)

```bash
npm run orkester:night
```

Kör i ordning (se även [`ORKESTER-BACKLOG-PLANS.md`](./ORKESTER-BACKLOG-PLANS.md)):

1. `smoke:locked-ux` + `smoke:design-modules`
2. `smoke:rollout` (optional — Cursor-native Block A+B)
3. `smoke:innehall` (U6)
4. `smoke:locked-icons` (B1/D1/M2)
5. `smoke:orkester` (ADK wiring)
6. Functions `npm run build`
7. Frontend `npm run build`
8. ESLint (optional — fail soft)

**Output:**

| Fil | Innehåll |
|-----|----------|
| `.orkester/state.json` | `nextPhase`, `completedPhases`, `failures` |
| `.orkester/runs/<timestamp>.json` | Full logg |
| `docs/evaluations/YYYY-MM-DD-orkester-natt.md` | Morgonrapport |

### 2. Cursor (specialister + Conductor)

Säg i chatten:

> Kör orkester nattpass — fortsätt från `.orkester/state.json`

Conductor: `.cursor/agents/orkester-conductor.md`

| Specialist | Agent-fil | Fokus |
|------------|-----------|-------|
| UX Guardian | `specialist-ux-guardian.md` | Locked UX smoke |
| ADK Weaver | `specialist-adk-weaver.md` | SynapseBus, silos |
| Security Auditor | `specialist-security-auditor.md` | Sacred, WORM, rules |
| Smoke Runner | `specialist-smoke-runner.md` | Build + smoke |
| Verifier | `specialist-verifier.md` | Skeptisk PASS/GAP (Fas 6) |
| Valv Builder | `specialist-valv-builder.md` | Z1 slutbygge (Fas 5) |
| Hjärtat+Inkast | `specialist-hjartat-inkast-builder.md` | Z3+6 (Fas 5) |
| Familjen+Hamn | `specialist-familjen-hamn-builder.md` | Z5+2 (Fas 5) |
| Vardagen | `specialist-vardagen-builder.md` | Z4 (Fas 5) |

**Deploy:** skill `.cursor/skills/livskompassen-deploy/` (inte subagent).

**Subagent-handoff:** [`docs/external-ai/prompts/SPECIALIST-SUBAGENTS-HANDOFF.md`](./external-ai/prompts/SPECIALIST-SUBAGENTS-HANDOFF.md)

**Hooks:** `.cursor/hooks.json` — vid `ORKESTER_AUTORUN=1` föreslår `stop`-hook nästa fas.

```bash
export ORKESTER_AUTORUN=1
```

---

## Regler & kanon

| Regel | Fil |
|-------|-----|
| Orkester autorun | `.cursor/rules/orkester-autorun.mdc` |
| Grunder U1–U5 | `.cursor/rules/grunder-kanon.mdc` |
| Anti-hallucination | `.cursor/rules/anti-hallucination.mdc` |
| ADK synapser | `.cursor/rules/synapser-adk.mdc` |

---

## Smoke:orkester (ny)

```bash
npm run smoke:innehall   # U6 innehållskanon (ingår även i orkester)
npm run smoke:orkester
```

Statisk verifiering:

- Alla fyra synapse-handlers wired (inte stub)
- `journal_woven` kräver `optIn === true`
- `dcap_alerts` WORM i Firestore rules
- Dagbok → `journalWovenToKampspar` callable
- Orkester UI (VaultOrkesterPanel) + specialist-agents finns

---

## Morgon — ett steg

1. Öppna `docs/evaluations/YYYY-MM-DD-orkester-natt.md`
2. Om PASS: kör manuell smoke #18 (ekonomi) om du deployat — se `docs/SMOKE_CHECKLIST.md`
3. Om FAIL: fixa **en** fas i taget (progressive disclosure)

---

## Relaterat

- [`ORKESTER-BACKLOG-PLANS.md`](./ORKESTER-BACKLOG-PLANS.md) — backlog av delplaner (ikoner, git, Fas A–D)
- [`SYSTEMKONTROLL.md`](./SYSTEMKONTROLL.md) — analyser A–E
- [`.context/system-plan.md`](../.context/system-plan.md) — fas & öppna punkter
- [`Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md) — G1–G14 done
