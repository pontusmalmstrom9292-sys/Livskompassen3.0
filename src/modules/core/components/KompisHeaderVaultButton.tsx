import { clsx } from 'clsx';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { KUNSKAP_VAULT_TAB } from '@/features/lifeJournal/evidence/vault/utils/vaultTabs';
import { KompisAvatar } from '@/features/lifeJournal/evidence/kompis/components/KompisAvatar';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { useLongPress } from '../hooks/useLongPress';
import { valvetNavigateTarget } from '../navigation/navigationRegistry';
import { useStore } from '../store';
import { FyrenProgressRing } from '../ui/FyrenProgressRing';

type Props = {
  kompisAuraActive: boolean;
};

/**
 * Kompis-öga i toppmenyn — kort tryck → Kunskapsbank i Valv (PIN-gate om låst),
 * 3s håll → Valv-upplåsning (WebAuthn).
 */
export function KompisHeaderVaultButton({ kompisAuraActive }: Props) {
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);

  const handleShortPress = useCallback(() => {
    navigate(valvetNavigateTarget(KUNSKAP_VAULT_TAB));
  }, [navigate]);

  const longPress = useLongPress({
    onLongPress: () => {
      void openValvViaFyren(navigate, {
        onDenied: (message) => setSystemError(message),
      });
    },
    onClick: handleShortPress,
    delayMs: 3000,
  });

  const { progress, isHolding, ...holdHandlers } = longPress;
  const showRing = progress > 0;

  return (
    <button
      type="button"
      className={clsx(
        'header-chrome-btn header-chrome-btn--round relative shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        isHolding && 'header-chrome-btn--holding',
      )}
      aria-label="Kompis — kort tryck för Kunskapsbank i Valv, håll 3 sekunder för upplåsning"
      title="Kunskapsbank (håll 3 sek för Valv)"
      {...holdHandlers}
    >
      <span className="relative flex h-10 w-10 items-center justify-center">
        {showRing ? <FyrenProgressRing progress={progress} /> : null}
        <KompisAvatar
          size="sm"
          chromeEmbed
          state={kompisAuraActive ? 'analyzing' : 'idle'}
          className="kompis-avatar--header-chrome relative z-[1] shrink-0"
        />
      </span>
    </button>
  );
}
