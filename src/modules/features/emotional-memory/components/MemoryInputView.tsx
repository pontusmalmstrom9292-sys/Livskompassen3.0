import type { EmotionalMemoryType } from '@/core/types/firestore';
import { EmotionalMemoryComponent } from '@/features/emotional-memory/components/EmotionalMemoryComponent';

export type MemoryInputViewProps = {
  onSaved?: (docId: string) => void;
  defaultMemoryType?: EmotionalMemoryType;
  compact?: boolean;
};

/** Tunn wrapper — renderar EmotionalMemoryComponent. */
export function MemoryInputView(props: MemoryInputViewProps) {
  return <EmotionalMemoryComponent {...props} />;
}
