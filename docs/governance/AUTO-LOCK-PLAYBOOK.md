# AUTO-LOCK-PLAYBOOK — Efter varje feature-våg

**Version:** 1.0 · **Senast:** 2026-07-13 (YOLO v8 P35)  
**Regel:** [`.cursor/rules/auto-lock-on-complete.mdc`](../.cursor/rules/auto-lock-on-complete.mdc)  
**Register:** [`.context/module-lock-register.json`](../.context/module-lock-register.json)

---

## Syfte

Säkerställa att färdiga moduler **låses automatiskt** efter smoke PASS — utan att ta bort funktion eller refaktorera "för snyggt".

---

## Steg-för-steg (agent)

| # | Åtgärd | Kommando / fil |
|---|--------|----------------|
| 1 | Hitta berörd modul | `.context/module-lock-register.json` → matcha `globs` mot diff |
| 2 | Kontrollera status | `locked` → STOPP (unlock-doc). `developing` → fortsätt |
| 3 | Kör modul-smoke | t.ex. `npm run smoke:widgets` |
| 4 | Lås modul | `node scripts/lock_module.mjs MOD-XXX --smoke smoke:widgets` |
| 5 | Verifiera header | `@locked MOD-XXX` i alla `entryFiles` |
| 6 | Trippel-gate | `smoke:locked-ux` + `smoke:design-modules` + `smoke:governance` |
| 7 | Logga | Rad i `docs/evaluations/YYYY-MM-DD-cursor-yolo-v8-log.md` |

---

## Exempel — MOD-WIDGET (developing → locked)

```bash
npm run smoke:widgets
node scripts/lock_module.mjs MOD-WIDGET --smoke smoke:widgets
npm run smoke:locked-ux && npm run smoke:design-modules && npm run smoke:governance
```

Eval-rad:
`| P36 MOD-WIDGET lock | 2026-07-13 | PASS | auto-lock-inventory | smoke:widgets + lock_module |`

---

## Unlock (om ändring behövs senare)

1. `docs/evaluations/YYYY-MM-DD-unlock-MOD-XXX.md` med `approved: yes`
2. Pontus OK
3. Sätt `status: developing` i register
4. Gör minimal diff
5. Re-lock enligt tabellen ovan

---

## PMIR — auto-lock rör INTE

- `firestore.rules` · `storage.rules` · `sharedRules.ts`
- `AppRoutes.tsx` / `NavigationDrawer.tsx` struktur
- Sacred Features · Barnporten kanon-UI
- Live ingest (`--apply`) · deploy

---

## Relaterat

- [LOCK-MANIFEST.md](./LOCK-MANIFEST.md) § Auto-lock
- [MODULE-LOCK-REGISTER.md](../.context/MODULE-LOCK-REGISTER.md)
- YOLO v8 logg: `docs/evaluations/YYYY-MM-DD-cursor-yolo-v8-log.md`
