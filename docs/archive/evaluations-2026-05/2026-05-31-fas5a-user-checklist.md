# Fas 5A — Användarchecklista (prod)

**URL:** https://gen-lang-client-0481875058.web.app  
**Före test:** Cmd+Shift+R (hard refresh)

---

## A — Vävaren HITL

| Steg | Förväntat | Resultat (fyll i) |
|------|-----------|-------------------|
| 1 | Dagbok → spara post som triggar vävning | `WeaverApprovalPanel` visas |
| 2 | **Godkänn** | Pending borta; metadata i Valv (ej direkt `reality_vault` utan HITL) |
| 3 | Ny post → **Avvisa** | Pending borta; inget nytt bevis |
| 4 | Drawer Valv-rad | Badge om pending > 0 |

**Rapportera:** `Fas 5A: Vävaren PASS` eller `FAIL` + kort fel.

---

## B — Manuell smoke

| # | Test | Collection / path | Resultat |
|---|------|-------------------|----------|
| **#3** | Shield 3s → PIN → logga enkel post | `reality_vault` | |
| **#4** | `/familjen` eller `/barnporten` → spara logg | `children_logs` | |
| **#2d** | Dagbok Reflektera → bilaga &lt;5 MB | `journal_memories` | |
| **Ny** | `/projekt/:id` → ladda bild | `project_media/` | |

**Rapportera:** vilka # som är PASS — agent uppdaterar [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md).

---

## C — Agent redan verifierat (2026-05-31)

- `npm run build` · `smoke:locked-ux` · `smoke:orkester` **PASS**
- Deploy: rules, indexes, weaver callables, hosting
