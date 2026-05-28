import { clsx } from 'clsx';
import { HubChromeIconTile } from '../ui/HubChromeIconTile';
import { DockHubGlyph, type DockGlyphId } from './DockHubGlyphs';

type Props = {
  label: string;
  glyphId: DockGlyphId;
  active?: boolean;
  variant?: 'slot' | 'side';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Dock-knapp — L2 chrome-platta + premium guld-glyph. */
export function DockNavButton({
  label,
  glyphId,
  active = false,
  variant = 'slot',
  className,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={clsx(
        'dock-nav-btn',
        variant === 'side' && 'dock-nav-btn--side',
        active && 'dock-nav-btn--active',
        className,
      )}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      {...rest}
    >
      <HubChromeIconTile
        active={active}
        variant={variant === 'side' ? 'dock-side' : 'dock'}
      >
        <DockHubGlyph id={glyphId} className="dock-nav-btn__glyph" />
      </HubChromeIconTile>
      <span className="dock-nav-btn__label">{label}</span>
    </button>
  );
}

type LinkFaceProps = {
  label: string;
  glyphId: DockGlyphId;
  active?: boolean;
  variant?: 'slot' | 'side';
};

/** Innehåll för NavLink (ingen knapp i knapp). */
export function DockNavLinkFace({ label, glyphId, active, variant = 'side' }: LinkFaceProps) {
  return (
    <>
      <HubChromeIconTile
        active={active}
        variant={variant === 'side' ? 'dock-side' : 'dock'}
      >
        <DockHubGlyph id={glyphId} className="dock-nav-btn__glyph" />
      </HubChromeIconTile>
      <span className={clsx('dock-nav-btn__label', active && 'dock-nav-btn__label--active')}>
        {label}
      </span>
    </>
  );
}
