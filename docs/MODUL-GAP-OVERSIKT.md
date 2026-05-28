# Modul-GAP — översikt (2026-05-28)

**Syfte:** En sida — vad som är **klart i kod**, vad som är **öppet per modul**, och vad som körs **autonomt** vs **kräver dig**.

**Arkiv (G1–G16):** [`specs/modules/Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md) — alla **done** (senast verifierat i register + `npm run smoke:orkester`).  
**Modulregister:** [`MODUL-FUNKTIONS-REGISTER.md`](./MODUL-FUNKTIONS-REGISTER.md) · **Manuell smoke:** [`SMOKE_CHECKLIST.md`](./SMOKE_CHECKLIST.md)  
**Plan-register:** [`evaluations/2026-05-26-session-landning.md`](./evaluations/2026-05-26-session-landning.md)

---

## Arkiv-GAP (backend / minne)

| ID | Status | Kort |
|----|--------|------|
| G1–G16 | **done** | Valv-RAG, Vector ANN, Drive E2E, journal_woven opt-in, Barnen-RAG, inkorg, Tidshjul, Gräns-Arkitekten, m.m. |
| V1 | **wait** | Genkit-migrering — ej påbörjad |

Ny arkiv-implementation: säg `kör [GAP]` (regel i GAP-register) — inget nytt G17 listat idag.

---

## Modul-GAP (produkt / UI) — öppet

| Modul | Route | Gap / nästa | Kommando / vem |
|-------|-------|-------------|----------------|
| **core** | `/` | Manuell smoke #1–7, #18–20; drawer **done** (`NavigationDrawer.tsx` + `navTruth`) | Du · [`SMOKE_CHECKLIST.md`](./SMOKE_CHECKLIST.md) |
| **kompis** (`evidence/kompis`) | Kunskap (Valv PIN) | Klickbara citations; policy: ej auto-ingest Kladd; dagbok→kampspar (Vävaren→valv idag) | `kör kunskap` · se `src/modules/evidence/kompis/module_plan.md` |
| **projekt** (`admin/projects`) | `/projekt` | **P2+:** regler, bild-uppladdning, widget-sheet, MaterialPack-editor | `kör projekt P2` |
| **planering** (`admin/planning`) | `/planering` | P3 kanban **done**; kopplingar C–D (Life OS) | `kör kopplingar C` |
| **barnporten** | (plan PWA) | Hub, widget CB1–4, HITL promote — **ej full route** | `kör barnporten` · [`BARNPORTEN-SPEC.md`](./design/BARNPORTEN-SPEC.md) |
| **mabra** (`wellbeing/mabra`) | `/mabra` | MVP **done**; **Daglig Mix** **done** (hub) | — |
| **dagbok** (`diary/diary`) | `/dagbok` | Inkast **fas 2–5** | `kör inkast fas 2` |
| **dossier** (`evidence/vault/dossier`) | `/dossier` | BBIC `reportType` **planned** | Spec §I.4 |
| **valv** (`evidence/vault`) | `/dagbok?tab=bevis` | Vävaren försätt / polish kvar | Spec/module_plan |
| **ekonomi** (`wellbeing/economy`) | `/vardagen?tab=ekonomi` | Smoke #18 manuell | Du |
| **hamn** (`family/safeHarbor`) | `/hamn` | BIFF via `TryggHamnHub` | `smoke:design-modules` |
| **auth/android** | app | **Verifierad 2026-05** — SHA-1 + `client_type: 1` i `google-services.json`; native Google på telefon. Rutin: `build:web` → `cap sync` → Clean → Run · offline: [`OFFLINE-ANDROID.md`](./OFFLINE-ANDROID.md) | [`.context/android-capacitor.md`](../.context/android-capacitor.md) · [`FIREBASE-AUTH-LATHUND.md`](./FIREBASE-AUTH-LATHUND.md) |

**Låst UX (ska inte tas bort):** Barnfokus, Valv Mönster/Orkester/Kunskapsbank, Planering P3, ikoner B1/D1/M2 — `npm run smoke:locked-ux`.

---

## Autorun (ingen LLM)

```bash
npm run orkester:night
```

Ingår: locked-ux, design-modules, innehåll (U6), locked-icons, smoke:orkester, functions + frontend build.  
Rapport: `docs/evaluations/YYYY-MM-DD-orkester-natt.md`

**Inte varje natt:** `npm run icons:proposals-v4` (130 SVG).

---

## Kräver dig (kan inte automatiseras)

1. **Smoke** — checklista #1–7, #18–20 (Firestore Console verifiering).
2. **Firebase Console** — domäner, Google Sign-in, Anonymous (om dev), secrets till GitHub (`./scripts/set_github_hosting_secrets.sh`).
3. **Produktbeslut** — ikonval (v4), MåBra Daglig Mix, Projekt P2 scope.
4. **Merge** — PMIR + uttrycklig `godkänn merge` ([`MERGE-IMPACT-RAPPORT.md`](./MERGE-IMPACT-RAPPORT.md)).
5. **Nycklar** — service account JSON **utanför** repo (aldrig under `~/` i projektmappen).

---

## Ett steg i taget (rekommenderat)

| Prioritet | Gör |
|-----------|-----|
| 1 | `npm run orkester:night` — bekräfta grönt |
| 2 | `docs/SMOKE_CHECKLIST.md` #1 + #2 + #18 en kväll |
| 3 | Välj **ett** produktspår: `kör måbra daglig mix` **eller** `kör projekt P2` **eller** `kör inkast fas 2` |
