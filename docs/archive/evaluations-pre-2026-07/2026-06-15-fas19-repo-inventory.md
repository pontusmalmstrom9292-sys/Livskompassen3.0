# Fas 19 — Repo-inventering (SYSTEMKONTROLL E)

**Datum:** 2026-06-15 · **Metod:** Kod + docs tier-read · **Ingen filflytt i denna rapport**

---

## Tier-1 kanon (MÅSTE vara aktuell)

| Fil | Drift | Åtgärd Fas 19.1 |
|-----|-------|-----------------|
| `SENASTE-SAMMANFATTNING.md` | 2026-06-11 | **Uppdatera** |
| `SYSTEM_PLAN_v2.md` | Saknar Fas 13–18 detalj | **Uppdatera** Fas 19 |
| `MODUL-FUNKTIONS-REGISTER.md` | Delvis | Granska efter 19.2 |
| `GCP-INVENTORY-LATEST.md` | 2026-06-11 | Veckovis molncheck |
| `SMOKE_RESULTS.md` | 2026-06-15 | OK |

---

## Skyddad lista (FÅR EJ arkiveras/raderas)

- `.cursor/rules/*.mdc` refererade specs
- `locked-ux-features.md` §1–17
- `MABRA-3.0-MASTER-SPEC.md`, `MABRA-PARALLEL-MASTER.md`, `mabra-3.0-*` evals
- `INNEHALL-REGISTER.md`, content banks
- Legacy redirects `/valv`, `/dagbok` (LEG-VAULT)
- `/dev/obsidian-forge` + `smoke:obsidian-forge`
- `docs/design/themes/DESIGN-PACK-*`, `ICON-STYLE-GUIDE.md`
- `docs/gemini-handoff/` (arkiv **senare**, ej radera)

---

## Arkiv-kandidater (flytt → `docs/archive/2026-06/` efter PMIR)

| Mapp/fil | Motivering |
|----------|------------|
| `docs/evaluations/2026-05-*` utan kanon-pekare | Historik |
| Duplicerade vision-docs | Redan delvis i archive patch |
| `exports/gemini-handoff/repomix/` (stora packs) | Redan i `.gitignore` delvis |

---

## Dubbelbygge-risk

| Signal | Mitigation |
|--------|------------|
| GAP G1–G16 done men gamla evals säger open | Läs register före `kör GAP` |
| MåBra 6-kort vs 8 pelare SPEC | M3.0-B i 19.2 |
| `system-plan.md` vs `SYSTEM_PLAN_v2.md` | v2 = aktiv Fas 9+ |

---

## Repo-skräp (säker B6)

- `.npm-cache-fas13/` → `.gitignore`
- `node_modules.broken-*` → `.gitignore`
