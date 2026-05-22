export type JournalBridgeContext = {
  mood: string;
  text: string;
};

export function readJournalBridgeContext(state: unknown): JournalBridgeContext | null {
  if (!state || typeof state !== 'object') return null;
  const ctx = (state as { journalContext?: JournalBridgeContext }).journalContext;
  if (!ctx?.text?.trim()) return null;
  return { mood: ctx.mood ?? '', text: ctx.text.trim() };
}
