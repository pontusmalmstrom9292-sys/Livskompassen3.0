# Pre-Merge Impact Report — Max-byggplan (2026-05-29)

**Trigger:** Implementering Våg 0–3 enligt max-byggplan  
**Gren:** `main` (lokal commit, ej push utan `godkänn merge`)

## Följer med

| Område | Ändring |
|--------|---------|
| Chrome ember | `DockHubBand` + `AppHeaderBar` → `headerPanelStyle.ts`; dock CSS ember |
| Projekt P2 | Bild-upload, `/projekt/ny`, `/projekt/regler`, widget sheet |
| Barnporten P1 | `/barnporten`, Familjen-flik, manifest, HITL |
| Inkast fas 3 | Genväg inkorg → projekt (ej Gmail OAuth) |
| Storage | `project_media/` rules + `uploadProjectImage` |

## Försvinner / risk

- Ingen Locked UX borttagen
- `storage.rules` + `storage.rules` deploy krävs för bilder i prod
- Barnporten delar förälder-auth på barnenhet (P1-begränsning)

## Regelanalys

| Regel | PASS |
|-------|------|
| Tre silos | PASS — inga cross-RAG |
| Locked UX | `smoke:locked-ux` PASS |
| firestore.rules | **Ej ändrad** — project_blocks oförändrade fält |
| Sacred | Oförändrat |

## Smoke (agent)

- `smoke:design-modules` PASS
- `smoke:locked-icons` PASS
- `smoke:locked-ux` PASS
- `npm run build` PASS

## Manuellt (användaren)

- `docs/SMOKE_CHECKLIST.md` #1, #2, #18
- Deploy `storage.rules` vid Firebase deploy
- `npm run cap:sync` efter ikoner

## Rekommendation

**Godkänn commit** på main. Push/deploy separat.
