# Locked UX Features (låsta — får inte tas bort)

**Status:** Låst 2026-05-25. Ändring kräver explicit produktbeslut.

Dessa är **låsta produktflöden**. Agent och refaktor får inte ta bort, döpa om eller gömma dem utan att uppdatera denna fil och smoke.

---

## Arbetsliv — modulhub (§1, låst)

| | |
|---|---|
| **Route** | `/arbetsliv` · redirect `/stampla` → `?tab=stampla` |
| **Kod** | `src/modules/arbetsliv/components/ArbetslivHubPage.tsx` |
| **Flikar** | Stämpel · Tid & flex · Frånvaro · Lön & spec · Logg |
| **Zon** | `arbetsliv_forensic` (PIN på Frånvaro + Lön) — `vaultZones.ts` |
| **Meny** | `drawerNav.ts` rad **Arbetsliv** mellan Planering och MåBra |
| **Vardagen** | `/vardagen?tab=ekonomi` = veckopeng/matlåda; full stämpel/lön endast i hub |
| **Eval** | `docs/evaluations/2026-05-25-arbetsliv-hub.md` |
| **Smoke** | `npm run smoke:arbetsliv` |

**Får inte:** slå ihop hub med Valv-flik, ta bort menyrad Arbetsliv, eller flytta stämpel/lönespec tillbaka under Valv utan produktbeslut.

---

## Verifiering

```bash
npm run smoke:arbetsliv
```
