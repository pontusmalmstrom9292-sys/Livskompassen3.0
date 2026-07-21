# PMIR — user_widgets: slotId / status / soft-lock / storage

**Datum:** 2026-07-21  
**Typ:** firestore.rules (+ storage.rules path)  
**Modul:** MOD-WIDGET (schema) · masterplan v2.2 «Egna moduler» W0  
**Contract:** [`docs/specs/user-widgets-contract-v1.md`](../specs/user-widgets-contract-v1.md)  
**approved: yes**

**Pontus OK:** 2026-07-21 — masterplan v2.2 «godkänn v2.2 kör hela planen».

**Deploy:** SKIP tills explicit «OK deploy rules» — denna fil = godkänd PMIR-text, inte auto-deploy.

---

## 1. Varför

Nuvarande `user_widgets`-rules låser `title`, `pinnedToHome`, `order` efter create och tillåter endast `config` + `updatedAt`.  
Det blockerar pin/unpin/reorder, soft-lock (`status`), placement (`slotId`) och style presets.  
`allow delete: if isOwner()` = escape hatch utan archive-first.

---

## 2. Nuläge (verifierat)

```
match /user_widgets/{docId} {
  allow update: ... affectedKeys().hasOnly(['config', 'updatedAt']);
  allow delete: if isOwner();
}
```

Types: `UserWidget` i `src/modules/core/types/firestore.ts` — saknar ännu `slotId` / `status` / `schemaVersion` / `stylePreset` (läggs i W1+ kod efter denna PMIR).

---

## 3. Beslut (godkänt)

### R1 — Update allowlist

Tillåt update av:

| Key | Syfte |
|-----|--------|
| `title` | Rename |
| `order` | Explicit reorder |
| `pinnedToHome` **OR** `slotId` | Placement (compat bool **eller** kanon slot) |
| `status` | Soft-lock `active` \| `archived` |
| `schemaVersion` | Migrationsgate |
| `stylePreset` | Optional visuell preset |
| `config` | Typ-specifik payload |
| `updatedAt` | Timestamp |

**Immutable:** `userId`, `ownerId`, `type`, `createdAt`.

### R2 — `isValidUserWidgetConfig`

Ny helper `isValidUserWidgetConfig()` som gate:ar `config` mot `type` whitelist:

- `countdown` | `checklist` | `linked_savings` | `quick_note`
- Se contract §5.

Anropas på create **och** update när `config` ingår.

### R3 — Delete-policy: archive-first

| Steg | Policy |
|------|--------|
| UI | Archive (`status: archived`) före hard delete |
| Rules mål | `allow delete` endast om `resource.data.status == 'archived'` **eller** time-boxed grace (dokumentera i PR) |
| Create | Default `status: 'active'` |

### R4 — Storage path

| Path | MIME | Max |
|------|------|-----|
| `module_media/{uid}/...` | `image/jpeg`, `image/png`, `image/webp` | 2 MB |

Owner-scoped. Inte Valv/WORM. Lägg match i `storage.rules` i samma rules-PR (eller tätt kopplad).

### R5 — Additive-only

Inga breaking removals. `pinnedToHome` får leva under migrate; ny kod använder `slotId`.

---

## 4. Safeguards

- WORM/tre silos: oförändrat (user_widgets ≠ vault).
- Typ-whitelist oförändrad tills separat typ-PMIR.
- Ingen Hem/DAD-kod i denna PMIR.
- Kapacitetsgate (`evolution_hub`) = produkt/UI — inte rules.

---

## 5. Implementation checklist (nästa kodvåg — ej W0)

- [ ] Types: utöka `UserWidget` per contract v1
- [ ] `firestore.rules`: update allowlist + `isValidUserWidgetConfig` + archive-first delete
- [ ] `storage.rules`: `module_media/{uid}/**` MIME + 2MB
- [ ] Klient: pin/unpin/reorder explicita helpers
- [ ] Smoke: assert rules keys + type gate
- [ ] `firebase deploy --only firestore:rules,storage` — **endast efter Pontus «OK deploy»**

---

## 6. Risk

| Risk | Mitigering |
|------|------------|
| Klient skriver `slotId` före rules-deploy | Feature-flag / feature-våg efter deploy |
| Hard delete kvar till rules landar | UI archive-first redan i W1+; rules enforce i samma PR |
| Dual pin (`pinnedToHome` + `slotId`) | Compat-lager tills W2 cutover |

---

*SLUT — PMIR docs only. Ingen rules-deploy i W0.*
