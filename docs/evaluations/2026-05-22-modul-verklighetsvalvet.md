# Modul — verklighetsvalvet

**Route:** `/dagbok?tab=bevis` (redirect `/valv`) | **Collections:** `reality_vault` | **Callable:** `valvChatQuery` (via valv_chatt), `weaveJournalEntry`

## PASS

- WORM create-only i `firestore.rules` L33–37
- VaultLogList + VaultPage med Firestore persistens
- Fyren long-press 3s gate (Shield)
- Spara som bevis från Barnen (`sourceRef`)
- module_plan + README synkade med kod

## GAP

- Client PIN/WebAuthn gate — `VaultPage.tsx` L19–38; `VITE_VAULT_PIN` dev bypass
- README säger "deploy saknas" — **föråldrat** (G1 done, smoke:valv PASS)
- PDF export per post — planerad, ej MVP

## Sacred / säkerhet

**Sacred:** Verklighetsvalvet + Sanningens Sköld. WORM **PASS**; gate **GAP** (Lager 4).

## Rekommenderat

Manuell smoke #2, #11. Server-side vault unlock (pass 2).
