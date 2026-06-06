import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';

type Props = {
  onQueued?: () => void;
  onPersistedBevis?: (docId: string) => void;
};

/** Kompakt Inkast i Valv Samla — delegerar till CaptureSuperModule. */
export function VaultInkastCompact({ onQueued, onPersistedBevis }: Props) {
  return (
    <CaptureSuperModule
      variant="valv-compact"
      onQueued={onQueued}
      onPersistedBevis={onPersistedBevis}
    />
  );
}
