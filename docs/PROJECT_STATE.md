# Project State — Livskompassen v2

**Version:** 1.1 · **Last updated:** 2026-06-28  
**Rule:** Single source of truth for **system phase** and **active program**. AI assistants must read this before coding.

---

## Phase hierarchy (read this first)

Two levels — do not confuse them:

| Level | Source | Current value | Meaning |
|-------|--------|---------------|---------|
| **System phase** | This file + `.context/system-plan.md` | **Fas 24** AKTIV | Product-wide delivery gate (PO syntes, smoke, G85) |
| **Active program** | `docs/ROADMAP.md` | **Premium UI Polish** Phase 0 | Current implementation track inside Fas 24 |

**Conflict rule:** System phase (Fas N) wins over program phase. Program work must not violate Fas scope or PMIR gates.

---

## Active system phase

| Field | Value |
|-------|-------|
| **Phase** | **Fas 24** — Produktvåg 1 (PO-syntes) |
| **Status** | AKTIV |
| **Kanon** | [`docs/evaluations/2026-06-25-app-plan-syntes.md`](./evaluations/2026-06-25-app-plan-syntes.md) |
| **Sprint** | [`docs/FAS24-SPRINT-AUTORUN.md`](./FAS24-SPRINT-AUTORUN.md) |
| **System plan** | [`.context/system-plan.md`](../.context/system-plan.md) |

**Premiss:** Fungerande mobil vardag under låg energi — säker fångst till rätt silo — före nya AI-demoer eller hubbar.

### Fas 24 deliverables (verified in system-plan)

| ID | Deliverable | Status |
|----|-------------|--------|
| P0 | Smoke grön + Android G85 daily driver (7 dagar) | smoke PASS 2026-06-25 · G85 7d kvar |
| PV1a–23E | Se system-plan Fas 24 tabell | **done** 2026-06-25 |

**Next within Fas 24:** P0 G85 7-day daily driver; defer 19.3/19.5/19.6 per syntes.

---

## Active implementation program

| Program | Program phase | Status | Docs |
|---------|---------------|--------|------|
| **Premium UI Polish** | Phase 0 — Baseline & governance | In Progress | [`ROADMAP.md`](./ROADMAP.md), [`TODO.md`](./TODO.md), [`DASHBOARD.md`](./DASHBOARD.md) |

Do not start Premium UI Phase 1 until Phase 0 baseline metrics are recorded in `DASHBOARD.md`.

---

## Smoke matrix (run what you touch)

| Area | Minimum smoke |
|------|---------------|
| Any merge | `npm run smoke:predeploy:build` |
| Valv | `smoke:valv-security`, `smoke:locked-ux` |
| Familjen | `smoke:locked-ux`, `smoke:children` |
| Planering | `smoke:planering-superhub`, `smoke:locked-ux` |
| MåBra | `smoke:mabra` |
| UI | `smoke:design-modules`, `smoke:locked-ux` |
| Prompts | `smoke:prompts` |
| Governance docs | `npm run smoke:governance` |

---

## PMIR hard stops

`firestore.rules` · `storage.rules` · locked UX · `sharedRules.ts` · mass delete · prod deploy

---

## Last verified

| Check | Date |
|-------|------|
| Fas 24 build sequence through 23E | 2026-06-25 |
| AI Governance system v1.1 (audit fixes) | 2026-06-28 |
