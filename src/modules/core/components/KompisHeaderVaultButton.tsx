import { clsx } from 'clsx';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { KUNSKAP_VAULT_TAB } from '@/features/lifeJournal/evidence/vault/utils/vaultTabs';
import { KompisAvatar } from '@/features/lifeJournal/evidence/kompis/components/KompisAvatar';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { hasVaultGate } from '../auth/sessionService';
import { useLongPress } from '../hooks/useLongPress';
import { valvetNavigateTarget } from '../navigation/navigationRegistry';
import { useStore } from '../store';
import { FyrenProgressRing } from '../ui/FyrenProgressRing';

type Props = {
  kompisAuraActive: boolean;
  /** Premium executive — kompakt öga i header-rad (höger). */
  variant?: 'default' | 'executive-hero' | 'executive-header';
};

/**
 * Kompis-öga i toppmenyn — kort tryck → Kunskapsbank i Valv (PIN-gate om låst),
 * 3s håll → Valv-upplåsning (WebAuthn).
 */
export function KompisHeaderVaultButton({ kompisAuraActive, variant = 'default' }: Props) {
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultSessionOpen = isVaultUnlocked || hasVaultGate();

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

  const ariaLabel = vaultSessionOpen
    ? 'Kompis — kort tryck för Kunskapsbank i Valv, håll 3 sekunder för upplåsning'
    : 'Kompis — kort tryck, håll 3 sekunder för upplåsning';
  const title = vaultSessionOpen
    ? 'Kunskapsbank (håll 3 sek för Valv)'
    : 'Håll 3 sekunder för upplåsning';

  const executiveHero = variant === 'executive-hero';
  const executiveHeader = variant === 'executive-header';
  const executiveChrome = executiveHero || executiveHeader;

  return (
    <button
      type="button"
      className={clsx(
        'header-chrome-btn header-chrome-btn--round relative shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        executiveChrome && 'exec-header-eye',
        isHolding && 'header-chrome-btn--holding',
        executiveChrome && isHolding && 'exec-header-eye--holding',
      )}
      aria-label={ariaLabel}
      title={title}
      {...holdHandlers}
    >
      <span
        className={clsx(
          'relative flex items-center justify-center',
          executiveHero ? 'h-[4.25rem] w-[4.25rem]' : executiveHeader ? 'h-10 w-10' : 'h-10 w-10',
        )}
      >
        {showRing ? <FyrenProgressRing progress={progress} /> : null}
        <KompisAvatar
          size={executiveHero ? 'lg' : 'sm'}
          chromeEmbed
          state={kompisAuraActive ? 'analyzing' : 'idle'}
          className={clsx(
            'kompis-avatar--header-chrome relative z-[1] shrink-0',
            executiveHero && 'kompis-avatar--executive-hero',
            executiveHeader && 'kompis-avatar--executive-header',
          )}
        />
      </span>
    </button>
  );
}
