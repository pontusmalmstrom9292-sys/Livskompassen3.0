import { useCallback, useState } from 'react';
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';
import { useLongPress } from '@/core/hooks/useLongPress';
import { useStore } from '@/core/store';
import { saveBarnportenLog } from '../api/saveBarnportenLog';

const DEFAULT_CHILD = 'Kasper';
const QUICK_HOLD_MS = 800;

type Props = {
  childAlias?: string;
};

/**
 * CB1 Stjärn-prick — barn-widget (BARNPORTEN-SPEC).
 * Enkeltryck → /barnporten · långtryck → snabb avsig → children_logs (authorRole child).
 * Monteras endast på barnporten-rutter — rör inte förälder W1 (FyrenWidgetBar).
 */
export function BarnportenWidget({ childAlias = DEFAULT_CHILD }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useStore((s) => s.user);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const quickAvsig = useCallback(async () => {
    if (!user) {
      setStatus('Be pappa logga in först.');
      return;
    }
    const text = window.prompt('Snabb avsig — vad vill du säga?', '') ?? '';
    if (!text.trim()) return;

    setSaving(true);
    setStatus(null);
    try {
      await saveBarnportenLog(user.uid, {
        childAlias,
        observation: text.trim(),
        kind: 'quick_widget',
        contentType: 'text',
      });
      setStatus('Skickat till pappas inkorg.');
      window.setTimeout(() => setStatus(null), 2400);
    } catch {
      setStatus('Kunde inte spara. Försök igen.');
    } finally {
      setSaving(false);
    }
  }, [childAlias, user]);

  const prickPress = useLongPress({
    onLongPress: () => {
      void quickAvsig();
    },
    onClick: () => {
      if (!location.pathname.startsWith('/barnporten')) {
        navigate('/barnporten');
      }
    },
    delayMs: QUICK_HOLD_MS,
  });

  const { progress, isHolding, onClick: prickClick, ...prickHandlers } = prickPress;

  if (location.pathname.startsWith('/widget/inspelning')) return null;

  return (
    <div className="barnporten-widget" aria-label="Barnporten-widget">
      {status ? (
        <p className="barnporten-widget__toast" role="status">
          {status}
        </p>
      ) : null}
      <button
        type="button"
        disabled={saving}
        className={clsx(
          'barnporten-widget__star',
          isHolding && 'barnporten-widget__star--holding',
        )}
        aria-label={
          location.pathname.startsWith('/barnporten')
            ? 'Håll för snabb avsig'
            : 'Öppna Barnporten'
        }
        style={
          progress > 0
            ? ({ '--barnporten-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
            : undefined
        }
        onClick={prickClick}
        {...prickHandlers}
      >
        <Star className="h-3.5 w-3.5 fill-amber-300/90 text-amber-200" strokeWidth={1.5} />
      </button>
    </div>
  );
}
