# valv_chatt

> Forensiskt sökverktyg inuti Verklighetsvalvet — frågor mot WORM `reality_vault`.  
> **Locked UX:** flik `vaultTab=sok` bakom Valv-gate (`.context/locked-ux-features.md` §2b).

## Syfte

Sök med källhänvisningar (Sannings-Analytikern). Zero Footprint: ingen sparad chatt. **Skild från Kunskapsvalvet** (`kampspar` + `kb_docs`).

## Route och ingång

| | |
|---|---|
| **Route** | `/valvet?vaultTab=sok` (efter biometri/WebAuthn) |
| **Legacy** | `/dagbok?tab=bevis` → redirect till `/valvet` |
| **AuthGate** | ja |
| **Valv unlock** | ja |
| **Dock** | ej i dock |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/ValvChatPanel.tsx` | Fråga, svar, källor |
| `api/valvChatService.ts` | `valvChatQuery` wrapper |
| `hooks/useValvChatSession.ts` | Ephemeral state + cleanup |

**Förälder-UI:** `vault/components/zones/ValvSamlaZone.tsx` (flik Sök)

## Data

- **Läser:** `reality_vault` (exkl. `vävaren_metadata`)
- **Silo:** Valv only — aldrig `kampspar` / `kb_docs`
