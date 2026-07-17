# Fas 21 Sprint Autorun — Master YOLO

**State:** `.orkester/fas21-state.json` · **Kanon:** `docs/evaluations/2026-06-18-fas21-masterplan-v2.md`

## Start

```bash
export FAS21_AUTORUN=1 ORKESTER_AUTORUN=1 MASTER_AUTORUN=1
npm run fas21:autorun
npm run orkester:night
```

## Säkerhetsblock

- WORM · tre silos · Zero Footprint · prompts endast sharedRules.ts
- Locked UX smoke före merge
- PMIR-stopp: rules, Barnporten UI, Gmail, Genkit, mass-delete
- Named deploy only · ingen force-push
- Max 3 försök per våg

## Trippel-smoke per våg

1. `npm run smoke:manifest && npm run smoke:tier1` (Tier 0)
2. `npm run build && cd functions && npm run build && cd .. && npm run smoke:locked-ux && npm run smoke:orkester` (Tier 1)
3. Wave-extra från masterplan (Tier 2)
4. `npm run orkester:night` (Tier 3)

## Git + deploy (efter PASS)

```bash
git add -A && git commit -m "fas21: <waveId> — <varför>"
git pull --ff-only origin main && git push origin main
firebase deploy --only <named>
```

## Handoff

En våg = en chatt. Läs fas21-state.json + senaste fas21-vag eval.

## Startprompt

```
FAS 21 MASTER YOLO — full kö. Läs docs/FAS21-SPRINT-AUTORUN.md och .orkester/fas21-state.json.
Fortsätt nextWaveId tills status done. Per våg: trippel-smoke Tier 0–3 → specialist-verifier på 21.3/21.10 → vid PASS: commit → pull --ff-only → push → named deploy.
PMIR-stopp: SKIP + docs/evaluations/YYYY-MM-DD-blocker-fas21-<waveId>.md.
Bevara Locked UX, tre silos, WORM, prompts endast sharedRules.ts. Ingen force-push.
Jämför mot hela projektets kontext. Arbeta autonomt tills slutrapport eller hard stop.
```
