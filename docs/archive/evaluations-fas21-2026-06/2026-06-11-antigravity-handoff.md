# Antigravity-handoff — Livskompassen v2 (2026-06-11)

**Prod:** https://gen-lang-client-0481875058.web.app  
**Repo:** `/Users/Livskompassen/StudioProjects/Livskompassen3.0` · `main`

---

## Checklista

| # | Krav | Status |
|---|------|--------|
| 1 | Ren `main`, WIP committat | **PASS** efter MT-2 commit |
| 2 | Multitask-rapporter | [`multitask-mt1.md`](./2026-06-11-multitask-mt1.md) · [`multitask-mt2.md`](./2026-06-11-multitask-mt2.md) |
| 3 | `SMOKE_RESULTS.md` grön | **PASS** |
| 4 | `npm run smoke:all` | **PASS** 2026-06-11 |
| 5 | `npm run google-ai-pro:pack` | **PASS** → `exports/google-ai-pro/` |
| 6 | `smoke:locked-ux` | **PASS** (ingår i smoke:all) |
| 7 | MT-3 dokumenterad | [`mt3-blockers.md`](./2026-06-11-mt3-blockers.md) |
| 8 | Prod synkad | **PASS** · hosting + `firestore:rules` 2026-06-11 |

---

## Lämpligt i Antigravity

- Drawer IA (C1) — visuell jämförelse accordion vs 4 rader
- MaterialPack-editor UI (B1) — mockup före PMIR
- Hemkompass / Kompass K1–K3 redesign polish
- Tema-lab varianter

## Stanna i Cursor

- `firestore.rules`, WORM, silo-callables
- `sharedRules.ts`, synapser, deploy
- Barnfokus / Valv locked UX

---

## Startprompt Antigravity

```
Läs exports/google-ai-pro/ och docs/evaluations/2026-06-11-antigravity-handoff.md.
Fokus: Obsidian Calm 2.0 — drawer IA (C1) ELLER MaterialPack-editor mockup (B1).
Ingen ändring av firestore.rules eller RAG-silor. Leverera mockup/beslut, inte prod-wire utan PMIR.
```
