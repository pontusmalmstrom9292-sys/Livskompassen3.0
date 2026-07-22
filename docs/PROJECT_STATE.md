# Project State — Livskompassen v2

**Version:** 1.4 · **Last updated:** 2026-07-22  
**Rule:** Single source of truth for **system phase** and **active program**. AI assistants must read this before coding.

---

## Phase hierarchy (read this first)

Two levels — do not confuse them:

| Level | Source | Current value | Meaning |
|-------|--------|---------------|---------|
| **System phase** | This file + `.context/system-plan.md` | **Fas 24** AKTIV | Product-wide delivery gate (PO syntes, smoke, G85) |
| **Active program** | `docs/ROADMAP.md` | **Premium UI Polish** Phase 10 | Legacy CSS sunset (våg 99–111 done; stubs borttagna; `executive-chrome.css` kvar) |

**Conflict rule:** System phase (Fas N) wins over program phase. Program work must not violate Fas scope or PMIR gates.

**Single next step (Fas 24 wins):** **P0 G85 7-day daily driver — STARTED 2026-07-18** (day 1). Install/verify Valv on phone if not already (Android Studio Run). Phase 10 visual sign-off waits (program-only).

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
| P0 | Smoke grön + Android G85 daily driver (7 dagar) | Smoke: `smoke:predeploy:live` + `smoke:super-yolo` **PASS** 2026-07-11. G85 7d: **STARTED 2026-07-18** (day 1). Spot-checks: WH1/WH2/W1 2026-07-14; App Check Valv-kickout fix committed 2026-07-18; debug APK assembled + `cap sync` PASS. **USER:** Android Studio Run + Valv bakgrund <3s on device. |
| PV1a–23E | Se system-plan Fas 24 tabell | **done** 2026-06-25 |

**Next within Fas 24:** Complete days 1–7 of G85 daily driver (log issues only) — checklist [`G85-DAILY-DRIVER-CHECKLIST.md`](./G85-DAILY-DRIVER-CHECKLIST.md). Improvement waves v49–v54 **kod-GO** 2026-07-18 (`waves:autorun` / [`IMPROVEMENT-WAVES-AUTORUN.md`](./IMPROVEMENT-WAVES-AUTORUN.md)); deploy SKIP tills OK deploy. Defer 19.3/19.5/19.6 per syntes. **PMIR parked:** Genkit V1, Familje-PIN, G18, `/gora`, Gmail/Calendar, Life OS Fas D — no build without Pontus OK.

---

## Active implementation program

| Program | Program phase | Status | Docs |
|---------|---------------|--------|------|
| **Premium UI Polish** | Phase 10 + **UI Polish V4 ×10** | In Progress | [`ROADMAP.md`](./ROADMAP.md), [`TODO.md`](./TODO.md), [`DASHBOARD.md`](./DASHBOARD.md) |

Phase 0–9 baseline och migration **done**. Phase 10: `index.css` import-only; våg 111 legacy stubs **borttagna** (2026-07-11); `executive-chrome.css` kvar (dock/hem locked).

**Active polish program:** **UI Polish V4 ×10** — **kod Done** 2026-07-22 (I1–I10 × W0–W11) + **FULL RE-RUN** + **PASS 3 ADD-only** samma dag. Unlock `docs/evaluations/2026-07-22-unlock-MOD-UI-POLISH-V4-X10.md`. Parallel med Fas 24 P0 G85.

**Next within program:** Pontus G85 visual sign-off (V4 + v3); Completion residual; Playwright stretch. Daily driver fortsätter.

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



## Minne Sacred (Evigt Minne)

**Status:** aktiv programvåg **v55–v62** (supersäker YOLO).  
**Stack:** Firestore Native `findNearest` + Gemini embeddings 768 + lexical hybrid — **ingen Vertex**.  
**Tryck Build:** `npm run minne:yolo:build` (auto till v60).  
**Fraser:** `OK rules` → v61 Admin-only create · `OK deploy` → v62 functions.  
**Konstitution:** [`.context/minne-sacred-features.md`](../.context/minne-sacred-features.md)  
**Cost:** `aiplatform` blocked forever · runbook `docs/runbooks/VECTOR-SEARCH-DECOMMISSION.md`.

## Last verified

| Check | Result | Date / ref |
|-------|--------|------------|
| MOD-WIDGET deploy | hosting + functions **PASS** | 2026-07-14 · f937d0672 |
| `smoke:predeploy:build` | **PASS** | 2026-07-14 |
| Android App Check harden | **PASS** | 2026-07-15 — [`grok45-android-appcheck-yolo.md`](./evaluations/2026-07-15-grok45-android-appcheck-yolo.md) |
| G85 App Check live-harden | **PASS** | 2026-07-17 — [`g85-appcheck-yolo.md`](./evaluations/2026-07-17-g85-appcheck-yolo.md) |
| YOLO v48 G85-LIVE-VERIFY | **GO** (deploy SKIP) | 2026-07-17 — [`yolo-v48-g85-live-verify.md`](./evaluations/2026-07-17-yolo-v48-g85-live-verify.md) |
| Full verifiering Fas A–F | **GO** | 2026-07-11 — [`full-verifiering.md`](./evaluations/2026-07-10-full-verifiering.md) |
| `smoke:predeploy:live` + `smoke:super-yolo` | **PASS** | 2026-07-11 |
| `gcp:audit-apis` | **PASS** | 2026-07-11 |
| Fas 24 build sequence through 23E | **done** | 2026-06-25 |
| AI Governance system | v1.4 (Fas 24 P0 G85 started) | 2026-07-18 |
| G85 7d started | **day 1** · App Check Valv fix + debug APK ready | 2026-07-18 |
| Planering/Valv premium polish batch | **PASS** | 2026-07-20 — inkorg/connect polish, Valv pending/log focus states, reduced-transparency fallback, Valv PDF aria-label |
| Valv a11y sweep (contrast/keyboard) | **PASS** | 2026-07-20 — Escape i zonväljare, mönster + Drive aria-label, gold-on-navy contrast pass |
| MåBra UI polish (vit-hub) | **PASS** | 2026-07-20 — chip/tile focus-visible, touch-target, contrast + reduced-transparency fallback |
| YOLO app-wide UI polish (Wave 1) | **PASS** | 2026-07-20 — DS small-button touch-target, badge contrast, input/chip focus-visible, reduced-transparency for input-glass/alert-banner |
| YOLO app-wide UI polish (Wave 2) | **PASS** | 2026-07-20 — DS Button/ButtonLink icon aria-label fallback via title |
| YOLO app-wide UI polish (Wave 3) | **PASS** | 2026-07-20 — drawer/dock focus-visible + touch-targets + label contrast (nav-drawer/floating-dock/design-pack profile) |
| YOLO app-wide UI polish (Wave 4) | **PASS** | 2026-07-20 — nav-drawer sections + Planering routines + MåBra collapsible + Reflektion panel contrast/focus/touch-target pass |
| YOLO app-wide UI polish (Wave 5) | **PASS** | 2026-07-20 — dock hub/compass + Dagbok mode/handoff + adaptive-card focus/touch-target/contrast pass |
| YOLO app-wide UI polish (Wave 6) | **PASS** | 2026-07-20 — executive home/header + Obsidian shell/glass focus-visible, touch-target, contrast pass |
| YOLO app-wide UI polish (Wave 7) | **PASS** | 2026-07-21 — dock center-label hardening + selector-säker core-chrome polish pass |
| YOLO app-wide UI polish (Wave 8) | **PASS** | 2026-07-21 — Home Layout A keyboard focus-visible polish (snabbval/tile/step/link/strip) i DS shell-lager |
| YOLO app-wide UI polish (Wave 9) | **PASS** | 2026-07-21 — Home Layout A hero-inset `:focus-visible` ring/contrast polish i DS shell-lager |
| YOLO app-wide UI polish (Wave 10) | **PASS** | 2026-07-21 — Home Layout A `:focus-within` polish för hero-card/tile i DS shell-lager |
| YOLO app-wide UI polish (Wave 11) | **PASS** | 2026-07-21 — Home Layout A reduced-motion polish (`prefers-reduced-motion` transition-off för snabbval/tile/step/link) i DS shell-lager |
| YOLO app-wide UI polish (Wave 12) | **PASS** | 2026-07-21 — Home Layout A transition-token polish (snabbval/tile/link) i DS shell-lager |
| YOLO app-wide UI polish (Wave 13) | **PASS** | 2026-07-21 — Home Layout A strip transition-token + reduced-motion polish i DS shell-lager |
| YOLO app-wide UI polish (Wave 14) | **PASS** | 2026-07-21 — Home Layout A step-button transition-token polish i DS shell-lager |
| `smoke:governance` + `smoke:module-lock` | **PASS** | 2026-07-20 — module-lock green (25/25 locked), governance smoke PASS |

### MOD-WIDGET Standalone v1 (2026-07-14)
- Fristående widget-skin + WH7 Åtgärder + AppUnlock bypass på `/widget/*`
- Preview: `/dev/design-freeport` → Widget Standalone
- Smoke: `smoke:widgets`, `smoke:predeploy:build` PASS · MOD-WIDGET **locked**

### SDK build marathon (v34–v48)

Deploy SKIP throughout unless Pontus OK. Latest wave: **v48 G85-LIVE-VERIFY GO** (2026-07-17).

| Wave | Id | Verdict | Date |
|------|-----|---------|------|
| v40 | INTEGRATION | **GO** | 2026-07-14 — [`integration-v40.md`](./evaluations/2026-07-14-integration-v40.md) |
| v41 | GOVERNANCE | **GO** | 2026-07-14 — [`governance-v41.md`](./evaluations/2026-07-14-governance-v41.md) |
| v42 | SLUTGATE | **GO** | 2026-07-14 — [`vakt-v42.md`](./evaluations/2026-07-14-vakt-v42.md) |
| v43 | KOPPLINGAR-C | **GO** | 2026-07-14 — [`vakt-v43.md`](./evaluations/2026-07-14-vakt-v43.md) |
| v44 | PROJEKT-P1 | **GO** | 2026-07-14 — [`vakt-v44.md`](./evaluations/2026-07-14-vakt-v44.md) |
| v45 | EVOLUTION-LEDGER | **GO** | 2026-07-14 — [`vakt-v45.md`](./evaluations/2026-07-14-vakt-v45.md) |
| v46 | ARKIV-BATCH | **GO** | 2026-07-14 — [`vakt-v46.md`](./evaluations/2026-07-14-vakt-v46.md) |
| v47 | MINNE-DEPLOY | **GO** | 2026-07-14 — [`vakt-v47.md`](./evaluations/2026-07-14-vakt-v47.md) |
| v48 | G85-LIVE-VERIFY | **GO** | 2026-07-17 — [`yolo-v48-g85-live-verify.md`](./evaluations/2026-07-17-yolo-v48-g85-live-verify.md) |
