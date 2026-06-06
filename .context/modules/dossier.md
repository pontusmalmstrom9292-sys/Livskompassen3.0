# Dossier-Generator

**Sacred Feature.** **Route:** `/valvet?vaultTab=dossier` · **Legacy:** `/dossier` → redirect · **AuthGate + PIN**  
**Kanonisk kod:** `src/modules/features/lifeJournal/evidence/vault/dossier/`  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md)  
**Spec:** [`docs/specs/modules/Dossier-SPEC.md`](../../docs/specs/modules/Dossier-SPEC.md)

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
| `exportVaultRecordAsPdf` | **done** |
| `exportBalansReport` | **done** |

---

## Säkerhet

Fyren + PIN, AuthGate, CMEK, Zero Footprint, Device Clear, hash-integritet, ingen auto-delning.

Kod: `src/modules/features/lifeJournal/evidence/vault/dossier/` · Export helpers: `vault/utils/exportVaultRecord.ts`, `family/children/utils/exportBalansReport.ts`
