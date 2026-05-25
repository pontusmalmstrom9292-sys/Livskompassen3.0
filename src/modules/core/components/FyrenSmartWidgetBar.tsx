import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, ChevronDown, ChevronUp, Clock, List, Lock, Wallet } from 'lucide-react';
import { clsx } from 'clsx';
import { useLongPress } from '../hooks/useLongPress';
import { LivskompassMark } from '../ui/LivskompassMark';
import { WidgetMicIcon, WidgetNoteIcon } from '../ui/widget-icons';
import { getPageContextSummary } from '../navigation/pageContextSummary';

type BarState = 'hidden' | 'peek' | 'expanded';

type QuickActionId =
  | 'inkop'
  | 'planering'
  | 'arbetsliv'
  | 'note'
  | 'record'
  | 'ekonomi'
  | 'kompass';

const STORAGE_HIDDEN = 'livskompassen_smart_widget_hidden';

const QUICK_ACTIONS: { id: QuickActionId; label: string; to: string }[] = [
  { id: 'inkop', label: 'Inköpslista', to: '/projekt/ny' },
  { id: 'planering', label: 'Planering', to: '/planering' },
  { id: 'arbetsliv', label: 'Arbetsliv', to: '/arbetsliv?tab=stampla' },
  { id: 'note', label: 'Anteckning', to: '/widget/anteckning' },
  { id: 'record', label: 'Inspelning', to: '/widget/inspelning?autostart=1' },
  { id: 'ekonomi', label: 'Ekonomi', to: '/vardagen?tab=ekonomi' },
  { id: 'kompass', label: 'Hem', to: '/' },
];

const PEEK_DUAL = [
  { id: 'note' as const, label: 'Snabbanteckning', to: '/widget/anteckning' },
  { id: 'record' as const, label: 'Tyst inspelning', to: '/widget/inspelning?autostart=1' },
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
    case 'ekonomi':
      return <Wallet className={cls} strokeWidth={1.5} />;
    case 'kompass':
      return <LivskompassMark className="h-5 w-5 text-accent" />;
    default:
      return null;
  }
}

/** Snabbwidget — hidden → peek (I-glass dual) → expanded. */
export function FyrenSmartWidgetBar() {
  const [state, setState] = useState<BarState>('hidden');
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const pageSummary = getPageContextSummary(location.pathname, location.search);

  const persistHidden = useCallback((hidden: boolean) => {
    try {
      localStorage.setItem(STORAGE_HIDDEN, hidden ? 'true' : 'false');
    } catch {
      /* ignore */
    }
  }, []);

  const valvLongPress = useLongPress({
    onLongPress: () => navigate('/dagbok?tab=bevis'),
    onClick: () => {},
    delayMs: 3000,
  });

  const { progress, isHolding, ...valvHandlers } = valvLongPress;

  useEffect(() => {
    if (location.pathname.startsWith('/widget')) return;
    try {
      if (localStorage.getItem(STORAGE_HIDDEN) === 'true') {
        setState('hidden');
        return;
      }
    } catch {
      /* ignore */
    }
    if (location.pathname === '/') {
      setState('peek');
    } else {
      setState((s) => (s === 'expanded' ? 'hidden' : s));
    }
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
          onClick={() => setState(isHome ? 'peek' : 'hidden')}
        />
      ) : null}

      <div
        className={clsx(
          'fyren-smart-bar',
          state === 'hidden' && 'fyren-smart-bar--hidden',
          state === 'peek' && 'fyren-smart-bar--peek',
          state === 'expanded' && 'fyren-smart-bar--expanded',
          isHome && 'fyren-smart-bar--glass-skin',
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
            aria-label="Visa snabbanteckning och tyst inspelning"
            style={
              progress > 0
                ? ({ '--fyren-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
                : undefined
            }
            onClick={() => setState('peek')}
            {...valvHandlers}
          >
            <ChevronUp className="h-3 w-3 text-accent" strokeWidth={1.5} />
          </button>
        ) : null}

        {state === 'peek' ? (
          <div className="fyren-smart-bar__peek-panel">
            <button
              type="button"
              className="fyren-smart-bar__compass-btn"
              aria-label="Fler snabbval"
              onClick={() => setState('expanded')}
              {...valvHandlers}
            >
              <LivskompassMark className="h-6 w-6 text-accent" />
            </button>

            <div className="fyren-smart-bar__dual">
              {PEEK_DUAL.map((item, index) => (
                <div key={item.id} className="flex min-w-0 flex-1 items-stretch">
                  {index > 0 ? <div className="fyren-smart-bar__dual-divider" aria-hidden /> : null}
                  <button
                    type="button"
                    className="fyren-smart-bar__dual-action"
                    onClick={() => goTo(item.to)}
                  >
                    <span className="fyren-smart-bar__orbit-icon" aria-hidden>
                      {item.id === 'note' ? (
                        <WidgetNoteIcon className="h-5 w-5" />
                      ) : (
                        <WidgetMicIcon className="h-5 w-5" />
                      )}
                    </span>
                    <span className="text-center text-xs font-medium text-text sm:text-sm">
                      {item.label}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="fyren-smart-bar__peek-chevron"
              aria-label="Dölj snabbpanel"
              onClick={() => setState('hidden')}
            >
              <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        ) : null}

        {state === 'expanded' ? (
          <div className="fyren-smart-bar__expanded-panel">
            <button
              type="button"
              className="fyren-smart-bar__drag-handle"
              aria-label="Tillbaka till snabbpanel"
              onClick={() => setState('peek')}
            />

            <p className="fyren-smart-bar__panel-title">Snabbåtkomst</p>
            {!isHome ? (
              <p className="fyren-smart-bar__context-hint text-xs text-text-dim">
                <span className="text-text-muted">{pageSummary.title}</span> — {pageSummary.body}
              </p>
            ) : null}

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
              <span>Håll 3s på kompass · låst zon</span>
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
