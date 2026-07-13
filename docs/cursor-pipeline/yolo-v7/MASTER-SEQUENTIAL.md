# Cursor YOLO v7 — MASTER sekventiell (P24→P33)

**Version:** 7 · **Start:** 2026-07-13  
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inget refaktoreras "för snyggt".

## Kommandon

```bash
npm run cursor:yolo:v7 -- status
npm run cursor:yolo:v7 -- next
npm run cursor:yolo:v7 -- done
```

## Trippel-gate (efter varje fas med kod)

```bash
npm run smoke:locked-ux && npm run smoke:design-modules && npm run smoke:governance
```

## Faser

| ID | Fas | Agent | Kod? |
|----|-----|-------|------|
| p24-baseline | Read-only baseline | orkester | Nej |
| p25-module-lock | Module-lock inventering | specialist-verifier | Additiv @locked only |
| p26-ux-guardian | Locked UX snapshot | specialist-ux-guardian | Nej om PASS |
| p27-drift | Feljakt | specialist-verifier | Max 20 rader/fix |
| p28-design-debt | Design-debt guard | specialist-ux-guardian | Minimal |
| p29-lock-manifest | LOCK-MANIFEST | yolo-vakt | Docs only |
| p30-ci-gate | CI/pre-push | yolo-vakt | Docs only |
| p31-integration | Integration sync | integration-conductor | Manifest timestamp |
| p32-kunskap-dryrun | Kunskap dry-run | specialist-kunskap-seed | Aldrig --apply |
| p33-yolo-vakt | Slutgate GO/NO-GO | yolo-vakt | Read-only |

## PMIR-STOPP (vänta Pontus OK)

- `firestore.rules`, `storage.rules`, `functions/src/sharedRules.ts`
- `AppRoutes.tsx`, `NavigationDrawer.tsx` struktur
- Barnporten kanon-UI, Sacred Features borttagning
- Mass-radering, live Kunskap-ingest, deploy rules/functions
- Hosting deploy (endast efter separat "OK deploy")

## Leveranslogg

`docs/evaluations/YYYY-MM-DD-cursor-yolo-v7-log.md`

## Handoff efter P24

Nästa chatt: **P25 — Module-lock inventering** (`specialist-verifier`).
