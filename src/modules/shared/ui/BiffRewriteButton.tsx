import { useCallback, useState } from 'react';
import { Loader2, Undo2, Wand2 } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from '@/modules/core/store/toastStore';
import {
  fetchBiffRewriteDraft,
  type BiffRewriteContext,
} from '@/features/lifeJournal/diary/diary/api/biffRewriteDraftService';

type Props = {
  text: string;
  onRewrite: (cleaned: string) => void;
  context?: BiffRewriteContext;
  disabled?: boolean;
  minLength?: number;
};

export function BiffRewriteButton({
  text,
  onRewrite,
  context = 'dagbok',
  disabled = false,
  minLength = 10,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [undoText, setUndoText] = useState<string | null>(null);

  const trimmed = text.trim();
  const canRewrite = trimmed.length >= minLength && !disabled && !loading;

  const handleRewrite = useCallback(async () => {
    if (!canRewrite) return;
    setLoading(true);
    try {
      const result = await fetchBiffRewriteDraft(trimmed, context);
      if (!result?.cleanedText?.trim()) {
        toast.error('BIFF-tvätt svarar inte just nu — texten är oförändrad.');
        return;
      }
      setUndoText(trimmed);
      onRewrite(result.cleanedText.trim());
      if (result.toneCheck === 'still_emotional') {
        toast.info('Texten kan fortfarande vara laddad — justera gärna manuellt.');
      } else if (result.toneCheck === 'too_long') {
        toast.info('Förslaget är längre — korta gärna innan du skickar.');
      } else {
        toast.success('Utkastet är tvättat enligt BIFF.');
      }
    } finally {
      setLoading(false);
    }
  }, [canRewrite, trimmed, context, onRewrite]);

  const handleUndo = useCallback(() => {
    if (!undoText) return;
    onRewrite(undoText);
    setUndoText(null);
    toast.info('Utkastet återställdes.');
  }, [undoText, onRewrite]);

  if (trimmed.length < minLength) return null;

  return (
    <div className="flex items-center gap-1.5">
      {undoText && (
        <button
          type="button"
          onClick={handleUndo}
          disabled={loading}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/50 text-text-muted transition-colors hover:bg-surface hover:text-accent"
          title="Ångra BIFF-tvätt"
          aria-label="Ångra BIFF-tvätt"
        >
          <Undo2 className="h-4 w-4" />
        </button>
      )}
      <button
        type="button"
        onClick={() => void handleRewrite()}
        disabled={!canRewrite}
        className={clsx(
          'flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs transition-colors',
          loading
            ? 'bg-accent/15 text-accent'
            : 'bg-surface/50 text-text-muted hover:bg-accent/10 hover:text-accent',
        )}
        title="Tvätta enligt BIFF"
        aria-label="Tvätta enligt BIFF"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Wand2 className="h-4 w-4" aria-hidden />
        )}
        <span className="hidden sm:inline">BIFF</span>
      </button>
    </div>
  );
}
