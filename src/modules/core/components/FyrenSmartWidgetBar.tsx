import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Image,
  List,
  Lock,
  Mic,
  PenLine,
  Plus,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useLiveClock } from '../hooks/useLiveClock';
import { useLongPress } from '../hooks/useLongPress';
import { LivskompassMark } from '../ui/LivskompassMark';
import { ValvArchIcon } from '../ui/ValvArchIcon';
import { WidgetGridIcon, WidgetMicIcon, WidgetNoteIcon } from '../ui/widget-icons';

type BarState = 'hidden' | 'expanded';

type ExpandedIconKind = 'widgets' | 'record' | 'note' | 'valv' | 'kompass';

const STORAGE_HIDDEN = 'livskompassen_smart_widget_hidden';

const EXPANDED_ACTIONS: {
  id: ExpandedIconKind;
  label: string;
  to?: string;
  toggle?: boolean;
}[] = [
  { id: 'widgets', label: 'Widgetar', toggle: true },
  { id: 'record', label: 'Röstanteckning', to: '/widget/inspelning?autostart=1' },
  { id: 'note', label: 'Anteckningar', to: '/widget/anteckning' },
  { id: 'valv', label: 'Valv', to: '/dagbok?tab=bevis' },
  { id: 'kompass', label: 'Kompass', to: '/' },
];

/** Hem — höger rail enligt I-stone mockup (parallell med bottom sheet). */
const HOME_RAIL_ACTIONS = [
  { id: 'projekt', label: 'Nytt projekt', to: '/projekt/ny', Icon: Plus },
  { id: 'lista', label: 'Lista', to: '/projekt/ny', Icon: List },
  { id: 'anteckning', label: 'Anteckning', to: '/widget/anteckning', Icon: PenLine },
  { id: 'bild', label: 'Bild', to: '/projekt/ny', Icon: Image },
  { id: 'inspelning', label: 'Tyst inspelning', to: '/widget/inspelning?autostart=1', Icon: Mic },
  { id: 'planering', label: 'Planering', to: '/planering', Icon: Calendar },
  { id: 'valv', label: 'Valv', to: '/dagbok?tab=bevis', Icon: ValvArchIcon },
] as const;

function renderExpandedIcon(kind: ExpandedIconKind): ReactNode {
  const cls = 'h-5 w-5 text-accent';
  switch (kind) {
    case 'widgets':
      return <WidgetGridIcon className={cls} />;
    case 'record':
      return <WidgetMicIcon className={cls} />;
    case 'note':
      return <WidgetNoteIcon className={cls} />;
    case 'valv':
      return <ValvArchIcon className={cls} />;
    case 'kompass':
      return <LivskompassMark className="h-6 w-6 text-accent" />;
    default:
      return null;
  }
}

/** Smart bottom widget bar — hidden (handle) / expanded (klocka + ikonrad). */
export function FyrenSmartWidgetBar() {
  const [state, setState] = useState<BarState>('hidden');
  const [noteOpen, setNoteOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { time, date } = useLiveClock();

  const persistHidden = useCallback((hidden: boolean) => {
    try {
      localStorage.setItem(STORAGE_HIDDEN, hidden ? 'true' : 'false');
    } catch {
      /* ignore */
    }
  }, []);

  const handlePress = useLongPress({
    onLongPress: () => navigate('/dagbok?tab=bevis'),
    onClick: () => {
      setState((s) => (s === 'hidden' ? 'expanded' : 'hidden'));
    },
    delayMs: 3000,
  });

  const { progress, isHolding, onClick: handleClick, ...handleHandlers } = handlePress;

  useEffect(() => {
    setState((s) => (s === 'expanded' ? 'hidden' : s));
  }, [location.pathname]);

  useEffect(() => {
    if (state === 'hidden') persistHidden(true);
    else persistHidden(false);
  }, [state, persistHidden]);

  if (location.pathname.startsWith('/widget')) return null;

  const isHome = location.pathname === '/';
  const showHomeRail = isHome && state === 'hidden';

  const cycleDown = () => {
    setState('hidden');
  };

  const onAction = (item: (typeof EXPANDED_ACTIONS)[number]) => {
    if (item.toggle) {
      setState((s) => (s === 'expanded' ? 'hidden' : 'expanded'));
      return;
    }
    if (item.to) {
      navigate(item.to);
      setState('hidden');
    }
  };

  return (
    <>
      {showHomeRail ? (
        <nav className="fyren-home-rail" aria-label="Snabbåtgärder hem">
          {HOME_RAIL_ACTIONS.map(({ id, label, to, Icon }) => (
            <button
              key={id}
              type="button"
              className="fyren-home-rail__row"
              aria-label={label}
              onClick={() => navigate(to)}
            >
              <span className="fyren-home-rail__icon" aria-hidden>
                {id === 'valv' ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" strokeWidth={1.35} />
                )}
              </span>
              <span className="fyren-home-rail__label">{label}</span>
            </button>
          ))}
        </nav>
      ) : null}

      {state === 'expanded' ? (
        <button
          type="button"
          className="fyren-smart-bar__backdrop"
          aria-label="Stäng widgetpanel"
          onClick={() => setState('hidden')}
        />
      ) : null}

      <div
        className={clsx(
          'fyren-smart-bar',
          state === 'hidden' && 'fyren-smart-bar--hidden',
          state === 'expanded' && 'fyren-smart-bar--expanded',
        )}
        aria-label="Snabbwidget"
      >
        {state === 'hidden' ? (
          <button
            type="button"
            className={clsx(
              'fyren-smart-bar__handle',
              isHolding && 'fyren-smart-bar__handle--holding',
            )}
            aria-expanded={false}
            aria-label="Visa snabbwidget"
            style={
              progress > 0
                ? ({ '--fyren-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
                : undefined
            }
            onClick={() => setState('expanded')}
            onDoubleClick={(e) => {
              e.preventDefault();
              navigate('/widget/inspelning?autostart=1');
            }}
            {...handleHandlers}
          >
            <ChevronUp className="h-3 w-3 text-accent" strokeWidth={1.5} />
          </button>
        ) : null}

        {state === 'expanded' ? (
          <div className="fyren-smart-bar__expanded-panel">
            <button
              type="button"
              className="fyren-smart-bar__drag-handle"
              aria-label="Dra nedåt för att dölja"
              onClick={handleClick}
              onDoubleClick={(e) => {
                e.preventDefault();
                navigate('/widget/inspelning?autostart=1');
              }}
              {...handleHandlers}
            />

            <div className="fyren-smart-bar__clock">
              <time className="fyren-smart-bar__time tabular-nums">{time}</time>
              <p className="fyren-smart-bar__date">{date}</p>
              <div className="fyren-smart-bar__motto-line" aria-hidden>
                <span className="fyren-smart-bar__motto-dash" />
                <span className="fyren-smart-bar__motto-diamond">◆</span>
                <span className="fyren-smart-bar__motto-dash" />
              </div>
              <p className="fyren-smart-bar__motto">Fokus • Struktur • Närvaro</p>
            </div>

            <button
              type="button"
              className="fyren-smart-bar__note-row"
              aria-expanded={noteOpen}
              onClick={() => setNoteOpen((o) => !o)}
            >
              <span className="fyren-smart-bar__icon-tile fyren-smart-bar__icon-tile--sm" aria-hidden>
                <WidgetNoteIcon className="h-4 w-4 text-accent" />
              </span>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm text-text">Snabbanteckning</p>
                <p className="text-xs text-text-muted">Fånga tanken. Bevara fokus.</p>
              </div>
              <ChevronDown
                className={clsx(
                  'h-4 w-4 shrink-0 text-accent/70 transition-transform',
                  noteOpen && 'rotate-180',
                )}
                strokeWidth={1.5}
              />
            </button>

            {noteOpen ? (
              <Link
                to="/widget/anteckning"
                className="fyren-smart-bar__note-link"
                onClick={() => setState('hidden')}
              >
                Öppna snabbanteckning →
              </Link>
            ) : null}

            <div className="fyren-smart-bar__icon-grid">
              {EXPANDED_ACTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="fyren-smart-bar__icon-btn"
                  aria-label={item.label}
                  onClick={() => onAction(item)}
                >
                  <span className="fyren-smart-bar__icon-tile">{renderExpandedIcon(item.id)}</span>
                  <span className="fyren-smart-bar__icon-label">{item.label}</span>
                </button>
              ))}
            </div>

            <footer className="fyren-smart-bar__footer">
              <Lock className="h-3 w-3 shrink-0 text-accent/80" strokeWidth={1.5} />
              <span>Diskret åtkomst – dra nedåt för att dölja</span>
              <button
                type="button"
                className="fyren-smart-bar__hide-btn"
                aria-label="Dölj widget"
                onClick={cycleDown}
              >
                <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </footer>
          </div>
        ) : null}
      </div>
    </>
  );
}
