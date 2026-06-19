# Modul-GAP — översikt (2026-06-15)

**Syfte:** En sida — vad som är **klart i kod**, vad som är **öppet per modul**, och vad som körs **autonomt** vs **kräver dig**.

**Senaste leverans:** Fas 19 masterplan-v2 **levererad** · Fas 13–18 sprint **done** · [`2026-06-15-fas19-masterplan-v2.md`](./evaluations/2026-06-15-fas19-masterplan-v2.md) · [`SENASTE-SAMMANFATTNING.md`](./evaluations/SENASTE-SAMMANFATTNING.md)

**Arkiv (G1–G16):** [`specs/modules/Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md) — alla **done**.  
**Modulregister:** [`MODUL-FUNKTIONS-REGISTER.md`](./MODUL-FUNKTIONS-REGISTER.md) · **Cursor-plan mall:** [`evaluations/MALL-cursor-plan.md`](./evaluations/MALL-cursor-plan.md)  
**Plan-register:** [`evaluations/2026-05-26-session-landning.md`](./evaluations/2026-05-26-session-landning.md)  
**PMIR batch:** [`evaluations/2026-05-29-pmir-modul-rollout-batch.md`](./evaluations/2026-05-29-pmir-modul-rollout-batch.md)  
**Master YOLO (hela kön):** [`MASTER-YOLO-AUTORUN.md`](./MASTER-YOLO-AUTORUN.md) · `npm run master:yolo` · state [`.orkester/master-state.json`](../.orkester/master-state.json)

---

## Cursor-planer (2026-05-29) — **`closed`** (plan)

Alla planfiler har `status: closed` överst. **Öppet arbete finns endast i tabellen Modul-GAP nedan** — inte i planerna.

| Modul | Plan | Plan-status | Smoke 2026-05-29 |
|-------|------|-------------|------------------|
| Dagbok | [`dagbok-vertex-plan`](./evaluations/2026-05-29-dagbok-vertex-plan.md) | **closed** | build · orkester · locked-ux **PASS** |
| Planering | [`planering-cursor-plan`](./evaluations/2026-05-29-planering-cursor-plan.md) | **closed** | locked-ux **PASS** |
| MåBra | [`mabra-cursor-plan`](./evaluations/2026-05-29-mabra-cursor-plan.md) | **closed** | build · orkester **PASS** |
| Projekt | [`projekt-cursor-plan`](./evaluations/2026-05-29-projekt-cursor-plan.md) | **closed** | locked-ux **PASS** |
| Kunskap | [`kunskap-cursor-plan`](./evaluations/2026-05-29-kunskap-cursor-plan.md) | **closed** | orkester/innehall **PASS** |
| Barnporten | [`barnporten-cursor-plan`](./evaluations/2026-05-29-barnporten-cursor-plan.md) | **closed** | locked-ux **PASS** |
| Valv Samla | [`valv-samla-cursor-plan`](./evaluations/2026-05-29-valv-samla-cursor-plan.md) | **closed** (delvis kod) | locked-ux **PASS** |
| Valv Privacy | [`valv-privacy-cursor-plan`](./evaluations/2026-05-29-valv-privacy-cursor-plan.md) | **closed** (deferred 2.1) | — |
| Kompass widget | [`kompass-widget-snabbstart-plan`](./evaluations/2026-05-29-kompass-widget-snabbstart-plan.md) | **closed** | K1 integrerad |

---

## Arkiv-GAP (backend / minne)

| ID | Status | Kort |
|----|--------|------|
| G1–G16 | **done** | Valv-RAG, Vector ANN, Drive E2E, journal_woven opt-in, Barnen-RAG, inkorg, Tidshjul, m.m. |
| V1 | **wait** | Genkit-migrering — ej påbörjad |

---

## Modul-GAP (produkt / UI) — öppet

| Modul | Route | Gap / nästa | Kommando / vem |
|-------|-------|-------------|----------------|
| **dagbok** | `/hjartat` · `/hjartat/input` | Superdagbok §17 **done** Fas 11 · Fas 13 WORM medium **done** | — |
| **mabra** | `/vardagen?tab=mabra` | M3.0-B hybrid-8 **done** Fas 19.2 · M3.0-C näring **done** kod+rules (deploy rules USER 2026-06-19) · hex→tokens P0 **done** Fas 22 | `smoke:mabra` |
| **planering** | `/vardagen?tab=handling` · `/planering/input` | Superhub §15 **done** · kalender P2 **done** | — |
| **arbetsliv** | `/vardagen?tab=arbetsliv` · `/arbetsliv/input` | Superhub §16 **done** Fas 10 | — |
| **ekonomi** | `/vardagen?tab=ekonomi` | Superhub §14 **done** Fas 8 | — |
| **projekt** | `/projekt` | MaterialPack + Familjen-mount **done** · `project_rules` **done** | — |
| **kompis/kunskap** | Valv `kunskapsbank` | våg 24 ingest **done** Fas 16 · våg 8 **partial** (53 FACT) | [`CONTENT-WAVES.md`](./content/CONTENT-WAVES.md) |
| **barnporten** | `/barnporten` | CB2–CB4 + QR **done** · Våg C push **defer** | USER #4 valfritt re-verify |
| **valv** | `/valvet` | Vault-gate 12C **done** Fas 13 · unlockVault P0 **done** Fas 19.1 | `smoke:valv-security` |
| **core** | `/` | Hemkompass 12B **done** · Adaptiv broar live | — |
| **inkast** | Hem · Valv Samla | Inkast I1–I3 **done** Fas 15 · `InboxReviewQueue` kanon | `smoke:inkast` |
| **liv** | `/vardagen` | LivSuper launcher **done** | — |
| **dossier** | Valv `dossier` | BBIC `reportType` **done** Fas 13 (12D) | [`fas13-vag-3-evidence-e2e`](./evaluations/2026-06-15-fas13-vag-3-evidence-e2e.md) |
| **hamn** | `/familjen?tab=hamn` | BIFF via `TryggHamnHub` · Gräns-Arkitekten G14 **done** | `smoke:design-modules` |
| **auth/android** | app | cap sync **done** Fas 18 · native Google USER-test öppen | [`.context/android-capacitor.md`](../.context/android-capacitor.md) |
| **evolution** | hub | `evolution_ledger` dual-write | **done** Fas 19.5 | `smoke:evolution-discovery` |

**Låst UX:** Barnfokus, Valv Mönster/Orkester/Kunskapsbank, Planering P3, ikoner B1/D1/M2 — `npm run smoke:locked-ux` **PASS**.

---

## Autorun (ingen LLM)

```bash
npm run orkester:night
```

---

## Kräver dig

1. **Fas 5A #3 Valv** — **PASS** 2026-06-07 (USER) · [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md)
2. **Fas 5A #4 Barnporten** — **PASS** 2026-06-06 (USER · Motorola) · [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md)
3. **Valfritt USER** — superhub snabbtest · [`2026-05-29-smoke-manuell.md`](./evaluations/2026-05-29-smoke-manuell.md)

---

## Ett steg i taget (Fas 20 — 2026-06-15)

| Prioritet | Gör |
|-----------|-----|
| 1 | **Doc-synk:** Tier-1 hubbar (denna fil + `SYSTEM_PLAN_v2` + `SESSION-INDEX`) |
| 2 | **Hex→tokens P0** enligt masterplan 19.3 → Fas 20 |
| 3 | **Arkiv 19.6:** Läs PMIR — [`2026-06-15-fas19-archive-pmir.md`](./evaluations/2026-06-15-fas19-archive-pmir.md) |
| 4 | **Valfritt USER:** Motorola #3 Valv · #4 Barnporten · native Google |
