# Barnporten

**Route (barn):** `/barnporten` (PWA) · **Förälder:** `/familjen?tab=barnporten`  
**Spec:** [`docs/design/BARNPORTEN-SPEC.md`](../../docs/design/BARNPORTEN-SPEC.md)  
**Låst:** `.context/locked-ux-features.md` §7 · Inkorg→Valv §7b

## Syfte

Barnens egen hub på telefon/surfplatta: prata av sig, skriva till förälder, humör, privat dagbok, valfri självövning. **Egen** barn-Orkester. Valv endast via förälder HITL.

## Data

- Primär: `children_logs` (`authorRole: child`, `channel: barnporten`)
- Valv: `promoteChildLogToVault` → `reality_vault` + `sourceRef`
- **Ej** Kunskap-RAG, **ej** Hamn/BIFF i barn-UI

## Kod (plan)

`src/modules/barnporten/` · `barnportenAgents.ts`

## Status

Design + mockups + smoke lock **klart**. Implementation P1 öppen.
