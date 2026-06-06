# Barnporten

**Route (barn):** `/barnporten` (PWA) · **Förälder:** `/familjen?tab=barnporten`  
**Kanonisk kod:** `src/modules/features/onboarding/barnporten/`  
**Spec:** [`docs/design/BARNPORTEN-SPEC.md`](../../docs/design/BARNPORTEN-SPEC.md)  
**Låst:** `.context/locked-ux-features.md` §7 · Inkorg→Valv §7b

## Syfte

Barnens egen hub på telefon/surfplatta: prata av sig, skriva till förälder, humör, privat dagbok, valfri självövning. **Egen** barn-Orkester. Valv endast via förälder HITL.

## Data

- Primär: `children_logs` (`authorRole: child`, `channel: barnporten`)
- Valv: `BarnportenInboxPanel` + `SaveAsEvidencePrompt` → `reality_vault` + `sourceRef`
- **Ej** Kunskap-RAG, **ej** Hamn/BIFF i barn-UI

## Kod

| Path | Roll |
|------|------|
| `components/BarnportenPage.tsx` | Barn-PWA hub |
| `components/BarnportenInboxPanel.tsx` | Förälder inkorg → Valv HITL |
| `constants/barnportenAgents.ts` | Egen barn-Orkester |
| `api/saveBarnportenLog.ts` | WORM write |

## Status

| Klart | Planerat |
|-------|----------|
| Page, agents registry, inbox HITL, offline queue, smoke lock | Full CB1–CB4 widget polish |

Kod: `src/modules/features/onboarding/barnporten/` · Plan: [`src/modules/features/onboarding/barnporten/module_plan.md`](../../src/modules/features/onboarding/barnporten/module_plan.md)
