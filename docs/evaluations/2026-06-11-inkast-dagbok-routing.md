# Inkast increment — Dagbok → journal (2026-06-11)

**Scope:** Smart Inkast roadmap — UI-silo «Dagbok» sparar till `journal` (Lager 1), inte `kb_docs`.

## Varför

- Föregående slice: Barnen→Valv HITL-bro (`2026-06-11-inkast-increment.md`)
- Defer-not: «Dagbok journal-routing (UI Dagbok → idag kb_docs via kunskap)»
- U1/U3: journal är egen WORM-silo — inte Kunskap-RAG; personliga reflektioner hör hemma i Dagbok

## Levererat

| Yta | Beteende |
|-----|----------|
| `uiSiloToRouting('dagbok')` | `manualRouting: 'dagbok'` → `journal` |
| `routeInboxToWorm` | Ny `persistJournalFromInbox` (mood neutral, category från taggar) |
| `InboxReviewQueue` | HITL-knapp «→ Dagbok» |
| Hem-capture heuristik | `sourceModule` hem_* → auto `dagbok` |
| Post-save CTA | `inkastDestinationLink` → `/hjartat?tab=reflektion` |

## Filer

- `functions/src/lib/inboxPersist.ts` — `persistJournalFromInbox`
- `functions/src/lib/inboxClassifier.ts` — routing `dagbok`
- `functions/src/lib/submitInkastLite.ts`, `functions/src/callables/inbox.ts`
- `functions/src/sharedRules.ts` — INKORG_SORTERARE
- `src/modules/inkast/constants/inkastSiloOptions.tsx`
- `src/modules/inkast/api/inkastService.ts`
- `src/modules/inkast/components/InboxReviewQueue.tsx`
- `scripts/smoke_inkast_lockdown.mjs`

## Deploy

**Functions** (routing i molnet):

```bash
cd functions && npm run build
cd .. && firebase deploy --only functions:submitInkastLite,functions:confirmInboxItem,functions:previewInboxClassification
```

**Hosting** (CTA/länkar):

```bash
npm run build && firebase deploy --only hosting
```

## Smoke

- `npm run build`
- `npm run smoke:inkast` (statisk dagbok-guard; callable kunskap oförändrad)
- `npm run smoke:locked-ux`

## USER (manuell)

1. Hem → Inkast/capture → silo **Dagbok** → spara reflektion → «Öppna Dagbok»
2. Valv Samla → granskningskö → **→ Dagbok** → post i journal
3. Silo **Arkiv** / **Barnen** oförändrat (reality_vault / children_logs)

## Defer (nästa)

- Inline HITL i Hem (canonical kvar Valv Samla)
- Planering kö-polish
- Gmail OAuth
