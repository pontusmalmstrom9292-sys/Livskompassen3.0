# Inkast increment — Barnen → Valv HITL-bro (2026-06-11)

**Scope:** Smart Inkast roadmap #2 — explicit Valv-promote efter `children_logs`-persist (samma mönster som Barnporten).

## Varför denna slice

- G10 fas 2 levererade granskningskö + status — **klart**
- Barnporten har `SaveAsEvidencePrompt` + `sourceRef` — inkast till Barnen saknade samma bro
- Ingen ny callable — återanvänder `saveVaultLog` + `buildVaultPayloadFromChildLog`
- U1/U3: aldrig auto-promote; användaren väljer explicit

## Levererat

| Yta | Beteende |
|-----|----------|
| `CapturePanel` | Efter persist → Barnen: valfri «Spara som bevis» |
| `InkastDirectPanel` | Samma efter direct submit |
| `InboxReviewQueue` | Efter HITL «→ Barnen»: samma prompt |
| `InkastBarnenValvBridge` | Delad wrapper + `inkastBarnenBridgeProps` |

## Filer

- `src/modules/inkast/components/InkastBarnenValvBridge.tsx` (ny)
- `src/modules/capture/CapturePanel.tsx`
- `src/modules/capture/InkastDirectPanel.tsx`
- `src/modules/inkast/components/InboxReviewQueue.tsx`
- `scripts/smoke_inkast_lockdown.mjs` (statisk guard)

## Smoke

- `npm run build`
- `npm run smoke:locked-ux`
- `npm run smoke:inkast`

## Defer (nästa inkast-slice)

- Dagbok `journal`-routing (UI «Dagbok» → idag `kb_docs` via kunskap)
- Inline HITL i Hem (canonical kvar Valv Samla)
- Gmail OAuth

## USER (valfritt)

1. Inkast text om barn → bekräfta Barnen-silo → se «Spara som bevis?»
2. Valv Samla → granskningskö → «→ Barnen» → samma prompt
3. «Nej, bara livslogg» — inget i Valv

**Deploy:** endast hosting om denna eval mergas — `firebase deploy --only hosting`
