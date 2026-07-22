import { useMabraStore } from '../store/mabraStore';
import { useDiaryStore } from '@/features/lifeJournal/diary/diary/store/diaryStore';
import { DagbokSuperModule } from '@/features/lifeJournal/diary/diary/components/DagbokSuperModule';

const COPY = {
  title: 'Tematisk reflektion',
  hint: 'Ett steg i taget — humör räcker om du är trött. Inget sparas förrän du trycker Spara.',
  draft: 'Text från ditt utkast är förifylld nedan. Du kan redigera eller spara bara humör.',
} as const;

/**
 * Fas 6D — in-hub dagbok-bro (HITL, journal WORM). Zero Footprint tills explicit save.
 */
export function MabraDagbokBridgePanel() {
  const hub = useMabraStore((s) => s.hub);
  const draft = useDiaryStore((s) => s.diaryDraft);
  const hasDraft = Boolean(draft?.trim());

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted">{COPY.title}</p>
      <p className="text-sm text-text-muted">{COPY.hint}</p>
      {hasDraft ? (
        <p className="rounded-lg border border-emerald-500/20 bg-surface/40 px-3 py-2 text-xs text-text-muted">
          {COPY.draft}
        </p>
      ) : null}
      <DagbokSuperModule variant="mabra-bridge" mabraBridgeHub={hub} />
    </div>
  );
}
