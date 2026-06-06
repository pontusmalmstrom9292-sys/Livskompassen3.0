import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { KompisAvatar } from '@/features/lifeJournal/evidence/kompis/components/KompisAvatar';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { useLongPress } from '../hooks/useLongPress';
import { useStore } from '../store';
import { FyrenProgressRing } from '../ui/FyrenProgressRing';

type Props = {
  kompisAuraActive: boolean;
  onShortPress: () => void;
};

/** Kompis-öga i toppmenyn — kort tryck → Kompis-hub, 3s håll → Valv (WebAuthn). */
export function KompisHeaderVaultButton({ kompisAuraActive, onShortPress }: Props) {
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);

  const longPress = useLongPress({
    onLongPress: () => {
      void openValvViaFyren(navigate, {
        onDenied: (message) => setSystemError(message),
      });
    },
    onClick: onShortPress,
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
      aria-label="Kompis — kort tryck för väg, håll 3 sekunder för Valv"
      title="Kompis (håll 3 sek för Valv)"
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
