# M3.0-C Phase 2 — deploy godkänd (Pontus 2026-06-19)

**Status:** **GO** — kod + rules i `main` · deploy `firestore:rules` kvar (Pontus terminal)  
**PMIR:** [`2026-06-18-mabra-3.0-c-phase2-pmir.md`](./2026-06-18-mabra-3.0-c-phase2-pmir.md) (godkänd våg 22.2)  
**Fas 22 våg:** 22.3 (tidigare SKIP i autorun — **återöppnad** efter explicit godkännande)

## Pontus-gate

Godkänt: *"Godkänn mc3"* (M3.0-C) — deploy `firestore:rules` för `mabra_nutrition_log`.

## Leverans (redan i repo)

| Del | Fil / path |
|-----|------------|
| UI | `MabraNutritionPanel` → `MabraToolView` (`/vardagen?tab=mabra`) |
| Cloud sync | `mabraNutritionLogService.ts` |
| Anon fallback | `mabraNutritionDayStorage.ts` |
| Rules | `firestore.rules` — `mabra_nutrition_log/{uid}/days/{dateKey}` |
| Offline policy | `offlineWritePolicy.ts` + `masterManifest.ts` |
| Kapacitet | Nivå 2+ protein/omega/måltid · nivå 3 prepp · coach panel |

**Schema (mutable, ej WORM):** `userId`, `ownerId`, `dateKey`, `waterGlasses` (0–12), `proteinMarked`, `omega3Marked`, `mealMarked`, `updatedAt`. **FÖRBJUDET:** `sourceRef`, vault-fält, barn/valv-koppling.

## Smoke (agent 2026-06-19)

| Kommando | Resultat |
|----------|----------|
| `smoke:mabra` | **PASS** static — inkl. `M3.0-C Phase 2 nutrition static guards OK` |
| `smoke:modulvaljare` | **PASS** |
| `smoke:innehall` | **PASS** |
| `smoke:mabra` live (Firestore write) | **SKIP** — saknar `.env` i cloud-agent |

## Deploy (Pontus — projektrot)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
firebase use gen-lang-client-0481875058
firebase deploy --only firestore:rules
```

Efter deploy — USER-test:

1. `/vardagen?tab=mabra` → Näring & vätska  
2. Öka vatten + markera protein (inloggad)  
3. Hard refresh → värden kvar (Firestore sync)  
4. Bekräfta: ingen export till Valv / ingen `reality_vault`-post

Valfri live-smoke lokalt: `npm run smoke:mabra` (kräver `.env`).

## MUST NOT (efterlevnad)

- Cross-RAG · auto-promote till Valv · WORM på nutrition collection  
- `delete` på nutrition-dagar (rules: `allow delete: if false`)
