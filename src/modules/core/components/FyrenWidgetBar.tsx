import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { List, Plus, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { useLongPress } from '../hooks/useLongPress';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { useStore } from '../store';
import { ChromeV5Icon } from '../ui/chromeIcons';

const GLYPH = 'h-4 w-4 shrink-0 object-contain';

function ShortcutGlyph({ src }: { src: string }) {
  return (
    <img src={src} alt="" aria-hidden draggable={false} decoding="async" className={GLYPH} />
  );
}

const WIDGET_ACTIONS: {
  id: string;
  label: string;
  to: string;
  renderIcon: () => ReactNode;
}[] = [
  {
    id: 'snabbval',
    label: 'Snabbval',
    to: '/widget/snabbval',
    renderIcon: () => <Sparkles className="h-4 w-4 shrink-0" strokeWidth={1.65} />,
  },
  {
    id: 'record',
    label: 'Inspelning',
    to: '/widget/inspelning?autostart=1',
    renderIcon: () => <ShortcutGlyph src="/icons/shortcuts/wh-inspelning.svg" />,
  },
  {
    id: 'note',
    label: 'Anteckning',
    to: '/widget/anteckning',
    renderIcon: () => <ChromeV5Icon category="dagbok" className={GLYPH} />,
  },
  {
    id: 'list',
    label: 'Lista',
    to: '/projekt/ny',
    renderIcon: () => <List className="h-4 w-4 shrink-0" strokeWidth={1.65} />,
  },
  {
    id: 'plan',
    label: 'Planering',
    to: '/planering?tab=handling',
    renderIcon: () => <ChromeV5Icon category="planering" className={GLYPH} />,
  },
  {
    id: 'valv',
    label: 'Valv',
    to: '/dagbok?tab=bevis',
    renderIcon: () => <ChromeV5Icon category="valv" className={GLYPH} />,
  },
  {
    id: 'projekt',
    label: 'Projekt',
    to: '/projekt/ny',
    renderIcon: () => <Plus className="h-4 w-4 shrink-0" strokeWidth={1.65} />,
  },
];

/** In-app Fyren Edge — samma åtgärder som hemskärms-widgets WH1–WH5. */
export function FyrenWidgetBar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);

  const prickPress = useLongPress({
    onLongPress: () =>
      void openValvViaFyren(navigate, {
        onDenied: (message) => setSystemError(message),
      }),
    onClick: () => setOpen((o) => !o),
    delayMs: 3000,
  });

  const { progress, isHolding, onClick: prickClick, ...prickHandlers } = prickPress;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (location.pathname.startsWith('/widget')) return null;

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fyren-widget-bar__backdrop"
          aria-label="Stäng snabbmeny"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={clsx('fyren-widget-bar', open && 'fyren-widget-bar--open')}
        aria-label="Snabbwidget"
      >
      <button
        type="button"
        className={clsx(
          'fyren-widget-bar__prick',
          isHolding && 'fyren-widget-bar__prick--holding',
        )}
        aria-expanded={open}
        aria-label={open ? 'Stäng snabbmeny' : 'Öppna snabbwidget'}
        style={
          progress > 0
            ? ({ '--fyren-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
            : undefined
        }
        onClick={prickClick}
        onDoubleClick={(e) => {
          e.preventDefault();
          navigate('/widget/inspelning?autostart=1');
        }}
        {...prickHandlers}
      />

      <div
        className={clsx('fyren-widget-bar__strip', !open && 'fyren-widget-bar__strip--closed')}
        aria-hidden={!open}
      >
        {WIDGET_ACTIONS.map(({ id, label, to, renderIcon }) => (
          <Link
            key={id}
            to={to}
            className="fyren-widget-bar__action"
            title={label}
            aria-label={label}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            {renderIcon()}
            <span className="fyren-widget-bar__label">{label}</span>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}
