# mabra — module plan

## Overview

Måbra-sidan — proaktivt självarbete: KBT, självmedkänsla, värderingar, stressreglering. Eget kluster på hem.

**Route:** `/mabra` · **AuthGate:** ja  
**Canonical:** `.context/modules/mabra_sidan.md`  
**Prompter:** `docs/specs/ai-prompts-moduler-master.md` (Måbra-block)

## Files

| Path | Role |
|------|------|
| `components/MabraPage.tsx` | Shell — EmptyState, placeholder för övningar |

## Status

| Area | Status |
|------|--------|
| Route `/mabra` | **done** |
| MabraPage shell | **done** |
| ClusterGrid kluster | **done** |
| Övningsbibliotek | **planned** |
| Firestore `mabra_*` | **planned** |
| AI-coach callable | **planned** |
| Bro Dagbok / Kompasser | **planned** |

## Avgränsning

- **INTE** Speglar (gaslighting/ACT-skydd)
- **INTE** Dagbok (daglig reflektion)
- **INTE** Hamn (BIFF mot ex)

## Next steps (efter Mabra-SPEC från extern AI)

1. Konsolidera `docs/specs/incoming/Mabra-SPEC.md` → `.context/modules/mabra_sidan.md`
2. Övningskomponenter (progressive disclosure)
3. Datamodell + ev. callable
4. Bro från Dagbok

## Security notes

- AuthGate på route
- Zero Footprint för övningssvar i RAM som default
- Inga prompts i frontend
