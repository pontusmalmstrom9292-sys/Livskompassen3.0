import { useCallback, useEffect, useState } from 'react';
import type { ValvChatCitation } from '../api/valvChatService';
import { callValvChat } from '../api/valvChatService';

export function useValvChatSession(active: boolean) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<ValvChatCitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setQuestion('');
    setAnswer(null);
    setCitations([]);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!active) {
      reset();
    }
  }, [active, reset]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const submit = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Skriv en fråga.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer(null);
    setCitations([]);

    try {
      const result = await callValvChat(trimmed);
      setAnswer(result.answer);
      setCitations(result.citations);
      setQuestion('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ett okänt fel inträffade.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    question,
    setQuestion,
    answer,
    citations,
    loading,
    error,
    submit,
    reset,
  };
}
