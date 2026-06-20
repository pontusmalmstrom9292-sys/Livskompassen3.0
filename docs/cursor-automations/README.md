# Cursor Automations — Livskompassen

Skapa i [Cursor Automations dashboard](https://cursor.com/automations). **Rådgivande only** — merge kräver grön CI + YOLO GO.

## A: pr-yolo-audit

| Fält | Värde |
|------|-------|
| Trigger | GitHub PR opened/updated → `main` |
| Tools | Read repo, PR comment |
| Model | inherit / composer |
| Readonly | Ja |

**Prompt:** Kör yolo-vakt checklista mot PR-diff. Kommentera GO/NO-GO på PR. Kör INTE merge eller push till main. Sacred paths → CRITICAL + PMIR.

## B: nattpass-orkester

| Fält | Värde |
|------|-------|
| Trigger | Cron `0 3 * * 1` (måndag 03:00) |
| Tools | Read repo, shell (readonly smoke) |
| Readonly | Ja |

**Prompt:** Kör `npm run orkester:night`. Skriv rapport till `docs/evaluations/YYYY-MM-DD-orkester-natt.md` vid FAIL. Ingen auto-deploy.

Prefill: se `prefill-pr-yolo-audit.json` och `prefill-nattpass-orkester.json`.
