# Inkast increment — Dagbok → Minne weave opt-in (2026-06-11)

**Scope:** Smart Inkast roadmap — valfri G7-bro efter journal-persist (samma opt-in som Dagbok ConfirmStep).

## Varför

- Föregående slice: Dagbok → `journal` routing (`2026-06-11-inkast-dagbok-routing.md`)
- G7 (`journal_woven`) kräver explicit `optIn: true` — aldrig auto-weave
- Återanvänder befintlig `journalWovenToKampspar` callable — ingen ny backend

## Levererat

| Yta | Beteende |
|-----|----------|
| `CapturePanel` | Efter persist → journal: valfri «Spara i Minne» |
| `InkastDirectPanel` | Samma efter direct submit |
| `InboxReviewQueue` | Efter HITL «→ Dagbok»: samma prompt |
| `InkastDagbokWeaveBridge` | Delad wrapper + `inkastDagbokWeaveProps` / `inboxDagbokWeaveProps` |

## Filer

- `src/modules/inkast/components/InkastDagbokWeaveBridge.tsx` (ny)
- `src/modules/capture/CapturePanel.tsx`
- `src/modules/capture/InkastDirectPanel.tsx`
- `src/modules/inkast/components/InboxReviewQueue.tsx`
- `scripts/smoke_inkast_lockdown.mjs`

## Deploy

**Hosting only** (UI-bro; callable `journalWovenToKampspar` redan deployad):

```bash
npm run build && firebase deploy --only hosting
```

## Smoke

- `npm run build`
- `npm run smoke:inkast`
- `npm run smoke:locked-ux`

## USER (manuell)

1. Hem → Inkast → silo **Dagbok** → spara → se «Vill du spara en kort rad i Minne också?»
2. «Ja» → bekräfta i Kunskapsbank (Valv); «Nej» → inget i kampspar
3. Valv Samla → granskningskö → **→ Dagbok** → samma opt-in

## Defer (nästa)

- Inline HITL i Hem (canonical kvar Valv Samla)
- Planering kö-polish
- Gmail OAuth
