# Cursor YOLO v8 — MASTER sekventiell (P34→P43)

**Version:** 8 · **Start:** 2026-07-13  
**Mandat:** ENDAST förbättra, stärka och verifiera — auto-lock efter feature-våg.

## Kommandon

```bash
npm run cursor:yolo:v8 -- status
npm run cursor:yolo:v8 -- next
npm run cursor:yolo:v8 -- done
```

## Auto-lock (kärna v8)

Efter varje feature-våg: `@locked` → smoke → `lock_module.mjs` → eval-rad.  
Se [AUTO-LOCK-PLAYBOOK.md](../../governance/AUTO-LOCK-PLAYBOOK.md).

## Trippel-gate (efter kod)

```bash
npm run smoke:locked-ux && npm run smoke:design-modules && npm run smoke:governance
```

## Faser

| ID | Fas | Agent | Kod? |
|----|-----|-------|------|
| p34-baseline | Read-only baseline | orkester | Nej |
| p35-auto-lock | Auto-lock-regel | specialist-verifier | Docs + MDC |
| p36-lock-inventory | Lås MOD-WIDGET | specialist-verifier | Additiv @locked |
| p37-security | Security audit | specialist-security-auditor | Read-only |
| p38-ux-guardian | Locked UX snapshot | specialist-ux-guardian | Nej om PASS |
| p39-drift | Drift & smoke | specialist-verifier | Max 20 rader |
| p40-design-debt | Design-debt guard | specialist-ux-guardian | DASHBOARD |
| p41-fortification | Agent-fortifikation | yolo-vakt | Orchestrering |
| p42-integration | Kunskap dry-run | livskompassen-arkiv-master | Aldrig --apply |
| p43-yolo-vakt | Slutgate GO/NO-GO | yolo-vakt | Read-only |

## PMIR-STOPP

- `firestore.rules`, `storage.rules`, `sharedRules.ts`
- `AppRoutes.tsx`, `NavigationDrawer.tsx` struktur
- Barnporten kanon-UI, Sacred Features borttagning
- Mass-radering, live Kunskap-ingest, deploy rules/functions
- Hosting deploy — endast efter separat **"OK deploy"**
