# Planering pins — migrate-or-freeze (W4)

**Datum:** 2026-07-21  
**Modul:** MOD-VARD-PLAN · localStorage pins  
**Status:** FREEZE

## Beslut

`planningModulePinStorage.ts` är **fryst**:

- Inga nya API:er (create/update/helpers) på localStorage-ytan.
- Ny placement för egna moduler = `user_widgets.slotId` (Firestore), inte dual-pin.
- Befintliga Planering-pins (list/note) får leva tills explicit migrate-våg.

## Migrate (senare, ej denna våg)

1. Inventera localStorage-pins per användare.
2. Mappa `targetId` → `slotId` där innehållstyp stöds av `user_widgets`.
3. Soft-deprecate localStorage — behåll read-path tills cutover.

## MUST NOT

- Bygga parallell pin-motor.
- Skriva Hem-canvas redesign.

*One-pager — kodkommentar i `planningModulePinStorage.ts` speglar detta.*
