import { Menu, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AccountAuthMenu } from '../../auth/AccountAuthMenu';
import { KompisHeaderVaultButton } from '../../components/KompisHeaderVaultButton';
import { useStore } from '../../store';

type Props = {
  accountOpen: boolean;
  onAccountOpenChange: (open: boolean) => void;
  onMenuClick: () => void;
};

/** Figma-ref header — prod (meny, öga via Kompis, konto). */
export function BastaDesignHeader({ accountOpen, onAccountOpenChange, onMenuClick }: Props) {
  const navigate = useNavigate();
  const kompisAuraActive = useStore((s) => s.system.kompisAuraActive);

  return (
    <header className="basta-design__header basta-design__header--prod">
      <button type="button" className="basta-design__header-btn" aria-label="Meny" onClick={onMenuClick}>
        <Menu size={20} />
      </button>
      <div className="basta-design__header-brand">
        <h1 className="basta-design__header-title">Livskompassen</h1>
        <div className="basta-design__header-ornament" aria-hidden>
          <div className="basta-design__header-ornament-line" />
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <polygon points="5,0 8,3 5,6 2,3" fill="#c9a435" opacity="0.7" />
          </svg>
          <svg width="5" height="5" viewBox="0 0 5 5" fill="none" className="basta-design__header-ornament-gem">
            <circle cx="2.5" cy="2.5" r="1.5" fill="#c9a435" opacity="0.5" />
          </svg>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <polygon points="5,0 8,3 5,6 2,3" fill="#c9a435" opacity="0.7" />
          </svg>
          <div className="basta-design__header-ornament-line" />
        </div>
      </div>
      <div className="basta-design__header-actions">
        <button
          type="button"
          className="basta-design__header-icon-btn"
          aria-label="Inställningar"
          onClick={() => navigate('/installningar')}
        >
          <Settings size={14} />
        </button>
        <AccountAuthMenu
          open={accountOpen}
          onOpenChange={onAccountOpenChange}
          compactTrigger
          chromeVariant="executive"
        />
        <span className="basta-design__header-vault">
          <KompisHeaderVaultButton kompisAuraActive={kompisAuraActive} variant="executive-header" />
        </span>
      </div>
    </header>
  );
}
