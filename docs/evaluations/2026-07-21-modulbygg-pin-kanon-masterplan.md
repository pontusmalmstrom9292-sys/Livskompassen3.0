# Masterplan: Modulbygg / pin-kanon (före build)

**Datum:** 2026-07-21  
**Roll:** Intern arkitektur (Cursor · Composer)  
**Status:** GODKÄND v2.2 — Pontus OK 2026-07-21 («godkänn v2.2 kör hela planen»). W0 docs pågår; ingen feature-UI än.  
**Kod:** Ingen. Endast masterplan.

**Källa:** Readonly-analys 2026-07-21 (dual pins, `pinnedToHome`, lock-after-build).  
**Relaterat:** `.context/module-lock-register.json` (`MOD-WIDGET`, `MOD-VARD-PLAN`) · `firestore.rules` `user_widgets` · DAD Hem (`HomeLayoutA`).

---

## 0. Dom

Nuvarande approach har **tre strukturella hål** som måste in i planen innan unlock/build:

1. **Två pin-system utan kanon** — Planering localStorage vs Firestore `user_widgets`.
2. **`pinnedToHome` rules-låst men aldrig monterad på Hem** — bool skapas alltid `false`; ingen konsument.
3. **«Lock-after-build» saknar användarlås** — repo-`@locked` ≠ soft-lock; `allow delete: if isOwner()` = escape hatch.

**Rekommenderad default (låst i denna plan):**

> Bygg på `user_widgets` + typ-registry + **en** Hem-slot-adapter.  
> Planering `?tab=bygg` = skalfönster (MOD-VARD-PLAN).  
> Planering-localStorage-pins = **migrate-or-freeze**.  
> Fri canvas = post-lock via Design Freeport — **inte** MVP.  
> Lock-after-build = soft-lock + frozen routes/API + delete-policy — **inte** bara `@locked`-header.

**MUST NOT starta build** utan: unlock-docs + PMIR där rules/Hem/DAD rörs + kapacitetsgate (`evolution_hub`) dokumenterad per våg.

---

## 1. Nuläge (verifierat 2026-07-21)

| Gap | Fakta (kod) |
|-----|-------------|
| Dual pins | Planering: `planningModulePinStorage.ts` + `planningPinRegistry.ts` → `PinnedPlaneringModuleSlot`. Widgets: Firestore `user_widgets` → endast `WidgetModulerBoard`. |
| `pinnedToHome` | `WidgetModulerAddForm` sätter alltid `false`. Rules: immutable efter create. **Ingen** Hem-konsument. |
| MOD-relation | `MOD-WIDGET` = locked (`widgets/**` + Android widgets). `MOD-VARD-PLAN` = locked (`planning/**`). `tab=bygg` finns **inte** i `PlaneringTab`. |
| Hem-mounts | `HomeLayoutA` monterar Planering-slot (`hem.brass.below-grid`). Samma slot i Familjen/Valv/Ekonomi/Dagbok/MåBra. **Ingen** `user_widgets`-mount. |
| Chameleon vs canvas | `PlaneringInputSuperModule` = 3 input-modes. Fri canvas finns inte i prod; Design Freeport = sandbox. |
| Type freeze | Rules whitelist: `countdown` \| `checklist` \| `linked_savings` \| `quick_note`. |
| Delete | `user_widgets`: `allow delete: if isOwner()`. |

---

## 2. Pin-kanon (single source of truth)

### 2.1 Beslut

| Yta | Roll | Livscykel |
|-----|------|-----------|
| Firestore `user_widgets` | **Kanon** — synkad modul-instans (create/config/pin-placement) | Lever; utökas via registry + rules-PMIR |
| Planering localStorage-pins | **Legacy** — placement för list/note tills migrerade | Freeze API; ingen ny feature; migrate-våg → sedan read-only/compat |

### 2.2 Migrationsvåg (obligatorisk rad i varje build-plan)

1. Inventera aktiva Planering-pins per `PlaneringPinTargetId`.
2. Mappa list/note → `UserWidget` typ (eller «behåll legacy tills W*»).
3. Cutover: nya pins bara via `user_widgets` + placement.
4. Compat-lager: `PinnedPlaneringModuleSlot` läser legacy **eller** adapter — ingen dubbel UX för användaren.
5. Freeze: sluta utöka `planningModulePinStorage`.

**MUST NOT:** «båda lever för alltid» utan migrate-deadline i planen.

---

## 3. Placement-modell (`pinnedToHome` → `slotId`)

### 3.1 Semantikbyte

| Nu | Mål |
|----|-----|
| `pinnedToHome: bool` (död; create alltid false; immutable) | `slotId` (eller ekvivalent) återanvänder `PlaneringPinTargetId` / registry |
| Bool utan Hem-mount | Hem läser placement via **en** adapter-slot |

### 3.2 Hem-kontrakt

- Ny: `UserWidgetHomeSlot` **bredvid eller inuti** befintligt `PinnedPlaneringModuleSlot`-kontrakt.
- **Inte** fri canvas i `HomeLayoutA`.
- Bevara DAD-ordning: Reflection → Kompass → övrigt.
- Max **en** extra mount-rad under `hem.brass.below-grid` utan redesign av grid.

### 3.3 PMIR

Ändring av `user_widgets`-schema / immutability / typ-whitelist = **firestore.rules PMIR** + Pontus OK före deploy.

---

## 4. Pin-mutation (inte hoppas på dold UI)

### 4.1 Idag

- Update: endast `config` + `updatedAt`.
- Create: sätter pin-fält.
- Delete: tar bort allt (full escape).

### 4.2 Mål (lock-after-build)

| Operation | Krav |
|-----------|------|
| `pin` / `unpin` / `reorder` | **Explicit** — callable **eller** delete+recreate med audit — inte klient-update av frysta fält bakom UI |
| Soft-lock | `status: active \| archived` |
| Delete i UI | Döljs efter «klart»; prefer archive |
| Rules (mål) | Efter archive: blockera hård delete (eller grace) — UI-only räcker **inte** |

---

## 5. MOD-split (undvik MOD-BYGG)

| Modul | Äger | Unlock när |
|-------|------|------------|
| **MOD-WIDGET** | Motor: data, render, typ-registry, `HomeWidgetRenderer`, board, Android WH8-kontrakt | Feature i widgets/** eller rules/types för UserWidget |
| **MOD-VARD-PLAN** | Skal: `?tab=bygg` / «Mina moduler»-hub under Planering | Entry/tab i planning/** |
| **Ingen MOD-BYGG** | — | Skapa **inte** om den duplicerar `UserWidget` |

**Risk att styra:** dubbel unlock = scope-explosion. Planera vågor så motor och skal inte kräver parallell full unlock utan smal scope per unlock-doc.

---

## 6. Vågor (före/under/efter lock)

| Våg | Namn | In-scope | Out-of-scope | Unlock |
|-----|------|----------|--------------|--------|
| **W0** | Kanon + PMIR-utkast | Denna masterplan; schema-utkast (`slotId`/`status`); delete-policy; kapacitetsgate | Feature-UI | Ingen |
| **W1** | Mallar + typ-switch | Chameleon/delegate: countdown/checklist/… inom whitelist; `HomeWidgetRenderer` registry-map (additiv) | Fri canvas på Hem | Smal MOD-WIDGET (± rules PMIR) |
| **W2** | Hem-adapter | `UserWidgetHomeSlot`; placement create-path; DAD orörd | Grid-omstrukturering | MOD-WIDGET + ev. Hem-touch (dokumentera DAD) |
| **W3** | Planering-skal | `?tab=bygg` panel; länkar till motor | Ny MOD-BYGG; ersätta Handling/Fokus | MOD-VARD-PLAN |
| **W4** | Migrate legacy pins | localStorage → Firestore / freeze | Nya localStorage-API:er | Båda MOD om slot-API rörs |
| **W5+** | Soft-lock + Freeport canvas | Archive/delete-policy i rules; canvas i sandbox → promote | Canvas som Hem-hero | PMIR rules + unlock vid promote |

**Strikt:** Våg *n* startar inte innan *n−1* har DoD + re-lock GO (där unlock användes).

### Lock-våg-kontrakt (alla feature-vågor)

```
unlock-doc (approved: yes) + register developing
  → feature (additiv)
  → smoke: widgets + smoke:locked-ux (+ smoke:design-modules vid UI)
  → lock_module.mjs
  → ingen borttagning av entry/route/mall
```

**Post-lock:** endast additiv polish (CSS, copy, progressive disclosure) utan ny unlock — annars ny unlock-doc.

---

## 7. Soft-lock för användarmoduler

Lock-after-build ≠ bara `@locked` i repo.

| Lager | Krav |
|-------|------|
| Repo | `@locked` + module-lock-register efter våg |
| Domän | `status: active \| archived` på UserWidget |
| UI | Ingen trash efter «klart»; archive-first |
| Rules | Mål: ingen hård delete efter archive (eller time-boxed grace) |
| Routes/API | Frozen: `/widget/moduler`, save/update/delete-kontrakt, slot props |

---

## 8. SchemaVersion + typ-registry

- Frys `UserWidget.type`-whitelist i `firestore.rules`.
- Ny typ = (1) registry-entry (2) rules-PMIR (3) smoke-assert.
- `HomeWidgetRenderer`: switch → **registry-map** så polish-vågor inte kräver full board-unlock.
- Ny mall utan rules-deploy = prod 403 — dokumentera i varje typ-PR.

---

## 9. Kapacitetsgate

Builder ska respektera `evolution_hub`:

| Nivå (antagande — verifiera mot kod vid W1) | UI |
|-----------------------------------------------|-----|
| 1 | Dölj canvas/bygg; visa befintliga mallar/pins endast |
| 2+ | Mallar + bygg-entry |

**MUST NOT:** ADHD-gate och «bygg egen modul» samtidigt utan nivå-gate.

*(Om nivå-trösklar skiljer sig i kod: uppdatera denna tabell i W0-DoD — gissa inte i feature-PR.)*

---

## 10. Riskregister (måste finnas i planen)

| ID | Risk | Mitigering i denna plan |
|----|------|-------------------------|
| R1 | Delete kringgår «låst modul» | Soft-lock + rules delete-policy (W5+) |
| R2 | Dual-pin kognitiv split | Pin-kanon + migrate (W4); ingen evig dual-UX |
| R3 | `pinnedToHome`-fälla | Placement `slotId` + Hem-adapter (W2); bool avvecklas |
| R4 | Dubbel unlock scope-explosion | MOD-split; en unlock-doc per våg med smal glob |
| R5 | HomeLayoutA utan MOD-glob | Max en slot-mount; ingen DAD-omstrukturering; dokumentera i unlock |
| R6 | Offline + pin resiliens | `user_widgets` offline-allowlist = kanon; legacy local = migrate |
| R7 | Type freeze vs produkt | Registry + rules-PMIR + smoke per ny typ |
| R8 | Android WH8 ≠ Hem-pin | Deep-link-kontrakt fryst; Hem-slot separat förväntanscopy |
| R9 | Fri canvas vs Locked UX / DAD | Canvas = Freeport tills W5+; aldrig Hem-hero i MVP |
| R10 | Cross-lock slot-API | `PinnedPlaneringModuleSlot` props frysta; ändring = multi-modul unlock |

---

## 11. Extension points

### Får växa (additivt / smal unlock)

| Fil / yta | Roll |
|-----------|------|
| `HomeWidgetRenderer.tsx` | Nya case/registry-entries |
| `WidgetModulerAddForm.tsx` | Nya mallar inom whitelist |
| `WidgetShell.css` | Polish |
| `planningPinRegistry.ts` | Nya `targetId` (additiv enum) |
| Ny: `UserWidgetHomeSlot` / adapter | Hem-mount utan DAD-rivning |
| Ny: `?tab=bygg` under Planering | Entry — MOD-VARD-PLAN unlock |
| `scripts/smoke_widgets.mjs` | Nya asserts |
| Design Freeport / sandbox | Canvas-experiment |

### Frozen API (unlock + PMIR)

| Fil / yta | Varför |
|-----------|--------|
| `firestore.rules` → `user_widgets` | Schema, immutability, typ-whitelist, delete |
| `UserWidget` i `firestore.ts` types | Kontrakt |
| `saveUserWidget` / `updateUserWidgetConfig` / `deleteUserWidget` | Skrivytor |
| `WidgetModulerPage` `/widget/moduler` | Locked entry |
| `PinnedPlaneringModuleSlot` props (`targetId`, `contextKey`) | Multi-zon mount |
| `HomeLayoutA` hero/ordning | DAD / locked UX |
| `PlaneringPage` Handling/Fokus/Inkorg | MOD-VARD-PLAN |
| `PlaneringInputSuperModule` mode-lista (utan ny mode) | Chameleon-kanon |
| Fyren / dock / chrome | MOD-CORE-* |
| Android `ModulerWidgetProvider` deep-link | WH8 låst |

### Hybrid

- **`planningModulePinStorage`:** fryst legacy — migrera, utöka inte.
- **`WidgetModulerBoard`:** fler typer OK; **inte** fri drag-canvas utan unlock-våg.
- **`HomeLayoutA` slot-rad:** en extra mount OK; ingen grid-redesign.

---

## 12. Definition of Done — W0 (denna plan)

- [x] Masterplan-eval filad: `docs/evaluations/2026-07-21-modulbygg-pin-kanon-masterplan.md`
- [x] Pontus OK på default (§0) och vågordning (§6) — **2026-07-21** masterplan v2.2 «godkänn v2.2 kör hela planen»
- [x] Nästa steg valt: **båda** — schema-PMIR + unlock W1/W3 (docs):
  - Contract: `docs/specs/user-widgets-contract-v1.md`
  - PMIR: `docs/evaluations/2026-07-21-pmir-user-widgets-slotid-status.md`
  - Unlock W1: `docs/evaluations/2026-07-21-unlock-MOD-WIDGET-egna-moduler-w1.md`
  - Unlock W3: `docs/evaluations/2026-07-21-unlock-MOD-VARD-PLAN-tab-bygg-w3.md`
- [x] Ingen feature-PR mergad före W0-OK (W0 = docs only)

---

## 13. Nästa enda steg (efter Pontus OK)

**W0 docs levererade (2026-07-21):** A + B ovan — unlock W1/W3 + schema-PMIR + frozen contract.

**Nästa (feature, inte W0):** W1 kod under unlock MOD-WIDGET — types/CRUD/registry/presets.  
Rules-deploy först efter separat «OK deploy». Ingen Hem-canvas i W1.

---

*W0 = docs/evals only. Feature-UI startar i W1+.*
