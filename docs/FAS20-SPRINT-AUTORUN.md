# Fas 20 Sprint Autorun — Master YOLO

**State:** `.orkester/fas20-state.json` · **Kanon:** `docs/evaluations/2026-06-18-fas20-masterplan-v2.md`

## Start

```bash
export FAS20_AUTORUN=1 ORKESTER_AUTORUN=1 MASTER_AUTORUN=1
npm run fas20:autorun
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
git add -A && git commit -m "fas20: <waveId> — <varför>"
git pull --ff-only origin main && git push origin main
firebase deploy --only <named>
```

## Handoff

En våg = en chatt. Läs fas20-state.json + senaste fas20-vag eval.
