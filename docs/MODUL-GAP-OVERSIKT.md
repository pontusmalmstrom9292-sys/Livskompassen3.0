# Modul-GAP — översikt (2026-06-06)

**Syfte:** En sida — vad som är **klart i kod**, vad som är **öppet per modul**, och vad som körs **autonomt** vs **kräver dig**.

**Senaste leverans:** Barnporten Våg A/B **deployad** (CB2–CB4 + QR) · Android Run **PASS** · 1h autonom pass Agent 4 · [`2026-06-06-1h-autonom-rapport.md`](./evaluations/2026-06-06-1h-autonom-rapport.md) · [`SENASTE-SAMMANFATTNING.md`](./evaluations/SENASTE-SAMMANFATTNING.md)

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
| **dagbok** | `/hjartat` (reflektion) | Fas 1–4 **done** · `#2d` USER **PASS** 2026-06-06 | — |
| **mabra** | `/mabra` | §5 guardrail + §3 Vit djup-länk + **IA Våg 3 kompakt UI** | **done** 2026-05-30 |
| **planering** | `/planering?tab=handling` | Fas 2 **done** · **kalender P2 done** (`/planering/kalender` + ICS-export · `c2ce1dc0` · `1ef411e3`) | **done** |
| **projekt** | `/projekt` | MaterialPack Fas 3 light **done** · **Våg A Familjen-mount done** (`22a2f056` under Barnfokus) · `project_rules` Firestore **done** 2026-06-01 | [`pmir-materialpack-editor`](./evaluations/2026-06-06-pmir-materialpack-editor.md) |
| **kompis/kunskap** | Valv `/valvet` · `kunskapsbank` | Fas 1.5 **done** · våg 8 **partial** (53 FACT — omkör med seed-credentials) | [`CONTENT-WAVES.md`](./content/CONTENT-WAVES.md) våg 8 |
| **barnporten** | `/barnporten` | P1 + **Våg A done + deployad** (CB2–CB4) + **Våg B done + deployad** (QR callables + rules) + **polish done** · **USER #4 PASS** 2026-06-06 (Motorola QR) · Våg C push defer | [`2026-06-06-pmir-barnporten-cb2plus.md`](./evaluations/2026-06-06-pmir-barnporten-cb2plus.md) |
| **valv** | `/valvet` | ValvSuper Fas 1+2 **done** · Vävaren HITL **done** | hosting deploy Fas 2 · [`supermodule-master-plan`](./evaluations/2026-06-06-supermodule-master-plan.md) |
| **core** | `/` | Hemkompass polish **done** 2026-06-06 · **XSS export-säkerhet done** (`secureExport` merge) · `#2d` autorun PASS · `#3` USER **PASS** 2026-06-07 · `#4` USER **PASS** 2026-06-06 | [`2026-06-06-hemkompass-polish-done.md`](./evaluations/2026-06-06-hemkompass-polish-done.md) |
| **inkast** | Hem · Valv Samla | CaptureSuper **v2 done** · canonical `InboxReviewQueue` | [`2026-06-06-upload-unified-cursor-plan.md`](./evaluations/2026-06-06-upload-unified-cursor-plan.md) |
| **liv** | `/vardagen` launcher | **LivSuper + Drogfrihet→Familj done** 2026-06-06 | [`2026-06-06-liv-super-cursor-plan.md`](./evaluations/2026-06-06-liv-super-cursor-plan.md) |
| **dossier** | `/dossier` | BBIC `reportType` **planned** | Spec §I.4 |
| **ekonomi** | `/liv?tab=kompasser&vardagenTab=ekonomi` | Routing superhub **live** 2026-06-01 · sparmål UI **done** · lönespec vardag **done** | [`LOST-FEATURES-REGISTER.md`](./evaluations/LOST-FEATURES-REGISTER.md) |
| **hamn** | `/hamn` | BIFF via `TryggHamnHub` | `smoke:design-modules` |
| **auth/android** | app | **Run PASS 2026-06-06** (Motorola) · cap sync klar · SHA-1 OK | [`.context/android-capacitor.md`](../.context/android-capacitor.md) |

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

## Ett steg i taget (Fas 5A — 2026-05-31)

| Prioritet | Gör |
|-----------|-----|
| 1 | **Du:** Vävaren HITL i prod — [`evaluations/2026-05-31-fas5a-user-checklist.md`](./evaluations/2026-05-31-fas5a-user-checklist.md) |
| 2 | **Du:** Manuell smoke #3, #4, #2d, projektbild — uppdatera [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md) |
| 3 | Agent: `npm run smoke:locked-ux` + `smoke:orkester` (klart vid Fas 5A prep) |
| 4 | Nästa kod: Fas 5B Valv/Hamn polish — **done** på `main` |
