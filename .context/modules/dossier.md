# Dossier-Generator

**Sacred Feature.** **Route:** `/dossier` (planerad) eller kontextuell export från `/valv` / `/barnen`  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md) (Obsidian Calm, Riktning A)  
**Incoming spec:** [`docs/specs/incoming/Dossier-SPEC.md`](../../docs/specs/incoming/Dossier-SPEC.md)

---

## 1. Syfte och användarbehov

Formell WORM-sammanställning (PDF) för ombud/myndighet. Aggregerar valv, dagbok och barnen utan att användaren återupplever traumat genom manuell omskrivning.

## 2. Route och ingång

| Variant | Ingång |
|---------|--------|
| **A** | `/dossier` (AuthGate) |
| **B (rekommenderad)** | *Skapa Dossier* i `/valv` och `/barnen` — ingen dock-ikon |

**Idag:** Ingen route. Delvis export via Valv-lista och Barnen JSON.

## 3. UX-flöde

Urval (period + källor) → förhandsgranskning → generering (glass blur) → nedladdning → Zero Footprint.

## 4. Visuell design

Obsidian Calm enligt design-master. Guld urval, indigo fortsätt, emerald klar.

## 5. Datamodell

**Läser:** `reality_vault`, `journal`, `children_logs` (vävaren_metadata valfritt).  
**Skriver:** `dossier_snapshot` (hash + createdAt + sourceDocIds).

## 6. Backend

| Komponent | Status |
|-----------|--------|
| `generateDossier` | **planned** |
| Dossier-Agent (Genkit) | **planned** |
| `exportVaultRecordAsPdf` | **done** — en post, print |
| `exportBalansReport` | **done** — JSON stub per barn |

## 7. Säkerhet

AuthGate, CMEK, Zero Footprint, Kill Switch, ingen auto-delning, hash som integritetsbevis.

## 8. Gap-tabell

| Area | Status | Kod |
|------|--------|-----|
| Route `/dossier` | **planned** | — |
| Urval UI | **planned** | — |
| Multi-källa aggregation | **planned** | — |
| `generateDossier` | **planned** | — |
| `dossier_snapshot` + hash | **planned** | — |
| Genkit PDF-agent | **planned** | — |
| Valv per-post PDF | **done** | `verklighetsvalvet/utils/exportVaultRecord.ts` |
| Barnen JSON Balans | **done** (stub) | `barnens_livsloggar/utils/exportBalansReport.ts` |
| *Skapa Dossier*-knappar | **planned** | — |

### Kodjämförelse (partial vs mål)

| | Full Dossier | Valv export | Barnen export |
|---|--------------|-------------|---------------|
| Collections | 3+ | 1 post | `children_logs` |
| Format | PDF + hash | Print-PDF | JSON |
| Snapshot Firestore | ja | nej | nej |
| Agent | ja | nej | nej |
| Datumintervall | användarval | nej | 7 dagar fast |

## 9. Acceptanskriterier

Se [`Dossier-SPEC.md`](../../docs/specs/incoming/Dossier-SPEC.md) §9.

## 10. Kopplingar

| Modul | Relation |
|-------|----------|
| Valv | Huvudbevis; per-post PDF är inte slutmål |
| Barnen | `children_logs`; JSON-export matar framtida PDF |
| Dagbok | `journal` + vävaren som valfri kontext |
| Valv-Chat | Samma läs-källa — skild funktion |

Flöde: [`docs/specs/p2-flode.md`](../../docs/specs/p2-flode.md).

## 11. Navigation

Variant B — kontextuella export-knappar, inte vardagsnav.
