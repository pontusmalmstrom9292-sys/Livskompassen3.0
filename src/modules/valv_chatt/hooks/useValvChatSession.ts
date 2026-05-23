import { useCallback, useEffect, useState } from 'react';
import type { ValvChatCitation } from '../api/valvChatService';
import { callValvChat } from '../api/valvChatService';

export type ValvChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  citations?: ValvChatCitation[];
  timestamp: string;
};

function formatChatTimestamp(): string {
  return new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
}

export function useValvChatSession(active: boolean) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ValvChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setDraft('');
    setMessages([]);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!active) reset();
  }, [active, reset]);

  useEffect(() => () => reset(), [reset]);

  const submit = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Skriv en fråga.');
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', text: trimmed, timestamp: formatChatTimestamp() },
    ]);
    setDraft('');
    setLoading(true);
    setError(null);

    try {
      const result = await callValvChat(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: result.answer,
          citations: result.citations,
          timestamp: formatChatTimestamp(),
        },
      ]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ett okänt fel inträffade.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { draft, setDraft, messages, loading, error, submit, reset };
}
