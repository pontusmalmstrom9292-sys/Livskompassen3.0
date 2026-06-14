import { Link } from 'react-router-dom';
import type { EmotionalMemoryType } from '@/core/types/firestore';
import { EmotionalMemoryComponent } from '@/features/emotional-memory/components/EmotionalMemoryComponent';
import type { MabraProjectId } from '../constants/mabraProjects';
import { VIT_HUB_LANDED, VIT_HUB_VAULT_LINK } from '../lib/vitHubCopy';
import { vitHubFilteredLink } from '../lib/vitHubLinks';
import { writeVitProjectLastSeen } from '../lib/vitProjectLastSeen';

type EmotionalMemoryViewProps = {
  /** Parent context — EmotionalMemoryComponent resolves ownerId via useStore(user.uid). */
  userId: string | undefined;
  projectId: MabraProjectId;
  defaultMemoryType?: EmotionalMemoryType;
  compact?: boolean;
  onSaved?: (docId: string) => void;
};

/**
 * MåBra wrapper — delegerar inmatning till låst WORM-komponent.
 * capacity och ownerId hanteras internt av EmotionalMemoryComponent
 * (useCapacityGate + useStore); wrappern skickar inte dessa som props.
 */
export function EmotionalMemoryView({
  userId,
  projectId,
  defaultMemoryType = 'feeling',
  compact = true,
  onSaved,
}: EmotionalMemoryViewProps) {
  const handleSaved = (docId: string): void => {
    writeVitProjectLastSeen(projectId);
    onSaved?.(docId);
  };

  return (
    <div className="space-y-3">
      <EmotionalMemoryComponent
        compact={compact}
        defaultMemoryType={defaultMemoryType}
        onSaved={handleSaved}
      />

      {userId ? (
        <p className="text-xs text-text-dim">
          {VIT_HUB_LANDED}{' '}
          <Link
            to={vitHubFilteredLink('memory', projectId)}
            className="text-accent underline-offset-2 hover:underline"
          >
            {VIT_HUB_VAULT_LINK}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
