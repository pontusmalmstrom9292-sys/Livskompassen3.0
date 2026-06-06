# Cursor-native rollout — autorun (2026-06-06)

**Syfte:** Kör Block A+B-smoke utan manuell app-test så långt det går.  
**Kanon checklista:** [`2026-06-06-manuell-smoke-checklist.md`](./2026-06-06-manuell-smoke-checklist.md)

---

## Ett kommando

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run rollout:night
```

Snabb smoke utan build:

```bash
npm run smoke:rollout
```

**Output:**

| Fil | Innehåll |
|-----|----------|
| `.orkester/rollout-state.json` | Fas-status |
| `.orkester/runs/rollout-<timestamp>.json` | Full logg |
| `docs/evaluations/YYYY-MM-DD-rollout-natt.md` | Morgonrapport |

---

## Checklista-mapping

| Manuell punkt | Autorun |
|---------------|---------|
| Hem / CaptureSuper | `smoke:locked-ux` |
| Kompass inkast | `smoke:inkast` (Fas B, kräver `.env`) |
| Liv 6 kort | `smoke:design-modules` + `smoke:arbetsliv` |
| Familjen/drogfrihet | `smoke:design-modules` |
| Planering inkorg-länk | rollout static guards |
| Valv Samla canonical kö | `smoke:locked-ux` |
| SpeglarSuperModule | `smoke:design-modules` + `smoke:speglar` |
| #3 WORM | `smoke:vault-worm` (Fas B) |
| #4 optimistic | static guard + `smoke:children` (Fas B) |
| #2d bilaga | **MANUELL** — filväljare + Storage |

Utan `.env`: Fas A PASS, nätverksfas `SKIP_NO_ENV` (exit 0).

---

## Ingår i orkester:night

`npm run orkester:night` kör nu även `smoke:rollout` som **optional** fas efter UX — failar inte hårt utan `.env`, men loggar SKIP i rapporten.

---

## Cursor Agent-prompt

```
Kör Cursor-native rollout autorun. npm run rollout:night först.
Om PASS och SpeglarSuperModule fortfarande uncommitted: commit + push.
Fråga om deploy hosting. Rapportera endast kvarvarande manuella punkter (#2d bilaga, ev. visuell Speglar-knapp).
Jämför mot hela projektets kontext. Arbeta autonomt tills rollout PASS eller tydlig blocker.
```

---

## Kvar för dig (~5 min)

Efter grön `rollout:night`:

1. **#2d** — Dagbok → Reflektera → bilaga &lt;5 MB → `journal_memories/`
2. **Valfritt visuellt** — Hem: en Skriv-yta; Speglar: en Fortsätt-knapp i ACT
