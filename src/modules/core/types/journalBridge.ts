export type JournalBridgeContext = {
  mood: string;
  text: string;
};

export function readJournalBridgeContext(state: unknown): JournalBridgeContext | null {
  if (!state || typeof state !== 'object') return null;
  const ctx = (state as { journalContext?: unknown }).journalContext;
  if (!ctx || typeof ctx !== 'object') return null;
  const raw = ctx as { mood?: unknown; text?: unknown };
  const text = typeof raw.text === 'string' ? raw.text.trim() : '';
  if (!text) return null;
  const mood = typeof raw.mood === 'string' ? raw.mood : '';
  return { mood, text };
}
