import { useState, useEffect, useCallback } from 'react';
import { saveJournalEntry, getJournalEntries } from '../../core/firebase/firestore';
import { weaveJournalEntry } from '../api/weaverService';
import type { JournalEntry, JournalStep } from '../types/journal';

const INITIAL_STEP: JournalStep = 'mood';

type UseJournalFlowOptions = {
  userId: string | undefined;
};

export function useJournalFlow({ userId }: UseJournalFlowOptions) {
  const [step, setStep] = useState<JournalStep>(INITIAL_STEP);
  const [mood, setMood] = useState('');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const refreshEntries = useCallback(async () => {
    if (!userId) return;
    const data = await getJournalEntries(userId);
    setEntries(data as JournalEntry[]);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    refreshEntries().catch(() => setError('Kunde inte hämta dagbok.'));
  }, [userId, step, refreshEntries]);

  useEffect(
    () => () => {
      setStep(INITIAL_STEP);
      setMood('');
      setText('');
      setError(null);
    },
    [],
  );

  const goToStep = (next: JournalStep) => setStep(next);

  const handleSave = async () => {
    if (!userId || !mood || !text.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const id = await saveJournalEntry(userId, { mood, text: text.trim() });
      weaveJournalEntry({ journalEntryId: id, mood, text: text.trim() });
      setStep('done');
      await refreshEntries();
    } catch {
      setError('Kunde inte spara. Kontrollera Firestore-regler.');
    } finally {
      setSaving(false);
    }
  };

  const resetFlow = () => {
    setMood('');
    setText('');
    setStep(INITIAL_STEP);
  };

  return {
    step,
    mood,
    text,
    saving,
    error,
    entries,
    setMood,
    setText,
    goToStep,
    handleSave,
    resetFlow,
  };
}
