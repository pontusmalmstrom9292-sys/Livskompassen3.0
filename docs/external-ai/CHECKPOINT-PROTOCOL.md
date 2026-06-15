# CHECKPOINT-protokoll (obligatoriskt)

Efter **varje** ChatBox-chatt — kör i **Cursor** (minimal kredit).

## Påminnelse

> CHECKPOINT [N] — lås, städa, snapshot om LOCK, uppdatera plan, smoke.

När modul = LOCK:

> Modulen [namn] är låst. Kör `./scripts/snapshot_locked_module.sh [modul]` — lokal kopia utanför projektet.

## 12 steg (i ordning)

| # | Steg | Var | Output |
|---|------|-----|--------|
| 1 | Spara leverans | `docs/external-ai/leveranser/YYYY-MM-DD-fas-NN.md` | Rå ChatBox-output |
| 2 | Granska | Cursor | PASS / REVISE / REJECT |
| 3 | Applicera | Cursor | Godkända diffar |
| 4 | Smoke | Terminal | Se tabell nedan |
| 5 | Lås färdigt | `LIFE-OS-CORE-LOCKED.md` eller locked-ux | LOCK om PASS |
| 6 | BUILD-STATE | `LIFE-OS-BUILD-STATE.md` | LOCK/OPEN/WIP |
| 7 | Regler | `.cursor/rules/*.mdc` | Endast om ny invariant + PMIR |
| 8 | Repomix | `npm run gemini:pack:refresh && npm run chatbot:pack:security` | Färsk kontext |
| 9 | Repo-hygien | `HYGIENE-LOG.md` | KEEP/ARCHIVE/DELETE |
| 10 | Snapshot | `~/Livskompassen-snapshots/` | Om LOCK |
| 11 | Planrevision | `.cursor/plans/` + `CHECKPOINT-LOG.md` | Nästa fas |
| 12 | Nästa steg | En rad till Pontus | En chatt i taget |

## Smoke per CHECKPOINT

| CP | Efter | Kommandon |
|----|-------|-----------|
| CP-1 | Security audit | `npm run smoke:valv-security` · `npm run smoke:locked-ux` |
| CP-2 | Upload SPEC | Manuellt godkännande — ingen kod |
| CP-3 | Backend upload | `cd functions && npm run build` · `npm run smoke:inkast` · `npm run smoke:inbox` |
| CP-4 | Frontend upload | `npm run build` · `npm run smoke:locked-ux` |
| CP-5 | Synapse lock | `npm run smoke:orkester` |
| CP-6 | Deploy prep | `npm run smoke:valv-security` + deploy-checklista |
| CP-7 | Final | `npm run smoke:orkester` · `npm run smoke:locked-ux` |

## GitHub (efter snapshot)

Cursor guidar steg för steg enligt `docs/GIT-LATHUND.md` — Pontus godkänner före push.
