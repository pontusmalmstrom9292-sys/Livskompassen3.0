# Modul-GAP — översikt (2026-05-29)

**Syfte:** En sida — vad som är **klart i kod**, vad som är **öppet per modul**, och vad som körs **autonomt** vs **kräver dig**.

**Arkiv (G1–G16):** [`specs/modules/Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md) — alla **done**.  
**Modulregister:** [`MODUL-FUNKTIONS-REGISTER.md`](./MODUL-FUNKTIONS-REGISTER.md) · **Cursor-plan mall:** [`evaluations/MALL-cursor-plan.md`](./evaluations/MALL-cursor-plan.md)  
**Plan-register:** [`evaluations/2026-05-26-session-landning.md`](./evaluations/2026-05-26-session-landning.md)  
**PMIR batch:** [`evaluations/2026-05-29-pmir-modul-rollout-batch.md`](./evaluations/2026-05-29-pmir-modul-rollout-batch.md)

---

## Cursor-planer (2026-05-29) — rollout stängd i kod

| Modul | Plan | Status | Smoke 2026-05-29 |
|-------|------|--------|------------------|
| Dagbok | [`2026-05-29-dagbok-vertex-plan.md`](./evaluations/2026-05-29-dagbok-vertex-plan.md) | Fas 1–4 **lokal kod done** | build · orkester · locked-ux **PASS** |
| Planering | [`2026-05-29-planering-cursor-plan.md`](./evaluations/2026-05-29-planering-cursor-plan.md) | Fas 1.5 + Fas 2 **lokal kod** | locked-ux **PASS** · **rules deploy öppen** |
| MåBra | [`2026-05-29-mabra-cursor-plan.md`](./evaluations/2026-05-29-mabra-cursor-plan.md) | Fas 1.5 + Fas 2 §1–2 **done** | build · orkester **PASS** |
| Projekt | [`2026-05-29-projekt-cursor-plan.md`](./evaluations/2026-05-29-projekt-cursor-plan.md) | Fas 3 MaterialPack **lokal done** | locked-ux **PASS** |
| Kunskap | [`2026-05-29-kunskap-cursor-plan.md`](./evaluations/2026-05-29-kunskap-cursor-plan.md) | Fas 1.5 **done** | orkester/innehall **PASS** |
| Barnporten | [`2026-05-29-barnporten-cursor-plan.md`](./evaluations/2026-05-29-barnporten-cursor-plan.md) | P1 + CB1 P2 **lokal done** | locked-ux **PASS** · manuell #3 öppen |
| Valv | module_plan + SPEC | Vävaren copy/polish **delvis lokal** | locked-ux (Mönster/Orkester) **PASS** |

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
| **dagbok** | `/dagbok` | Fas 1–4 **done** · storage deploy **done** | manuell smoke #2d |
| **mabra** | `/mabra` | §5 guardrail + §3 Vit djup-länk + **IA Våg 3 kompakt UI** | **done** 2026-05-30 |
| **planering** | `/planering?tab=handling` | Fas 1.5 + Fas 2 · IA Våg 3 handlingsrad + dropdowns | **done** · rules deploy **done** |
| **projekt** | `/projekt` | MaterialPack **done** · `project_rules` Firestore defer | `kör Projekt Fas 3b` |
| **kompis/kunskap** | Valv `kunskapsbank` | Fas 1.5 **done** · Fas 2 seed-bank | `specialist-kunskap-seed` |
| **barnporten** | `/barnporten` | P1 + CB1 **done** · manuell smoke #3 · QR CB2+ | `kör manuell smoke #3` |
| **valv** | `/dagbok?tab=bevis` | Vävaren försätt / polish | Spec/module_plan |
| **core** | `/` | Manuell smoke #1–7, #18–20 | Du · [`SMOKE_CHECKLIST.md`](./SMOKE_CHECKLIST.md) |
| **inkast** | Hem `#inkast-lite` | Fas 2 **done**; fas 3 genväg defer | — |
| **dossier** | `/dossier` | BBIC `reportType` **planned** | Spec §I.4 |
| **ekonomi** | `/vardagen?tab=ekonomi` | Smoke #18 manuell | Du |
| **hamn** | `/hamn` | BIFF via `TryggHamnHub` | `smoke:design-modules` |
| **auth/android** | app | **Verifierad 2026-05** | [`.context/android-capacitor.md`](../.context/android-capacitor.md) |

**Låst UX:** Barnfokus, Valv Mönster/Orkester/Kunskapsbank, Planering P3, ikoner B1/D1/M2 — `npm run smoke:locked-ux` **PASS**.

---

## Autorun (ingen LLM)

```bash
npm run orkester:night
```

---

## Kräver dig

1. **Manuell smoke** — [`2026-05-29-smoke-manuell.md`](./evaluations/2026-05-29-smoke-manuell.md)
2. **Kunskap våg 8 ingest** — efter granskning (`seed_kampspar_profile`)

---

## Ett steg i taget (rekommenderat)

| Prioritet | Gör |
|-----------|-----|
| 1 | **`godkänn merge`** — hela modul-batch (~60 filer, exkl. repomix) |
| 2 | `firebase deploy --only firestore:rules` (Planering Regler) |
| 3 | `firebase deploy --only storage` (journal_memories) |
| 4 | Manuell smoke Barnporten #3 |
