import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/modules/core/store/toastStore';
import {
  createJournalEntryId,
  saveJournalEntry,
  getJournalEntries,
} from '@/core/firebase/firestore';
import { uploadJournalMemory } from '../utils/journalUploadHelper';
import type { JournalCategoryId } from '../constants/journalCategories';
import { weaveJournalEntry } from '../api/weaverService';
import { journalWovenToKampspar } from '../api/journalWovenService';
import type { MabraBridgeHub } from '../constants/mabraBridge';
import { MABRA_MOOD_ONLY_TEXT } from '../constants/mabraBridge';
import { normalizeJournalTag } from '../constants/journalTags';
import { MOOD_ONLY_STUB } from '../constants/moodPrompts';
import { fetchJournalQuickMirror } from '../api/journalQuickMirrorService';
import type { JournalQuickMirrorResponse } from '../api/journalQuickMirrorService';
import { journalQuickMirrorFallback } from '../utils/journalQuickMirrorFallback';
import { submitCaptureDraft } from '@/modules/capture/submitCaptureDraft';
import type { JournalEntry, JournalStep } from '../types/journal';
import { useDiaryStore } from '../store/diaryStore';

const INITIAL_STEP: JournalStep = 'mood';

type PersistOptions = {
  optInKampspar?: boolean;
  tags?: string[];
  category?: string;
  skipDoneStep?: boolean;
  moodOverride?: string;
};

type UseJournalFlowOptions = {
  userId: string | undefined;
  mabraHub?: MabraBridgeHub | null;
  lowEnergyBridge?: boolean;
};

export function useJournalFlow({ userId, mabraHub, lowEnergyBridge = false }: UseJournalFlowOptions) {
  const [step, setStep] = useState<JournalStep>(INITIAL_STEP);
  const [mood, setMood] = useState('');
  const [text, setText] = useState(() => useDiaryStore.getState().diaryDraft || '');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<JournalCategoryId | undefined>();
  const [pendingMemoryFile, setPendingMemoryFile] = useState<File | null>(null);
  const [memoryError, setMemoryError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [weaveToKampspar, setWeaveToKampspar] = useState(false);
  const [validateOnly, setValidateOnly] = useState(false);
  const [quickJustSaved, setQuickJustSaved] = useState(false);
  const [quickMirror, setQuickMirror] = useState<JournalQuickMirrorResponse | null>(null);
  const [quickMirrorLoading, setQuickMirrorLoading] = useState(false);
  const [lastSavedEntryId, setLastSavedEntryId] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      setStep(INITIAL_STEP);
      setMood('');
      setText('');
      setTags([]);
      setCategory(undefined);
      setPendingMemoryFile(null);
      setMemoryError(null);
      setSaving(false);
      setError(null);
      setWeaveToKampspar(false);
      setValidateOnly(false);
      setQuickJustSaved(false);
      setQuickMirror(null);
      setQuickMirrorLoading(false);
      setLastSavedEntryId(null);
    };
  }, []);

  const refreshEntries = useCallback(async () => {
    if (!userId) return;
    const data = await getJournalEntries(userId);
    setEntries(data as JournalEntry[]);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    refreshEntries().catch(() => {
      if (mountedRef.current) setError('Kunde inte hämta dagbok.');
    });
  }, [userId, step, refreshEntries]);

  useEffect(() => {
    if (!quickJustSaved) return;
    const t = window.setTimeout(() => {
      setQuickJustSaved(false);
      setQuickMirror(null);
      setQuickMirrorLoading(false);
    }, 12000);
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

  const persistEntry = async (entryText: string, opts: PersistOptions = {}): Promise<boolean> => {
    if (!userId) {
      setError('Du måste vara inloggad för att spara.');
      return false;
    }
    const activeMood = opts.moodOverride ?? mood;
    if (!activeMood) {
      setError('Välj en känsla innan du sparar.');
      return false;
    }
    if (memoryError) {
      setError(memoryError);
      return false;
    }
    const optInKampspar = opts.optInKampspar ?? weaveToKampspar;
    setSaving(true);
    setError(null);
    let uploadedAttachment: Awaited<ReturnType<typeof uploadJournalMemory>> | undefined;
    try {
      let entryId: string | undefined;
      let attachment: Awaited<ReturnType<typeof uploadJournalMemory>> | undefined;

      if (pendingMemoryFile) {
        entryId = createJournalEntryId();
        try {
          attachment = await uploadJournalMemory(userId, entryId, pendingMemoryFile);
          uploadedAttachment = attachment;
        } catch (uploadErr) {
          const msg =
            uploadErr instanceof Error
              ? uploadErr.message
              : 'Uppladdningen misslyckades. Försök igen.';
          setMemoryError(msg);
          setError(msg);
          return false;
        }
      }

      const finalEntryText = validateOnly 
        ? `${entryText}\n\n[RULE: VALIDATE ONLY. NO ADVICE. NO FIXING.]` 
        : entryText;

      const id = await saveJournalEntry(
        userId,
        {
          mood: activeMood,
          text: finalEntryText,
          tags: opts.tags?.length ? opts.tags : undefined,
          category: opts.category ?? category,
          attachment,
        },
        entryId ? { entryId } : undefined,
      );
      setLastSavedEntryId(id);
      weaveJournalEntry({ journalEntryId: id, mood: activeMood, text: finalEntryText });
      if (optInKampspar) {
        journalWovenToKampspar({ journalEntryId: id, mood: activeMood, text: finalEntryText });
      }
      setWeaveToKampspar(false);
      setPendingMemoryFile(null);
      setMemoryError(null);
      useDiaryStore.getState().clearDiaryDraft();
      if (!mountedRef.current) return true;
      if (opts.skipDoneStep) {
        setQuickJustSaved(true);
        setTags([]);
      } else {
        setStep('done');
      }
      try {
        await refreshEntries();
      } catch (refreshErr) {
        console.warn('[Dagbok] refreshEntries after save failed', refreshErr);
      }
      toast.success('Dina tankar är i säkert förvar. Du kan släppa dem nu.');
      return true;
    } catch (err) {
      const msg = uploadedAttachment
        ? 'Bilagan laddades upp men posten kunde inte sparas. Ta bort bilagan och försök igen, eller spara utan bilaga.'
        : err instanceof Error
          ? err.message
          : 'Kunde inte spara. Kontrollera nätverk och Firestore-regler.';
      if (mountedRef.current) setError(msg);
      toast.error('Kunde inte spara. Kontrollera din uppkoppling och försök igen.');
      return false;
    } finally {
      if (mountedRef.current) setSaving(false);
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
    await persistEntry(MOOD_ONLY_STUB(mood), { moodOverride: mood || undefined });
  };

  /** Fas 23E — tyst läge: spara utan confirm/weave-UI. */
  const handleTystSave = async (moodVal: string, textVal: string) => {
    if (!moodVal) {
      setError('Välj en känsla innan du sparar.');
      return;
    }
    setMood(moodVal);
    setText(textVal);
    const entryText = textVal.trim() || MOOD_ONLY_STUB(moodVal);
    await persistEntry(entryText, { moodOverride: moodVal });
  };

  const handleSaveWithoutText = async () => {
    if (!lowEnergyBridge || !mabraHub) return;
    await persistEntry(MABRA_MOOD_ONLY_TEXT[mabraHub]);
  };

  const handleQuickSave = async (
    quickText: string,
    options?: { alsoToArkiv?: boolean },
  ) => {
    const trimmed = quickText.trim();
    const entryText = trimmed || MOOD_ONLY_STUB(mood);
    const tagList = tags.length ? [...tags] : undefined;
    const savedMood = mood;
    const savedTags = tagList ? [...tagList] : [];
    setQuickMirror(null);
    setQuickMirrorLoading(false);
    const ok = await persistEntry(entryText, { tags: tagList, skipDoneStep: true });
    if (ok && options?.alsoToArkiv && trimmed.length >= 3) {
      void submitCaptureDraft({
        text: trimmed,
        fileName: 'dagbok_snabb.txt',
        sourceModule: 'dagbok_snabb',
        optInTrauma: true,
      }).catch(() => {
        /* journal sparad — arkiv-kopia valfri */
      });
    }
    if (ok && savedMood) {
      setQuickMirror(journalQuickMirrorFallback(savedMood, trimmed || undefined));
      setQuickMirrorLoading(true);
      try {
        const mirror = await fetchJournalQuickMirror(savedMood, savedTags, trimmed || undefined);
        setQuickMirror(mirror);
      } finally {
        setQuickMirrorLoading(false);
      }
    }
  };

  const resetFlow = () => {
    setMood('');
    setText('');
    setTags([]);
    setCategory(undefined);
    setPendingMemoryFile(null);
    setMemoryError(null);
    setWeaveToKampspar(false);
    setLastSavedEntryId(null);
    setStep(INITIAL_STEP);
    useDiaryStore.getState().clearDiaryDraft();
    toast.info('Utkastet har rensats.');
  };

  return {
    step,
    mood,
    text,
    tags,
    category,
    pendingMemoryFile,
    memoryError,
    saving,
    error,
    entries,
    weaveToKampspar,
    validateOnly,
    quickJustSaved,
    quickMirror,
    quickMirrorLoading,
    lastSavedEntryId,
    setWeaveToKampspar,
    setValidateOnly,
    setCategory,
    setPendingMemoryFile,
    setMemoryError,
    lowEnergyBridge,
    setMood,
    setText,
    toggleTag,
    goToStep,
    handleSave,
    handleSaveMoodOnly,
    handleTystSave,
    handleSaveWithoutText,
    handleQuickSave,
    resetFlow,
    refreshEntries,
  };
}
