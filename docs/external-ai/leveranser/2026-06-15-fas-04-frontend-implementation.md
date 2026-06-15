# PHASE-04 — Frontend upload (Cursor-implementering)

**Datum:** 2026-06-15  
**CHECKPOINT:** CP-4 (efter smoke)  
**ChatBox-leverans:** `2026-06-15-fas-04-frontend.md` — **ej applicerbar** (duplicerade delegate-stubs, farlig InkastDirectPanel-stub, ingen CapturePanel-kod)

## Genomfört i Cursor

| Punkt | Fil | Status |
|-------|-----|--------|
| Text + filer + AI-preview | `CapturePanel.tsx` | ✅ |
| `allowFiles` / `maxFiles` via router | `CaptureSuperModule.tsx` | ✅ |
| Delegates | Oförändrade (redan `variant=…`) | ✅ keep |
| InkastDirectPanel | `@deprecated`-kommentar, full funktion kvar | ✅ |
| ChatBox stubs | CaptureSuperModule, delegates, stub DirectPanel | ❌ hoppade över |

## Verify

```bash
npm run build
npm run smoke:locked-ux
npm run smoke:inkast
```

## Nästa

Migration steg 2: Valv `InkastDirectPanel` → `CapturePanel` när smoke verifierat i prod.
