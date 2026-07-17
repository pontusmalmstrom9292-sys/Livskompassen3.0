# Project State — Livskompassen v2

**Version:** 1.2 · **Last updated:** 2026-07-17  
**Rule:** Single source of truth for **system phase** and **active program**. AI assistants must read this before coding.

---

## Phase hierarchy (read this first)

Two levels — do not confuse them:

| Level | Source | Current value | Meaning |
|-------|--------|---------------|---------|
| **System phase** | This file + `.context/system-plan.md` | **Fas 24** AKTIV | Product-wide delivery gate (PO syntes, smoke, G85) |
| **Active program** | `docs/ROADMAP.md` | **Premium UI Polish** Phase 10 | Legacy CSS sunset (våg 99–110 done; stubs kvar) |

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
| P0 | Smoke grön + Android G85 daily driver (7 dagar) | `smoke:predeploy:live` + `smoke:super-yolo` PASS 2026-07-11 · G85 7d kvar |
| PV1a–23E | Se system-plan Fas 24 tabell | **done** 2026-06-25 |

**Next within Fas 24:** P0 G85 7-day daily driver; defer 19.3/19.5/19.6 per syntes.

---

## Active implementation program

| Program | Program phase | Status | Docs |
|---------|---------------|--------|------|
| **Premium UI Polish** | Phase 10 — Legacy CSS sunset | In Progress | [`ROADMAP.md`](./ROADMAP.md), [`TODO.md`](./TODO.md), [`DASHBOARD.md`](./DASHBOARD.md) |

Phase 0–9 baseline och migration **done**. Phase 10: index.css import-only; våg 111 legacy stubs borttagna (2026-07-11); `executive-chrome.css` kvar (dock/hem locked).

**Next within program:** Pontus visual sign-off; completion-checklist (TODO §Completion); Playwright screenshot-baseline (stretch).

---

## Smoke matrix (run what you touch)

| Area | Minimum smoke |
|------|---------------|
| Any merge | `npm run smoke:predeploy:build` |
| Prod gate (lokal) | `npm run smoke:predeploy:live` (kräver `.env`) |
| Valv | `smoke:valv-security`, `smoke:locked-ux` |
| Familjen | `smoke:locked-ux`, `smoke:children` |
| Planering | `smoke:planering-superhub`, `smoke:locked-ux` |
| MåBra | `smoke:mabra` |
| UI | `smoke:design-modules`, `smoke:locked-ux` |
| Inkast/G10 | `smoke:inbox` |
| Prompts | `smoke:prompts` |
| Kostnad (live) | `npm run gcp:audit-apis` |
| Governance docs | `npm run smoke:governance` |

---

## PMIR hard stops

`firestore.rules` · `storage.rules` · locked UX · `sharedRules.ts` · mass delete · prod deploy

---

## Last verified

| **MOD-WIDGET deploy** | hosting + functions | **PASS** 2026-07-14 · f937d0672 |
| **smoke:predeploy:build** | pre-deploy | **PASS** 2026-07-14 |
| **YOLO v40 INTEGRATION** | innehåll + seed dry-run | **GO** 2026-07-14 — [`integration-v40.md`](./evaluations/2026-07-14-integration-v40.md) |
| **Android App Check harden** | Grok 4.5 YOLO | **PASS** 2026-07-15 — [`grok45-android-appcheck-yolo.md`](./evaluations/2026-07-15-grok45-android-appcheck-yolo.md) |
| **G85 App Check live-harden** | Grok 4.5 YOLO | **PASS** 2026-07-17 — [`g85-appcheck-yolo.md`](./evaluations/2026-07-17-g85-appcheck-yolo.md) |
| **YOLO v41 GOVERNANCE** | docs + module-lock sync | **PASS** 2026-07-14 — [`governance-v41.md`](./evaluations/2026-07-14-governance-v41.md) |


| Check | Date |
|-------|------|
| Full verifiering Fas A–F | 2026-07-11 — [`docs/evaluations/2026-07-10-full-verifiering.md`](./evaluations/2026-07-10-full-verifiering.md) |
| `smoke:predeploy:live` + `smoke:super-yolo` | 2026-07-11 |
| `gcp:audit-apis` | 2026-07-11 PASS |
| Fas 24 build sequence through 23E | 2026-06-25 |
| AI Governance system v1.2 (PROJECT_STATE sync) | 2026-07-11 |
| `smoke:governance` + `smoke:module-lock` | 2026-07-14 — 22/22 locked, 24 entryFiles |
| Build marathon v34–v41 | v40 INTEGRATION GO → v41 GOVERNANCE aktiv |

### MOD-WIDGET Standalone v1 (2026-07-14)
- Fristående widget-skin + WH7 Åtgärder + AppUnlock bypass på `/widget/*`
- Preview: `/dev/design-freeport` → Widget Standalone
- Smoke: `smoke:widgets`, `smoke:predeploy:build` PASS · MOD-WIDGET **locked**

### SDK build marathon (v34–v47)
- **v40 INTEGRATION:** `smoke:innehall`, `smoke:content-waves` PASS · seed `--dry-run` (47 poster) · preflight PARTIAL (icke-blockerande)
- **v41 GOVERNANCE:** PROJECT_STATE, TODO, LOCK-MANIFEST synkade · register ↔ manifest (22 moduler, 24 entryFiles)
