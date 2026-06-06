import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLongPress } from '@/core/hooks/useLongPress';
import { useStore } from '@/core/store';
import { saveBarnportenLog } from '../api/saveBarnportenLog';

export const BARNPORTEN_QUICK_HOLD_MS = 800;

export function useBarnportenWidgetActions(childAlias: string) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useStore((s) => s.user);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onBarnportenRoute = location.pathname.startsWith('/barnporten');

  const quickAvsig = useCallback(async () => {
    if (!user) {
      setStatus('Be pappa logga in först.');
      return;
    }
    const text = window.prompt('Snabb sändning — vad vill du säga?', '') ?? '';
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

  const openHub = useCallback(() => {
    if (!onBarnportenRoute) navigate('/barnporten');
  }, [navigate, onBarnportenRoute]);

  const longPress = useLongPress({
    onLongPress: () => {
      void quickAvsig();
    },
    onClick: openHub,
    delayMs: BARNPORTEN_QUICK_HOLD_MS,
  });

  return {
    status,
    saving,
    onBarnportenRoute,
    longPress,
  };
}
