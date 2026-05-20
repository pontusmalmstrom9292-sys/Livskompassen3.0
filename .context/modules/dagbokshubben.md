# Dagbokshubben

Route: `/dagbok`. Progressive Disclosure + Vävaren RAG-tagging.

## Progressive Disclosure
Steg: humör → text → bekräfta → sparad. Ett fält i taget.

## Vävaren
- Callable: `weaveJournalEntry` (Gemini 1.5 Pro)
- Async efter journal-save
- WORM metadata i `reality_vault` (`category: vävaren_metadata`)
- Prompt: `functions/src/sharedRules.ts` → `VÄVAREN_SYSTEM_PROMPT`

## Kod
- `src/modules/dagbok/components/DagbokPage.tsx`
- `src/modules/dagbok/api/weaverService.ts`
- `functions/src/agents/weaverAgent.ts`
