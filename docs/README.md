# Livskompassen v2 — Dokumentation

Navigationsindex. **Kanon för systemlagar:** [`.context/`](../.context/) · **Cursor-agenter:** [`AGENTS.md`](../AGENTS.md)

**Aktuell fas (2026-06-15):** Fas 22 **levererad** (hex→tokens P0, hosting deploy). **Nästa:** evolution_ledger dual-write · USER smoke. Status: [`evaluations/SENASTE-SAMMANFATTNING.md`](evaluations/SENASTE-SAMMANFATTNING.md) · kanon: [`evaluations/2026-06-15-fas19-masterplan-v2.md`](evaluations/2026-06-15-fas19-masterplan-v2.md) · plan: [`SYSTEM_PLAN_v2.md`](SYSTEM_PLAN_v2.md)

---

## Tier 1 — Systemlagar (läs före kod)

| Fil | Innehåll |
|-----|----------|
| [`SYSTEM_PLAN_v2.md`](SYSTEM_PLAN_v2.md) | **Aktiv fas 9–20**, Fas 13–19 leverans |
| [`.context/system-plan.md`](../.context/system-plan.md) | Historik Fas 1–7, arkitekturlagar |
| [`.context/security.md`](../.context/security.md) | Layered Defense, Sacred Features, WORM, silos |
| [`.context/arkiv-minne.md`](../.context/arkiv-minne.md) | Permanent minne, tre silor, Dossier |
| [`.context/architecture.md`](../.context/architecture.md) | Multi-agent, A2A, Vertex |
| [`.context/database.md`](../.context/database.md) | Firestore, RAG, Vector Search |
| [`.context/agents.md`](../.context/agents.md) | Agentroller och routing |

---

## Tier 1b — Systemkontroll (när det känns rörigt)

| Fil | Innehåll |
|-----|----------|
| [`SYSTEMKONTROLL.md`](SYSTEMKONTROLL.md) | Färdiga Cursor-prompter, Sacred-register, var sanning bor |
| [`evaluations/SENASTE-SAMMANFATTNING.md`](evaluations/SENASTE-SAMMANFATTNING.md) | **Aktuell** status (läs denna först) |
| [`evaluations/SESSION-INDEX.md`](evaluations/SESSION-INDEX.md) | Sessionsöversikt (S1–S12, Fas 13–19) |
| [`MODUL-GAP-OVERSIKT.md`](MODUL-GAP-OVERSIKT.md) | Öppet per modul (1 sida) |
| [`MODUL-FUNKTIONS-REGISTER.md`](MODUL-FUNKTIONS-REGISTER.md) | Modul · route · callable · smoke |
| [`DOC-DRIFT-RAPPORT.md`](DOC-DRIFT-RAPPORT.md) | Doc vs kod (Del B) |
| [`evaluations/`](evaluations/) | Historiska analysrapporter (2026-05-23 m.fl.) |

---

## Tier 2 — Drift och GCP (live sanning)

| Fil | Innehåll |
|-----|----------|
| [`GCP-INVENTORY-LATEST.md`](GCP-INVENTORY-LATEST.md) | **Live** functions, indexes, secrets |
| [`GCP-KONSOLIDERING-BESLUT.md`](GCP-KONSOLIDERING-BESLUT.md) | GCP-beslut och avveckling |
| [`GCP-FAS4-RUNBOOK.md`](GCP-FAS4-RUNBOOK.md) | FAS4 steg-för-steg |
| [`DEPLOY.md`](DEPLOY.md) | Deploy hosting + functions |
| [`FIREBASE-AUTH-LATHUND.md`](FIREBASE-AUTH-LATHUND.md) | **1 sida** — Authorized domains, Google, Android-nuläge |
| [`.context/android-capacitor.md`](../.context/android-capacitor.md) | **Projektminne** — cap sync före Run, SHA-1, native Google |
| [`OFFLINE-ANDROID.md`](OFFLINE-ANDROID.md) | Firestore offline cache, nät-chip, WORM-notering |
| [`prompts/OFFLINE-ANDROID-AGENT-PROMPT.md`](prompts/OFFLINE-ANDROID-AGENT-PROMPT.md) | **Klistra in** i ny chatt för uppföljning |
| [`prompts/MABRA-DAGLIG-MIX-PROMPT.md`](prompts/MABRA-DAGLIG-MIX-PROMPT.md) | Nästa produktchatt efter Android-landning |
| [`evaluations/2026-05-27-android-landning.md`](evaluations/2026-05-27-android-landning.md) | Android landning — definition of done |
| [`FIREBASE_SYNC.md`](FIREBASE_SYNC.md) | Firebase-projekt, rules, indexes |
| [`DRIVE_AUTOMATION.md`](DRIVE_AUTOMATION.md) | Apps Script → `notifyNewFile` |
| [`SMOKE_CHECKLIST.md`](SMOKE_CHECKLIST.md) | Manuell verifiering (Sacred Features) |
| [`SMOKE_RESULTS.md`](SMOKE_RESULTS.md) | Senaste smoke-resultat |
| [`NATT-CI.md`](NATT-CI.md) | Nattlig CI (ersätter manuella overnight-körningar) |
| [`KOMPASS-MINNESKARTA.md`](KOMPASS-MINNESKARTA.md) | **Utskrift** — pyramid, moduler, git, öppet |
| [`design/DESIGN-LATHUND.md`](design/DESIGN-LATHUND.md) | **Utskrift** — teman, galleri, flik-idéer, HTML |
| [`CURSOR-MENY-LATHUND.md`](CURSOR-MENY-LATHUND.md) | **Utskrift** — kub-meny, filmeny …, Actions |
| [`GIT-LATHUND.md`](GIT-LATHUND.md) | **1 sida** — main trunk, PMIR, daglig rutin |
| [`MOLN-KREDITER-LATHUND.md`](MOLN-KREDITER-LATHUND.md) | **1 sida** — GCP/Firebase MCP, ADC, gratis vs krediter, rutiner |
| [`LATHUND-INDEX.html`](LATHUND-INDEX.html) | Alla lathundar (HTML-index) |
| [`GITHUB_ANVANDARGUIDE.md`](GITHUB_ANVANDARGUIDE.md) | **Utskriftsguide** — repo, branches, daglig rutin |
| [`BRANCH-KARTA.md`](BRANCH-KARTA.md) | Aktiva / stängda / parked grenar |
| [`MERGE-IMPACT-RAPPORT.md`](MERGE-IMPACT-RAPPORT.md) | Mall före merge/stängning |
| [`GITHUB_STANDALONE_SETUP.md`](GITHUB_STANDALONE_SETUP.md) | Teknisk GitHub-setup (arkiv/alternativ) |

---

## Tier 3 — Specifikation och implementation

| Mapp / fil | Innehåll |
|------------|----------|
| [`specs/modules/`](specs/modules/) | Modul-SPECs, GAP-register, grunder-slides |
| [`specs/modules/Arkiv-GAP-REGISTER.md`](specs/modules/Arkiv-GAP-REGISTER.md) | **Implementation queue** — `kör [GAP]` |
| [`specs/design-master.md`](specs/design-master.md) | UI-kanon (Obsidian Calm) |
| [`specs/product-vision.md`](specs/product-vision.md) | Produktvision |
| [`src/modules/README.md`](../src/modules/README.md) | Kod ↔ spec ↔ `.context/modules/` |

---

## Tier 4 — Arkiv (historik, läs-only)

| Mapp | Innehåll |
|------|----------|
| [`archive/`](archive/) | Legacy server, Repomix, gamla inventeringar |
| [`archive/evaluations-2026-05-23/`](archive/evaluations-2026-05-23/) | Systemkontroll 2026-05-23 (historik) |
| [`archive/evaluations-2026-05/`](archive/evaluations-2026-05/) | Avslutade utvärderingar (Grunder, Vision) |
| [`archive/kladd/`](archive/kladd/) | Konsoliderad scratch (PII — committa inte publikt) |
| [`archive/server-legacy/`](archive/server-legacy/) | Arkiverad Express-backend |

---

## Snabbreferens: vad ska jag läsa?

| Uppgift | Börja här |
|---------|-----------|
| **Det känns rörigt / tappa inte bort sanning** | **[`SYSTEMKONTROLL.md`](SYSTEMKONTROLL.md)** — färdiga analysprompter A–E |
| Implementera modul | `specs/modules/[Modul]-SPEC.md` + `.context/modules/` + `src/modules/*/module_plan.md` |
| Säkerhetsgranskning | `.context/security.md` + `SMOKE_CHECKLIST.md` |
| Deploy | `DEPLOY.md` → `GCP-INVENTORY-LATEST.md` |
| RAG / minne | `.context/arkiv-minne.md` + `Arkiv-GAP-REGISTER.md` |
| GCP-fråga | `GCP-INVENTORY-LATEST.md` (inte arkiv-versioner) |
