# Modul-GAP — översikt (2026-05-29)

**Syfte:** En sida — vad som är **klart i kod**, vad som är **öppet per modul**, och vad som körs **autonomt** vs **kräver dig**.

**Arkiv (G1–G16):** [`specs/modules/Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md) — alla **done**.  
**Modulregister:** [`MODUL-FUNKTIONS-REGISTER.md`](./MODUL-FUNKTIONS-REGISTER.md) · **Cursor-plan mall:** [`evaluations/MALL-cursor-plan.md`](./evaluations/MALL-cursor-plan.md)  
**Plan-register:** [`evaluations/2026-05-26-session-landning.md`](./evaluations/2026-05-26-session-landning.md)

---

## Cursor-planer (2026-05-29)

| Modul | Plan | Status |
|-------|------|--------|
| Dagbok | [`2026-05-29-dagbok-vertex-plan.md`](./evaluations/2026-05-29-dagbok-vertex-plan.md) | Fas 1–3 **lokal kod** · Fas 4 Handoff öppen · PMIR: [`2026-05-29-pmir-dagbok-planering.md`](./evaluations/2026-05-29-pmir-dagbok-planering.md) |
| Planering | [`2026-05-29-planering-cursor-plan.md`](./evaluations/2026-05-29-planering-cursor-plan.md) | Fas 1.5 **lokal kod** · Fas 2 e-postregler (rules) |
| MåBra | [`2026-05-29-mabra-cursor-plan.md`](./evaluations/2026-05-29-mabra-cursor-plan.md) | Fas 1.5 **done** |
| Projekt | [`2026-05-29-projekt-cursor-plan.md`](./evaluations/2026-05-29-projekt-cursor-plan.md) | P2 **done** · Fas 3 Life OS öppen |
| Kunskap | [`2026-05-29-kunskap-cursor-plan.md`](./evaluations/2026-05-29-kunskap-cursor-plan.md) | Citations **done** · Fas 1.5 polish öppen |
| Barnporten | [`2026-05-29-barnporten-cursor-plan.md`](./evaluations/2026-05-29-barnporten-cursor-plan.md) | P1 **done** · CB1 widget P2 |

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
| **dagbok** (`diary/diary`) | `/dagbok` | v2 Fas 1–3 **lokal** (sub-nav, arkiv, bilagor) · Fas 4 Handoff · **commit + storage deploy** | PMIR → `godkänn merge` |
| **planering** (`admin/planning`) | `/planering?tab=handling` | Fas 1.5 **lokal** (Framsteg, dock, deadline) · Fas 2 `planning_email_rules` | `kör Planering Fas 2` (rules OK) |
| **mabra** (`wellbeing/mabra`) | `/mabra` | Daglig Mix hub **done** · Fas 2 lågenergi/landningsremsa | `kör MåBra Fas 2` |
| **projekt** (`admin/projects`) | `/projekt` | P2 **done** · MaterialPack-editor + Life OS kopplingar | `kör Projekt Fas 3` |
| **kompis** (`evidence/kompis`) | Valv `kunskapsbank` | Citations **done** · Valv-panel polish | `kör Kunskap Fas 1.5` |
| **barnporten** | `/barnporten` | P1 **done** · CB1 widget P2 · manuell smoke #3 | `kör Barnporten P2` |
| **core** | `/` | Manuell smoke #1–7, #18–20 | Du · [`SMOKE_CHECKLIST.md`](./SMOKE_CHECKLIST.md) |
| **inkast** | Hem `#inkast-lite` | Fas 2 **done**; fas 3 genväg defer | — |
| **dossier** | `/dossier` | BBIC `reportType` **planned** | Spec §I.4 |
| **valv** | `/dagbok?tab=bevis` | Vävaren försätt / polish | Spec/module_plan |
| **ekonomi** | `/vardagen?tab=ekonomi` | Smoke #18 manuell | Du |
| **hamn** | `/hamn` | BIFF via `TryggHamnHub` | `smoke:design-modules` |
| **auth/android** | app | **Verifierad 2026-05** | [`.context/android-capacitor.md`](../.context/android-capacitor.md) |

**Låst UX:** Barnfokus, Valv Mönster/Orkester/Kunskapsbank, Planering P3, ikoner B1/D1/M2 — `npm run smoke:locked-ux`.

---

## Autorun (ingen LLM)

```bash
npm run orkester:night
```

---

## Kräver dig

1. **Smoke** — checklista #1–7, #18–20.
2. **Merge** — PMIR + `godkänn merge` ([`MERGE-IMPACT-RAPPORT.md`](./MERGE-IMPACT-RAPPORT.md)).
3. **Storage deploy** — efter Dagbok Fas 2 commit: `firebase deploy --only storage`.

---

## Ett steg i taget (rekommenderat)

| Prioritet | Gör |
|-----------|-----|
| 1 | **`godkänn merge`** Dagbok + Planering (PMIR klar) |
| 2 | `firebase deploy --only storage` (journal_memories) |
| 3 | `kör Kunskap Fas 1.5` **eller** `kör MåBra Fas 2` **eller** manuell smoke |
