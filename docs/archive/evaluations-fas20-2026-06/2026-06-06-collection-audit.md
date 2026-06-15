# Firestore collection audit — chat 2026-06-06

**Datum:** 2026-06-06  
**Scope:** Misstänkta "dubbletter" från extern chat-analys  
**Beslut:** **Ingen migration** — dokumentation only. Merge kräver PMIR + datamigrering.

Kanon: [`firestore.rules`](../../firestore.rules) · [`.context/arkiv-minne.md`](../../.context/arkiv-minne.md) · G9/G10 i [`Arkiv-GAP-REGISTER.md`](../specs/modules/Arkiv-GAP-REGISTER.md)

---

## Sammanfattning

| Chat-påstående | Verdict |
|----------------|---------|
| `mabra_sessions` + `mabra_progress` redundans | **Nej** — olika livscykel |
| `vit_hub` + `vit_entries` dubbel lagring | **Nej** — hub-state vs append-only entries |
| `entity_profiles` + `system_synapses` överlapp | **Nej** — G9, olika metadata-roller |
| 5× `economy_*` rationalisera nu | **Senare** — domänmodell, kräver PMIR |

---

## MåBra / Vit

| Collection | Syfte | WORM | Client update | Merge? |
|------------|-------|------|---------------|--------|
| `mabra_sessions` | Per-session metadata efter övning | nej | **nej** (create-only) | nej |
| `mabra_progress` | Användarprogress (hub/exercise state) | nej | **ja** (owner-scoped) | nej |
| `vit_hub` | Per-user hub-state (projektval, UI) | nej | **ja** (owner-scoped) | nej |
| `vit_entries` | Innehållskort (REFLECTION/PLAY) | create-only | **nej** | nej |

**Regler:** `mabra_progress` och `vit_hub` tillåter update endast när `request.auth.uid == uid` och `ownerId`/`userId` matchar — avsiktligt, inte tampering på WORM-bevis.

---

## Aktörskarta / ADK (G9)

| Collection | Syfte | Callable | Merge? |
|------------|-------|----------|--------|
| `entity_profiles` | Manuell aktörskarta (displayName, role, aliases) | `addEntityProfile`, `getEntityProfileRegistry` | nej |
| `system_synapses` | ADK metadata (groundingPoints, hallucinationRisk) | läses via entity bundle | nej |

**Blocker:** Cross-RAG mellan silos — entity metadata får **inte** blandas in i Kunskap/Valv/Barnen RAG.

---

## Ekonomi (5 collections)

| Collection | Syfte | WORM / update | Merge? |
|------------|-------|---------------|--------|
| `economy_profiles` | Användarprofil (lön, arbetstid) | owner update | nej |
| `economy_ledger` | Transaktionsposter | create + begränsad update | nej |
| `economy_fixed_bills` | Fasta räkningar | owner CRUD | nej |
| `economy_impulse_queue` | Impulsparkering (ADHD) | owner CRUD | nej |
| `transactions` | Legacy/enkel transaktionslogg (hub) | create-only | **ev. senare** — separat från ledger i spec |

**Notering:** [`Economy-SPEC.md`](../specs/modules/Ekonomi-SPEC.md) beskriver domänen. Sammanslagning av `transactions` + `economy_ledger` är **inte** P0 — kräver PMIR och migreringsscript.

---

## Permanent minne (MUST NOT merge/purge)

Append-only enligt [`.context/arkiv-minne.md`](../../.context/arkiv-minne.md):

- `reality_vault`, `journal`, `children_logs`, `dossier_snapshots`, `checkins`, `kampspar`, `kb_docs`

---

## Rekommendation

1. **Gör inget** med collections i denna audit utan PMIR.
2. Om ekonomi-rationalisering önskas senare: skriv separat eval + migreringsskelett — **inte** auto-merge.
3. Chatten "deduplicering"-prompt → **ignorera**; denna tabell är kanon.
