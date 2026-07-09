/* PROTECTED BASTA-DESIGN CHROME LOCK — docs/design/BASTA-DESIGN-CHROME-LOCK.md · npm run smoke:basta-dock-lock */
import { useState } from 'react';
import { Menu, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AccountAuthMenu } from '../../auth/AccountAuthMenu';
import { KompisHeaderVaultButton } from '../../components/KompisHeaderVaultButton';
import { ResurserOverlay } from '../../navigation/ResurserOverlay';
import { useStore } from '../../store';
import { BastaDesignResurserWidget } from './BastaDesignResurserWidget';

type Props = {
  accountOpen: boolean;
  onAccountOpenChange: (open: boolean) => void;
  onMenuClick: () => void;
};

/** Figma-ref header — prod (meny, resurser-widget, öga via Kompis, konto). */
export function BastaDesignHeader({ accountOpen, onAccountOpenChange, onMenuClick }: Props) {
  const navigate = useNavigate();
  const kompisAuraActive = useStore((s) => s.system.kompisAuraActive);
  const [resurserOpen, setResurserOpen] = useState(false);
  const [resurserWidgetOpen, setResurserWidgetOpen] = useState(false);

  return (
    <>
      <ResurserOverlay open={resurserOpen} onClose={() => setResurserOpen(false)} />
      <header className="basta-design__header basta-design__header--prod">
        <div className="basta-design__header-start">
          <button type="button" className="basta-design__header-btn" aria-label="Meny" onClick={onMenuClick}>
            <Menu size={20} />
          </button>
          <BastaDesignResurserWidget
            placement="header"
            open={resurserWidgetOpen}
            onToggle={() => setResurserWidgetOpen((v) => !v)}
            onOpenFull={() => {
              setResurserWidgetOpen(false);
              setResurserOpen(true);
            }}
          />
        </div>
        <div className="basta-design__header-brand">
          <h1 className="basta-design__header-title">Livskompassen</h1>
          <div className="basta-design__header-ornament" aria-hidden>
            <div className="basta-design__header-ornament-line" />
            <svg width="12" height="7" viewBox="0 0 10 6" fill="none" aria-hidden>
              <polygon points="5,0 8,3 5,6 2,3" opacity="0.85" />
            </svg>
            <svg width="7" height="7" viewBox="0 0 5 5" fill="none" className="basta-design__header-ornament-gem" aria-hidden>
              <circle cx="2.5" cy="2.5" r="1.5" opacity="0.65" />
            </svg>
            <svg width="12" height="7" viewBox="0 0 10 6" fill="none" aria-hidden>
              <polygon points="5,0 8,3 5,6 2,3" opacity="0.85" />
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
    </>
  );
}
