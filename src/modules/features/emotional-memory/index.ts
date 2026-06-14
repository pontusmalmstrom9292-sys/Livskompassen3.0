export { EmotionalMemoryComponent } from '@/features/emotional-memory/components/EmotionalMemoryComponent';
export { MemoryInputView } from '@/features/emotional-memory/components/MemoryInputView';
export {
  useEmotionalMemoryStore,
  type EmotionalMemoryState,
} from '@/features/emotional-memory/store/useEmotionalMemoryStore';
export {
  saveEmotionalMemory,
  listEmotionalMemories,
  EMOTIONAL_MEMORY_WORM_KEYS,
} from '@/core/firebase/emotionalMemoryFirestore';
export type {
  EmotionalMemoryEntry,
  EmotionalMemoryRow,
  EmotionalMemoryType,
} from '@/core/types/firestore';
