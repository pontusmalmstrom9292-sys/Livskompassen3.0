# Drawer IA — eval 2.1 (FOEBATTRINGSPLAN) — 2026-06-15

**Fråga:** Accordion vs MENU-DRAWER-KANON 4 rader?

---

## Nuvarande runtime

| Element | Implementation |
|---------|--------------|
| Sektioner | Vardag (public) + Valv (endast `vaultOpen`) |
| Källa | `navTruth.ts` → `DRAWER_VARDAG_ITEMS` / `DRAWER_VALV_ITEMS` |
| Aktiv rad | Guld only — [`COLOR-POLICY.md`](../design/COLOR-POLICY.md) |
| Accordion | Expanderbara hub-rader med sub-links |

---

## Alternativ

| Alt | Fördel | Nackdel |
|-----|--------|---------|
| **A — Behåll accordion** | Redan shipped, locked-ux smoke PASS, mindre regressionsrisk | Doc säger ibland "4 rader" — semantisk drift |
| **B — Flat 4 rader** | Strengare kanon | Stor refactor, risk för Valv plausible deniability |

---

## Beslut (Pontus via agent 2026-06-15)

**Alt A — Behåll accordion.** Uppdatera inte drawer-struktur i Fas 14C.

**Nästa steg (senare):** Synka eval/spec som nämner "4 rader" till accordion-beteende — doc-only, ingen kod.

---

## Smoke

`smoke:locked-ux` **PASS** · `smoke:design-modules` **PASS**
