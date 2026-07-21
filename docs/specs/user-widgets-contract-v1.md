# User Widgets Contract v1 (Frozen API)

**Datum:** 2026-07-21  
**Status:** FROZEN (W0) — additiv utökning endast  
**Källa:** Masterplan v2.2 «Egna moduler» · Pontus OK 2026-07-21 («godkänn v2.2 kör hela planen»)  
**Kodreferens:** `src/modules/core/types/firestore.ts` → `UserWidget` / `UserWidgetRow`  
**Rules:** `firestore.rules` → `match /user_widgets/{docId}`  
**Placement:** `PlaneringPinTargetId` i `planningPinRegistry.ts`

---

## 1. Syfte

Ett fryst kontrakt för användarskapade moduler (`user_widgets`) så W1+ kan bygga motor/skal utan schema-drift.  
**Ingen feature-UI i W0** — endast dokumentation + PMIR/unlock.

---

## 2. Collection

| Nyckel | Värde |
|--------|--------|
| Firestore collection | `user_widgets` (`FIRESTORE_COLLECTIONS.user_widgets`) |
| Doc id | Auto-id (`UserWidgetRow.id`) |
| Owner | `userId` + `ownerId` = auth uid (immutable efter create) |

---

## 3. UserWidget fields (v1 + W0-tillägg)

### 3.1 Befintliga fält (kod idag)

| Fält | Typ | Immutability | Kommentar |
|------|-----|--------------|-----------|
| `userId` | string | Immutable | Owner |
| `ownerId` | string | Immutable | Owner (parity) |
| `type` | enum | Immutable efter create | MVP whitelist — se §4 |
| `title` | string (1–100) | **Mutable** (W0 PMIR) | Idag rules-låst; PMIR öppnar |
| `pinnedToHome` | boolean | Legacy | Avvecklas till förmån för `slotId`; behålls för compat tills W2 cutover |
| `order` | int | **Mutable** (W0 PMIR) | Explicit reorder |
| `config` | map | Mutable | Typ-specifik — se §5 |
| `createdAt` | IsoDateTime | Immutable | Create-only |

### 3.2 W0-tillägg (schema target — kräver rules PMIR före deploy)

| Fält | Typ | Krav | Kommentar |
|------|-----|------|-----------|
| `slotId` | `PlaneringPinTargetId` \| null | Optional | Placement — ersätter semantiken i `pinnedToHome` |
| `status` | `'active' \| 'archived'` | Required (default `active`) | Soft-lock |
| `schemaVersion` | string \| int | Required (start: `1`) | Migrationsgate |
| `stylePreset` | string \| null | Optional | Visuell preset — se §6 |
| `updatedAt` | IsoDateTime | Mutable | Alltid tillåten vid update |

**Additive-only:** nya fält får läggas till via ny contract-revision + rules PMIR.  
**MUST NOT:** ta bort fält, byta enum-semantik, eller bryta befintliga docs utan migrate-våg.

---

## 4. MVP types (frozen whitelist)

```
countdown | checklist | linked_savings | quick_note
```

| Type | Config-nycklar | UI-roll |
|------|----------------|---------|
| `countdown` | `targetDate?: string` (YYYY-MM-DD) | Dagar kvar |
| `checklist` | `checklistItems?: { id; text; done }[]` | Krysslista |
| `linked_savings` | `savingsGoalId?: string` | Länk till Ekonomi-sparmål |
| `quick_note` | `noteText?: string` | Kort anteckning |

**Ny typ:** (1) registry-entry (2) rules whitelist PMIR (3) smoke-assert (4) contract bump.  
**Ingen typ utanför whitelist i create** — rules avvisar.

---

## 5. Config validation (mål: `isValidUserWidgetConfig`)

Rules ska validera `config` per `type` (PMIR § `isValidUserWidgetConfig`):

- `countdown` → `targetDate` saknas **eller** string (datumformat klient; rules: string om present)
- `checklist` → `checklistItems` saknas **eller** list of maps med `id`/`text`/`done`
- `linked_savings` → `savingsGoalId` saknas **eller** string
- `quick_note` → `noteText` saknas **eller** string (maxlängd klient; rules: string om present)
- Okända nycklar i `config`: tillåtna som additive soft (eller strict map keys i senare revision — default W0: **type-gate, inte strict-key-ban**)

---

## 6. stylePreset (optional)

| Regel | Värde |
|-------|--------|
| Presence | Optional; null/absent = default shell |
| Semantik | Namngiven visuell preset (t.ex. `calm`, `compact`, `gold-accent`) — **inte** fri CSS |
| Mutation | Tillåten via update (PMIR) |
| Scope | Render i `HomeWidgetRenderer` / WidgetModuler* — ingen DAD-layoutändring |

Whitelist av presets låses i W1 registry (additiv). Okänd preset → fallback default.

---

## 7. Placement — `slotId` (`PlaneringPinTargetId`)

Återanvänder registry:

```
hem.brass.below-grid
familjen.barnfokus | familjen.livslogg | familjen.hamn
valv.logga | valv.kunskapsbank
vardagen.ekonomi
hjartat.dagbok
mabra.hub
```

| Operation | Kontrakt |
|-----------|----------|
| pin | Sätt `slotId` till giltig `PlaneringPinTargetId` (+ ev. `pinnedToHome: true` under compat) |
| unpin | Sätt `slotId` till null / clear (+ `pinnedToHome: false` under compat) |
| reorder | Uppdatera `order` (int) — **explicit**, inte implicit via delete+create |

**MUST:** pin / unpin / reorder är **explicit** API-ytor (callable **eller** klient-update av tillåtna keys).  
**MUST NOT:** hoppas på dold UI som muterar frysta fält bakom ryggen.

Legacy: `pinnedToHome` bool lever tills W2 Hem-adapter cutover; kanon för ny kod = `slotId`.

---

## 8. Soft-lock — `status`

| Status | Betydelse | UI | Rules (mål) |
|--------|-----------|-----|-------------|
| `active` | Synlig, redigerbar | Normal board | Full update per PMIR |
| `archived` | Soft-lock / dold | Ingen trash; archive-first | Blockera hård delete (eller grace) — se PMIR |

**Delete-policy:** UI prefererar archive. Hård `delete` = escape hatch tills rules enforce archive-first (W5+ / denna PMIR-målbild).

---

## 9. Update allowlist (mål — se PMIR)

Tillåtna `affectedKeys` vid update (utöver immutable identity):

```
title | order | pinnedToHome OR slotId | status | schemaVersion | stylePreset | config | updatedAt
```

**Immutable alltid:** `userId`, `ownerId`, `type`, `createdAt`.

---

## 10. Storage (media — PMIR)

| Path | MIME | Max |
|------|------|-----|
| `module_media/{uid}/...` | `image/jpeg`, `image/png`, `image/webp` | 2 MB |

Ingen WORM-krav på module_media (ej Valv-evidens). Owner-scoped read/create; update/delete policy enligt storage PMIR.

---

## 11. Frozen API surface (kod)

| Yta | Roll |
|-----|------|
| `UserWidget` / `UserWidgetRow` | Types |
| `saveUserWidget` / `updateUserWidgetConfig` / `deleteUserWidget` / `subscribeUserWidgets` | CRUD |
| `firestore.rules` `user_widgets` | AuthZ + schema |
| `/widget/moduler` + `WidgetModuler*` | Entry (MOD-WIDGET) |
| `HomeWidgetRenderer` | Render switch → registry-map (W1) |
| `PlaneringPinTargetId` | Placement enum |

**Out of contract (W0):** Fyren, record/ingest, DAD-grid redesign, fri canvas på Hem.

---

## 12. Revisionspolicy

| Ändring | Krav |
|---------|------|
| Nytt fält (additivt) | Contract bump + types + rules PMIR + smoke |
| Ny `type` | §4 process |
| Ny `slotId` | Additiv enum i `planningPinRegistry` (+ ev. multi-MOD unlock) |
| Breaking | Migrate-våg + Pontus OK — **inte** silent |

**schemaVersion:** start `1`. Bump vid breaking config/type semantik.

---

*SLUT — docs only. Ingen feature-kod i denna fil.*
