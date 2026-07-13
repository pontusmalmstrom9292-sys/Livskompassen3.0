# Cursor YOLO v9 — MASTER sekventiell (P44→P53)

**Version:** 9 · **Start:** 2026-07-13  
**Mandat:** ENDAST förbättra, stärka och verifiera — auto-lock hygiene efter v8.

## Kommandon

```bash
npm run cursor:yolo:v9 -- status
npm run cursor:yolo:v9 -- next
npm run cursor:yolo:v9 -- done
```

## Auto-lock (kärna v9)

Efter varje feature-våg: `@locked` → smoke → `lock_module.mjs` → eval-rad.  
Se [AUTO-LOCK-PLAYBOOK.md](../../governance/AUTO-LOCK-PLAYBOOK.md).

## Trippel-gate (efter kod)

```bash
npm run smoke:locked-ux && npm run smoke:design-modules && npm run smoke:governance
```

## Faser

| ID | Fas | Agent | Kod? |
|----|-----|-------|------|
| p44-baseline | Read-only baseline | yolo-vakt | Nej |
| p45-auto-lock-hygiene | Auto-lock hygiene | specialist-verifier | Docs/grep |
| p46-security | Security audit | specialist-security-auditor | Read-only |
| p47-ux-guardian | Locked UX snapshot | specialist-ux-guardian | Nej om PASS |
| p48-drift | Drift & smoke | specialist-verifier | Max 20 rader |
| p49-design-debt | Design-debt guard | specialist-ux-guardian | DASHBOARD |
| p50-fortification | Agent-fortifikation | yolo-vakt | Orchestrering |
| p51-integration | Kunskap dry-run | livskompassen-arkiv-master | Aldrig --apply |
| p52-yolo-vakt | Slutgate GO/NO-GO | yolo-vakt | Read-only |
| p53-deploy | (Valfritt) hosting | yolo-vakt | PMIR — Pontus OK |

## PMIR-STOPP

- `firestore.rules`, `storage.rules`, `sharedRules.ts`
- `AppRoutes.tsx`, `NavigationDrawer.tsx` struktur
- Barnporten kanon-UI, Sacred Features borttagning
- Mass-radering, live Kunskap-ingest, deploy rules/functions
- Hosting deploy — endast efter separat **"OK deploy"**
