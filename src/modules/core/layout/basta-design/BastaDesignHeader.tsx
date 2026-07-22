/* PROTECTED BASTA-DESIGN CHROME LOCK — docs/design/BASTA-DESIGN-CHROME-LOCK.md · npm run smoke:basta-dock-lock */
import { useState } from 'react';
import { AccountAuthMenu } from '../../auth/AccountAuthMenu';
import { KompisHeaderVaultButton } from '../../components/KompisHeaderVaultButton';
import { ResurserOverlay } from '../../navigation/ResurserOverlay';
import { useStore } from '../../store';
import { HeaderMenuGlyph } from '../../ui/HeaderChromeGlyphs';
import { ExecutiveDecorCompass } from '../../ui/executive/ExecutiveDecorCompass';
import { BastaDesignResurserWidget } from './BastaDesignResurserWidget';

type Props = {
  accountOpen: boolean;
  onAccountOpenChange: (open: boolean) => void;
  onMenuClick: () => void;
};

/** Referens-header — en rad, glaskrona, Resurser-ikon vänster om Livskompassen. */
export function BastaDesignHeader({ accountOpen, onAccountOpenChange, onMenuClick }: Props) {
  const kompisAuraActive = useStore((s) => s.system.kompisAuraActive);
  const [resurserOpen, setResurserOpen] = useState(false);
  const [resurserWidgetOpen, setResurserWidgetOpen] = useState(false);

  return (
    <>
      <ResurserOverlay open={resurserOpen} onClose={() => setResurserOpen(false)} />
      <header className="app-header app-header--basta-crown">
        <div className="app-header__inner app-header__inner--basta-crown">
          <div className="basta-design__header-crown">
            <div className="design-pack-header design-pack-header--basta-ref">
              <div className="design-pack-header__side design-pack-header__side--left">
                <button
                  type="button"
                  className="design-pack-header__menu header-chrome-btn header-chrome-btn--round min-h-11 min-w-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
                  aria-label="Öppna meny"
                  onClick={onMenuClick}
                >
                  <HeaderMenuGlyph className="header-chrome-btn__glyph h-5 w-5 text-accent" />
                </button>
              </div>

              <div className="design-pack-header__center design-pack-header__center--basta">
                <BastaDesignResurserWidget
                  placement="header-icon"
                  open={resurserWidgetOpen}
                  onToggle={() => setResurserWidgetOpen((v) => !v)}
                  onOpenFull={() => {
                    setResurserWidgetOpen(false);
                    setResurserOpen(true);
                  }}
                />
                <div className="basta-design__header-brand-stack">
                  <h1 className="design-pack-header__title basta-design__header-title">Livskompassen</h1>
                  <div className="basta-design__header-ornament" aria-hidden>
                    <div className="basta-design__header-ornament-line" />
                    <svg width="12" height="7" viewBox="0 0 10 6" fill="none" aria-hidden>
                      <polygon points="5,0 8,3 5,6 2,3" opacity="0.85" />
                    </svg>
                    <svg
                      width="7"
                      height="7"
                      viewBox="0 0 5 5"
                      fill="none"
                      className="basta-design__header-ornament-gem"
                      aria-hidden
                    >
                      <circle cx="2.5" cy="2.5" r="1.5" opacity="0.65" />
                    </svg>
                    <svg width="12" height="7" viewBox="0 0 10 6" fill="none" aria-hidden>
                      <polygon points="5,0 8,3 5,6 2,3" opacity="0.85" />
                    </svg>
                    <div className="basta-design__header-ornament-line" />
                  </div>
                </div>
              </div>

              <div className="design-pack-header__side design-pack-header__side--right">
                <div className="design-pack-header__actions">
                  <AccountAuthMenu
                    open={accountOpen}
                    onOpenChange={onAccountOpenChange}
                    compactTrigger
                    chromeVariant="executive"
                  />
                  <span className="basta-design__header-vault">
                    <KompisHeaderVaultButton kompisAuraActive={kompisAuraActive} variant="executive-header" />
                  </span>
                  <span className="exec-header-compass-mark" aria-hidden>
                    <ExecutiveDecorCompass size="sm" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
