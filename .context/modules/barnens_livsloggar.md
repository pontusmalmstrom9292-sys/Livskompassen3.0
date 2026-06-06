# Barnens livsloggar

**Kanonisk kod:** `src/modules/features/family/children/`  
**Route:** `/familjen?tab=livslogg` (Barnfokus: `?tab=reflektion`) · **Legacy:** `/barnen` → redirect · **AuthGate:** ja · **Dock:** Heart  
**Spec (konsoliderad):** [`docs/specs/modules/Barnen-SPEC.md`](../../docs/specs/modules/Barnen-SPEC.md)

## Syfte

**Den trygga hamnen** — neutral Grey Rock-dokumentation för **Kasper** och **Arvid**. BBIC-orienterade basbehov. Skild från dagbok, valv och vuxenkonflikt.

## UI (idag)

| Komponent | Roll |
|-----------|------|
| `FamiljenPage` | Kluster-wrapper |
| `BarnensPage` | PIN, barn-flikar, balans, fysio, livslogg, tidslinje |
| `BarnfokusFraganPanel` | Middagsfrågan / Barnfokus (låst UX) |
| `PhysiologicalControls` | Sömn, ångest, aptit 1–5 |
| `ChildSubLogPanel` | Kategori, observation, barnpåverkan |
| `BalansMatare` | 7-dagars bar + text |
| `exportBalansReport` | JSON-export per barn |

## Navigation

| Ingång | Beteende |
|--------|----------|
| Dock Heart | `/familjen` |
| `/barnen` | Redirect → `/familjen?tab=reflektion` |
| Titlar | Kluster **Familjen**; innehåll **Livsloggar** / **Barnfokus** |

## Datamodell (WORM)

- **`children_logs`:** childAlias, action (`fysiologi`|`livslogg`), signals?, observation, category?, childrenImpact?, ownerId, createdAt — append-only

## Backend

| Path | Data |
|------|------|
| Klient `saveChildrenLog` | `children_logs` |
| `childrenLogsQuery` | Barnen RAG (Familjen) |
| `computeBalansIndex` | Endast fysiologi, 7 dagar |
| JSON export | Klient per barn |

## Status

| Klart | Delvis | Planerat |
|-------|--------|----------|
| PIN, fysio, livslogg, balans, JSON, incident→valv, tredjepart-filter, Dossier-länk, Barnfokus | Full wizard; kill switch raderar PIN-hash | PDF per barn, larm, Sandbox/Ankare UX |

## Säkerhet

- Separat PIN (inte WebAuthn)
- Lås vid `visibilitychange` + manuell **Lås modul**
- WORM rules

## Kopplingar

- **Valv** — isolerad; explicit bro via `SaveAsEvidencePrompt`
- **Dossier** — opt-in PDF/hash
- **Dagbok** — ingen auto

Kod: `src/modules/features/family/children/` · Plan: [`src/modules/features/family/children/module_plan.md`](../../src/modules/features/family/children/module_plan.md)
