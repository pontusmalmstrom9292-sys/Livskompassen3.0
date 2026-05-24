import { useState, useEffect, useCallback } from 'react';
import { saveJournalEntry, getJournalEntries } from '../../core/firebase/firestore';
import { hasVaultZone } from '../../core/auth/sessionService';
import { weaveJournalEntry } from '../api/weaverService';
import { journalWovenToKampspar } from '../api/journalWovenService';
import type { MabraBridgeHub } from '../constants/mabraBridge';
import { MABRA_MOOD_ONLY_TEXT } from '../constants/mabraBridge';
import { MOOD_ONLY_STUB } from '../constants/moodPrompts';
import type { JournalEntry, JournalStep } from '../types/journal';

const INITIAL_STEP: JournalStep = 'mood';

type UseJournalFlowOptions = {
  userId: string | undefined;
  mabraHub?: MabraBridgeHub | null;
  lowEnergyBridge?: boolean;
};

export function useJournalFlow({ userId, mabraHub, lowEnergyBridge = false }: UseJournalFlowOptions) {
  const [step, setStep] = useState<JournalStep>(INITIAL_STEP);
  const [mood, setMood] = useState('');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [weaveToKampspar, setWeaveToKampspar] = useState(false);

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

  const persistEntry = async (entryText: string, optInKampspar = weaveToKampspar) => {
    if (!userId || !mood) return;
    setSaving(true);
    setError(null);
    try {
      const id = await saveJournalEntry(userId, { mood, text: entryText });
      if (hasVaultZone('dagbok_forensic')) {
        weaveJournalEntry({ journalEntryId: id, mood, text: entryText });
      }
      if (optInKampspar && hasVaultZone('dagbok_forensic')) {
        journalWovenToKampspar({ journalEntryId: id, mood, text: entryText });
      }
      setWeaveToKampspar(false);
      setStep('done');
      await refreshEntries();
    } catch {
      setError('Kunde inte spara. Kontrollera Firestore-regler.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await persistEntry(trimmed);
  };

  const handleSaveMoodOnly = async () => {
    if (lowEnergyBridge && mabraHub) {
      await persistEntry(MABRA_MOOD_ONLY_TEXT[mabraHub]);
      return;
    }
    await persistEntry(MOOD_ONLY_STUB(mood));
  };

  const handleSaveWithoutText = async () => {
    if (!lowEnergyBridge || !mabraHub) return;
    await persistEntry(MABRA_MOOD_ONLY_TEXT[mabraHub]);
  };

  const resetFlow = () => {
    setMood('');
    setText('');
    setWeaveToKampspar(false);
    setStep(INITIAL_STEP);
  };

  return {
    step,
    mood,
    text,
    saving,
    error,
    entries,
    weaveToKampspar,
    setWeaveToKampspar,
    lowEnergyBridge,
    setMood,
    setText,
    goToStep,
    handleSave,
    handleSaveMoodOnly,
    handleSaveWithoutText,
    resetFlow,
  };
}
