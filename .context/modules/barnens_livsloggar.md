# Barnens livsloggar

**Kanonisk kod:** `src/modules/family/children/` (legacy: `modules/barnens_livsloggar` shim)

**Route:** `/familjen` · **Redirect:** `/barnen` · **AuthGate:** ja · **Dock:** Heart  
**Spec (konsoliderad):** [`docs/specs/modules/Barnen-SPEC.md`](../../docs/specs/modules/Barnen-SPEC.md)

## Syfte

**Den trygga hamnen** — neutral Grey Rock-dokumentation för **Kasper** och **Arvid**. BBIC-orienterade basbehov. Skild från dagbok, valv och vuxenkonflikt.

## UI (idag)

| Komponent | Roll |
|-----------|------|
| `FamiljenPage` | Kluster-wrapper |
| `BarnensPage` | PIN, barn-flikar, balans, fysio, livslogg, tidslinje |
| `PhysiologicalControls` | Sömn, ångest, aptit 1–5 |
| `ChildSubLogPanel` | Kategori, observation, barnpåverkan |
| `BalansMatare` | 7-dagars bar + text |
| `exportBalansReport` | JSON-export per barn |

**UX idag:** en sida, två spara-knappar (fysiologi \| livslogg) — **inte** wizard.

## Navigation

| Ingång | Beteende |
|--------|----------|
| Dock Heart | `/familjen` |
| `/barnen` | Redirect → `/familjen` |
| Titlar | Kluster **Familjen**; innehåll **Livsloggar** |

## Datamodell (WORM)

- **`children_logs`:** childAlias, action (`fysiologi`|`livslogg`), signals?, observation, category?, childrenImpact?, ownerId, createdAt — append-only

## Backend

| Path | Data |
|------|------|
| Klient `saveChildrenLog` | `children_logs` |
| `computeBalansIndex` | Endast fysiologi, 7 dagar |
| JSON export | Klient per barn |

## Status

| Klart | Delvis | Planerat |
|-------|--------|----------|
| PIN, fysio, livslogg, balans, JSON, incident→valv, tredjepart-filter, Dossier-länk | Full wizard; kill switch raderar PIN-hash | PDF per barn, larm, Sandbox/Ankare UX |

## Kladd 2026-05-21

- **Bevis (valv):** Skola Ann/Lena — Kasper trötthet/utagerande mammaveckor; barnsamtal arg smiley.
- **Barnen:** Neutral fysio (sömn/ångest/aptit) + livslogg `skola` — **inte** "dåliga hemligheter"-modul (→ livslogg + valv vid allvar).
- **Gap:** Tredjepart-tagg — använd `category: skola` tills dedikerad tagg.
- **Soc:** Undvik "narcissist"; fakta + barnets bästa.

## Säkerhet

- Separat PIN (inte WebAuthn)
- Lås vid `visibilitychange` + manuell **Lås modul**
- WORM rules

## Produktbeslut (låsta 2026-05)

Se §14 i [`Barnen-SPEC.md`](../../docs/specs/modules/Barnen-SPEC.md): enkel PIN, visibilitychange-lås, incident explicit med sourceRef, balans=fysiologi only, export per barn, Dossier opt-in.

## Kopplingar

- **Valv** — isolerad; planerad explicit bro
- **Dossier** — opt-in PDF/hash
- **Dagbok** — ingen auto; Variant B planerad

Kod: `src/modules/barnens_livsloggar/` · Plan: [`src/modules/barnens_livsloggar/module_plan.md`](../../src/modules/barnens_livsloggar/module_plan.md)
