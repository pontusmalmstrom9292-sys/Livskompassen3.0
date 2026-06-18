# Fas 22 — Leverans

**Datum:** 2026-06-18 · **Status:** DONE (deploy 2026-06-18)

## Levererat

- 7 zon-memos + masterplan v2 + FAS22-SPRINT-AUTORUN + fas22_autorun_init + guard
- **22.1** Sprint-infra + orkester-autorun pekare
- **22.2** M3.0-C Phase 2 PMIR (`mabra-3.0-c-phase2-pmir.md`)
- **22.3** `mabra_nutrition_log` rules + service + MabraNutritionPanel Firestore wire
- **22.4** Hamn brusfilter-wizard Alt A (`useHamnBiffWizard`, triage → confirm → reply)
- **22.5** CONTENT-WAVES våg 30 ingest-rad + smoke curriculum FACT ids
- **22.6** biffRewriteDraft wire + smoke asserts
- **22.7** coachConversation trim i mabraCoach
- **22.8** Hem→Hjärtat CTA polish
- **22.9** FAS22-ANDROID-GATES.md
- **22.10** App Check staging-checklist i runbook

## Defer

FP-TI sandbox→prod · Hem→Hjärtat full merge · BP-PUSH · Gmail · Genkit V1

## Smoke (2026-06-18)

- `build`, `functions build` — PASS
- `smoke:hamn`, `smoke:mabra`, `smoke:content-waves`, `smoke:inkast-vardag`, `smoke:compass` — PASS

## Named deploy (efter Pontus OK)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0/functions && npm run build
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0 && npm run build
firebase deploy --only firestore:rules,functions:biffRewriteDraft,functions:mabraCoach,hosting
```

- `seed:kunskap-facts` för våg 30 ingest verify (valfritt efter deploy)
