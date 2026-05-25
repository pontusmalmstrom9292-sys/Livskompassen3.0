import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, ChevronDown, ChevronUp, Clock, List, Lock } from 'lucide-react';
import { clsx } from 'clsx';
import { useLongPress } from '../hooks/useLongPress';
import { LivskompassMark } from '../ui/LivskompassMark';
import { ValvArchIcon } from '../ui/ValvArchIcon';
import { WidgetMicIcon, WidgetNoteIcon } from '../ui/widget-icons';

type BarState = 'hidden' | 'expanded';

type QuickActionId =
  | 'inkop'
  | 'planering'
  | 'arbetsliv'
  | 'note'
  | 'record'
  | 'valv'
  | 'kompass';

const STORAGE_HIDDEN = 'livskompassen_smart_widget_hidden';

const QUICK_ACTIONS: { id: QuickActionId; label: string; to: string }[] = [
  { id: 'inkop', label: 'Inköpslista', to: '/projekt/ny' },
  { id: 'planering', label: 'Planering', to: '/planering' },
  { id: 'arbetsliv', label: 'Arbetsliv', to: '/arbetsliv?tab=stampla' },
  { id: 'note', label: 'Anteckning', to: '/widget/anteckning' },
  { id: 'record', label: 'Inspelning', to: '/widget/inspelning?autostart=1' },
  { id: 'valv', label: 'Valv', to: '/dagbok?tab=bevis' },
  { id: 'kompass', label: 'Hem', to: '/' },
];

function renderQuickIcon(id: QuickActionId): ReactNode {
  const cls = 'h-[1.15rem] w-[1.15rem] text-accent';
  switch (id) {
    case 'inkop':
      return <List className={cls} strokeWidth={1.5} />;
    case 'planering':
      return <Calendar className={cls} strokeWidth={1.5} />;
    case 'arbetsliv':
      return <Clock className={cls} strokeWidth={1.5} />;
    case 'note':
      return <WidgetNoteIcon className={cls} />;
    case 'record':
      return <WidgetMicIcon className={cls} />;
    case 'valv':
      return <ValvArchIcon className={cls} />;
    case 'kompass':
      return <LivskompassMark className="h-5 w-5 text-accent" />;
    default:
      return null;
  }
}

/** Kompakt snabbwidget — genvägar utan klocka (long-press 3s → Valv). */
export function FyrenSmartWidgetBar() {
  const [state, setState] = useState<BarState>('hidden');
  const location = useLocation();
  const navigate = useNavigate();

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

  const goTo = (to: string) => {
    navigate(to);
    setState('hidden');
  };

  return (
    <>
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

            <p className="fyren-smart-bar__panel-title">Snabbåtkomst</p>

            <div className="fyren-smart-bar__icon-grid">
              {QUICK_ACTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="fyren-smart-bar__icon-btn"
                  aria-label={item.label}
                  onClick={() => goTo(item.to)}
                >
                  <span className="fyren-smart-bar__icon-tile">{renderQuickIcon(item.id)}</span>
                  <span className="fyren-smart-bar__icon-label">{item.label}</span>
                </button>
              ))}
            </div>

            <footer className="fyren-smart-bar__footer">
              <Lock className="h-3 w-3 shrink-0 text-accent/80" strokeWidth={1.5} />
              <span>Håll 3s → Valv</span>
              <button
                type="button"
                className="fyren-smart-bar__hide-btn"
                aria-label="Dölj widget"
                onClick={() => setState('hidden')}
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
