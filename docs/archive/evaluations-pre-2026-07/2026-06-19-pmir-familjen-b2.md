# Pre-Merge Impact Report (PMIR) — Familjen B2 Progressive Disclosure

**Datum:** 2026-06-19  
**Gren:** `cursor/familjen-b2-polish-7746`  
**Agent:** specialist-familjen-hamn-builder (B2 våg)

---

## Syfte

Progressive disclosure-polish för Familjen/Hamn — samma mönster som Valv A2.x:

- **Primär:** huvudflöde synligt först (Barnfokus-formulär · Hamn BIFF-triage)
- **Sekundär:** historik/stöd i `CalmCollapsible` med `meta` (inte `hint`)

---

## Följer med till main

| Fil | Ändring |
|-----|---------|
| `FamiljenBarnfokusDelegate.tsx` | Minneslista + Planering i `CalmCollapsible` (`meta`: antal sparade / "Valfritt") |
| `TryggHamnHub.tsx` | `HamnBiffWorkflow` — BIFF primärt; brusfilter, kompass, lexikon i folds |
| `HamnModuleStack.tsx` | `compassOnly` — platt kompassinnehåll i fold utan dubbel ElongatedModule |

---

## Låst UX — oförändrat

- `BARNFOKUS_QUESTIONS`, `handleSaveBarnfokus`, optimistisk save
- Knappcopy: **Spara till {ChildAlias}s logg** · **Minneslista** (titel i fold)
- Barnporten HITL, `SaveAsEvidencePrompt` — ej rörd
- Hamn BIFF-triage (`BiffTriagePanel`, `useHamnBiffWizard`, Zero Footprint)
- `HamnModuleStack` + `HAMN_GREY_ROCK_LEAD` behålls (översikt + smoke)

---

## MUST NOT (verifierat)

| Gate | Status |
|------|--------|
| `firestore.rules` | Ej rörd |
| `sharedRules.ts` | Ej rörd |
| Cross-zon (MåBra, Valv, Planering) | Ej rörd |
| Auto-promote barnlogg → Valv | Ej introducerad |
| Ta bort Barnfokus / Barnporten HITL | Ej |

---

## Regelanalys

| Lager | Källor | Status |
|-------|--------|--------|
| Design | `design-calm.mdc`, `CalmCollapsible` + `meta` | PASS |
| Locked UX | `.context/locked-ux-features.md` §12 | PASS |
| Domän | WORM `children_logs`, Hamn ephemeral | PASS |
| Tre silos | Ingen cross-RAG | PASS |

---

## Smoke (efter implementation)

| Kommando | Resultat |
|----------|----------|
| `npm run build` | **PASS** |
| `npm run smoke:locked-ux` | **PASS** |

---

## Rekommendation

- [x] Merge till `main` efter Pontus OK och smoke PASS
- Ingen deploy krävs om endast UI-polish (hosting vid behov)

---

## Godkännande

**Användaren:** ☐ godkänn merge  
**Datum:** —
