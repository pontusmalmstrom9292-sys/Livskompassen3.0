# Orkester Autorun — nattpass & specialister

**Syfte:** Deterministisk batch-körning medan du sover + Cursor-specialister för fortsatt vävning imorgon.

**Senast uppdaterad:** 2026-05-24

---

## Två sätt att köra

### 1. Terminal (deterministisk — ingen LLM)

```bash
npm run orkester:night
```

Kör i ordning:

1. `smoke:locked-ux` + `smoke:design-modules`
2. `smoke:orkester` (ADK wiring + functions build)
3. Frontend `npm run build`
4. ESLint (optional — fail soft)

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

- [`SYSTEMKONTROLL.md`](./SYSTEMKONTROLL.md) — analyser A–E
- [`.context/system-plan.md`](../.context/system-plan.md) — fas & öppna punkter
- [`Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md) — G1–G14 done
