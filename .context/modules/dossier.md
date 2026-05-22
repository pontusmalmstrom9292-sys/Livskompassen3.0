# Dossier-Generator

**Sacred Feature.** **Route:** `/dossier` (AuthGate + Fyren A)  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md)  
**Incoming spec:** [`docs/specs/modules/Dossier-SPEC.md`](../../docs/specs/modules/Dossier-SPEC.md)

---

## Låsta beslut (#1–#4)

Backend PDF · snapshot WORM evigt · PDF Storage TTL ~24 h · hela dokument i granskning · kanonisk hash · journal opt-in · AI endast försätt · manuell nedladdning · async job vid lång kö · Fyren A · ingen dock-ikon.

---

## Syfte

Formell WORM-sammanställning (PDF) för ombud/myndighet. Aggregerar valv + barnen (+ valfritt journal) utan manuell omskrivning.

---

## UX (MVP)

Period → källor (journal varning) → granska hela poster → generera → hash + nedladdning → Zero Footprint.

---

## Datamodell

**Läser:** `reality_vault`, `children_logs`, opt-in `journal`.  
**Skriver:** `dossier_snapshots` (WORM), PDF Storage kortlivad.

---

## Backend

| Komponent | Status |
|-----------|--------|
| Wizard UI | **done** |
| `generateDossier` | **done** |
| `dossier_snapshots` rules | **done** |
| pdf-lib PDF | **done** |
| Vävaren försätt (opt-in) | **planned** |
| `exportVaultRecordAsPdf` | **done** |
| `exportBalansReport` | **done** |

---

## Säkerhet

Fyren A, AuthGate, CMEK, Zero Footprint, Kill Switch, hash-integritet, ingen auto-delning.

---

## Gap

| | Full Dossier | Valv export | Barnen export |
|---|--------------|-------------|---------------|
| Multi-källa | ja | 1 post | JSON |
| Hash/snapshot | ja | nej | nej |

## Kladd 2026-05-21

- **Kladd:** Samlad export för ombud/soc — aggregerar valv + barnen (+ journal opt-in).
- **Bevis §D:** Orosanmälan, skola, läkarintyg, sms-PDF — **källor i valv**, dossier samlar.
- **Gap:** BBIC-mall (`reportType`) fas 2; bro *Skapa Dossier* från Valv/Barnen.
- **Implementerat:** `generateDossier` + kanonisk hash + snapshot WORM.

Kod: `src/modules/dossier/`, `verklighetsvalvet/utils/exportVaultRecord.ts`, `barnens_livsloggar/utils/exportBalansReport.ts`.

Flöde: [`docs/specs/p2-flode.md`](../../docs/specs/p2-flode.md) · **Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md)
