import { useState, useEffect, useCallback } from 'react';
import { saveJournalEntry, getJournalEntries } from '../../../core/firebase/firestore';
import { hasVaultZone } from '../../../core/auth/sessionService';
import { weaveJournalEntry } from '../api/weaverService';
import { journalWovenToKampspar } from '../api/journalWovenService';
import type { MabraBridgeHub } from '../constants/mabraBridge';
import { MABRA_MOOD_ONLY_TEXT } from '../constants/mabraBridge';
import { normalizeJournalTag } from '../constants/journalTags';
import { MOOD_ONLY_STUB } from '../constants/moodPrompts';
import type { JournalEntry, JournalStep } from '../types/journal';

const INITIAL_STEP: JournalStep = 'mood';

type PersistOptions = {
  optInKampspar?: boolean;
  tags?: string[];
  category?: string;
  skipDoneStep?: boolean;
};

type UseJournalFlowOptions = {
  userId: string | undefined;
  mabraHub?: MabraBridgeHub | null;
  lowEnergyBridge?: boolean;
};

export function useJournalFlow({ userId, mabraHub, lowEnergyBridge = false }: UseJournalFlowOptions) {
  const [step, setStep] = useState<JournalStep>(INITIAL_STEP);
  const [mood, setMood] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [weaveToKampspar, setWeaveToKampspar] = useState(false);
  const [quickJustSaved, setQuickJustSaved] = useState(false);

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
      setTags([]);
      setCategory(undefined);
      setError(null);
    },
    [],
  );

  useEffect(() => {
    if (!quickJustSaved) return;
    const t = window.setTimeout(() => setQuickJustSaved(false), 4000);
    return () => window.clearTimeout(t);
  }, [quickJustSaved]);

  const goToStep = (next: JournalStep) => setStep(next);

  const toggleTag = (raw: string) => {
    const tag = normalizeJournalTag(raw);
    if (!tag) return;
    setTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= 10) return prev;
      return [...prev, tag];
    });
  };

  const persistEntry = async (entryText: string, opts: PersistOptions = {}) => {
    if (!userId || !mood) return;
    const optInKampspar = opts.optInKampspar ?? weaveToKampspar;
    setSaving(true);
    setError(null);
    try {
      const id = await saveJournalEntry(userId, {
        mood,
        text: entryText,
        tags: opts.tags?.length ? opts.tags : undefined,
        category: opts.category ?? category,
      });
      if (hasVaultZone('dagbok_forensic')) {
        weaveJournalEntry({ journalEntryId: id, mood, text: entryText });
      }
      if (optInKampspar && hasVaultZone('dagbok_forensic')) {
        journalWovenToKampspar({ journalEntryId: id, mood, text: entryText });
      }
      setWeaveToKampspar(false);
      if (opts.skipDoneStep) {
        setQuickJustSaved(true);
        setTags([]);
      } else {
        setStep('done');
      }
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
    const tagList = tags.length ? tags : undefined;
    await persistEntry(trimmed, { tags: tagList });
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

  const handleQuickSave = async (quickText: string) => {
    const trimmed = quickText.trim();
    const entryText = trimmed || MOOD_ONLY_STUB(mood);
    const tagList = tags.length ? [...tags] : undefined;
    await persistEntry(entryText, { tags: tagList, skipDoneStep: true });
  };

  const resetFlow = () => {
    setMood('');
    setText('');
    setTags([]);
    setCategory(undefined);
    setWeaveToKampspar(false);
    setStep(INITIAL_STEP);
  };

  return {
    step,
    mood,
    text,
    tags,
    category,
    saving,
    error,
    entries,
    weaveToKampspar,
    quickJustSaved,
    setWeaveToKampspar,
    setCategory,
    lowEnergyBridge,
    setMood,
    setText,
    toggleTag,
    goToStep,
    handleSave,
    handleSaveMoodOnly,
    handleSaveWithoutText,
    handleQuickSave,
    resetFlow,
    refreshEntries,
  };
}
