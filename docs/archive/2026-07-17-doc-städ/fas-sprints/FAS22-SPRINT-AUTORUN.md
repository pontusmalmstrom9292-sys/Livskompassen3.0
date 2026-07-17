# Fas 22 Sprint Autorun — Master YOLO

**State:** `.orkester/fas22-state.json` · **Kanon:** `docs/evaluations/2026-06-18-fas22-masterplan-v2.md`

## Start

```bash
export FAS22_AUTORUN=1 ORKESTER_AUTORUN=1 MASTER_AUTORUN=1
npm run fas22:autorun
npm run orkester:night
```

## Säkerhetsblock

- WORM · tre silos · Zero Footprint · prompts endast sharedRules.ts
- Locked UX smoke före merge
- PMIR-stopp: rules (utan 22.2 PMIR), Barnporten UI, Gmail, Genkit, mass-delete
- Named deploy only · ingen force-push
- Max 3 försök per våg
- Phase 2 Firestore: 22.2 PMIR godkänd före 22.3

## Trippel-smoke per våg

1. `npm run smoke:manifest && npm run smoke:tier1` (Tier 0)
2. `npm run build && cd functions && npm run build && cd .. && npm run smoke:locked-ux && npm run smoke:orkester` (Tier 1)
3. Wave-extra från masterplan (Tier 2)
4. `npm run orkester:night` (Tier 3)

## Git + deploy (efter PASS)

```bash
git add -A && git commit -m "fas22: <waveId> — <varför>"
git pull --ff-only origin main && git push origin main
firebase deploy --only <named>
```

## Handoff

En våg = en chatt. Läs fas22-state.json + senaste fas22-vag eval.

## specialist-verifier

Obligatorisk på **22.3** (rules) och **22.10** (security).

## Startprompt

```
FAS 22 MASTER YOLO — full kö. Läs docs/FAS22-SPRINT-AUTORUN.md och .orkester/fas22-state.json.
Fortsätt nextWaveId tills status done. Per våg: trippel-smoke Tier 0–3 → specialist-verifier på 22.3/22.10 → vid PASS: commit → pull --ff-only → push → named deploy.
PMIR-stopp: SKIP + docs/evaluations/YYYY-MM-DD-blocker-fas22-<waveId>.md.
22.3 BLOCKERAD utan godkänd 22.2 PMIR.
Bevara Locked UX, tre silos, WORM, prompts endast sharedRules.ts. Ingen force-push.
Jämför mot hela projektets kontext. Arbeta autonomt tills slutrapport eller hard stop.
```
