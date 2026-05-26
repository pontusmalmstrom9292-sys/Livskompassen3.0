import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Anchor,
  BookHeart,
  BookOpen,
  Brain,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Focus,
  FolderKanban,
  List,
  Lock,
  Mail,
  MoreHorizontal,
  Plus,
  Sparkles,
  Sprout,
  Users,
  Wallet,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useLongPress } from '../hooks/useLongPress';
import { WidgetMicIcon, WidgetNoteIcon } from '../ui/widget-icons';
import { getPageContextSummary } from '../navigation/pageContextSummary';
import {
  getHubContextSlots,
  HUB_MORE_ACTIONS,
  type HubContextIconId,
  type HubContextSlot,
  type HubMoreActionId,
} from '../navigation/hubContextBar';

type BarState = 'hidden' | 'bar' | 'more';

const STORAGE_HIDDEN = 'livskompassen_smart_widget_hidden';

function renderHubIcon(id: HubContextIconId | HubMoreActionId, className: string): ReactNode {
  const cls = className;
  const stroke = 1.5;
  switch (id) {
    case 'list':
      return <List className={cls} strokeWidth={stroke} />;
    case 'calendar':
      return <Calendar className={cls} strokeWidth={stroke} />;
    case 'clock':
      return <Clock className={cls} strokeWidth={stroke} />;
    case 'note':
      return <WidgetNoteIcon className={cls} />;
    case 'record':
      return <WidgetMicIcon className={cls} />;
    case 'wallet':
      return <Wallet className={cls} strokeWidth={stroke} />;
    case 'mail':
      return <Mail className={cls} strokeWidth={stroke} />;
    case 'folder':
      return <FolderKanban className={cls} strokeWidth={stroke} />;
    case 'focus':
      return <Focus className={cls} strokeWidth={stroke} />;
    case 'plus':
      return <Plus className={cls} strokeWidth={stroke} />;
    case 'sprout':
      return <Sprout className={cls} strokeWidth={stroke} />;
    case 'book':
      return <BookOpen className={cls} strokeWidth={stroke} />;
    case 'brain':
      return <Brain className={cls} strokeWidth={stroke} />;
    case 'anchor':
      return <Anchor className={cls} strokeWidth={stroke} />;
    case 'sparkles':
      return <Sparkles className={cls} strokeWidth={stroke} />;
    case 'users':
      return <Users className={cls} strokeWidth={stroke} />;
    case 'bookheart':
      return <BookHeart className={cls} strokeWidth={stroke} />;
    default:
      return null;
  }
}

function ContextSlotButton({
  slot,
  onGo,
}: {
  slot: HubContextSlot;
  onGo: (to: string) => void;
}) {
  return (
    <button
      type="button"
      className={clsx(
        'fyren-smart-bar__context-slot',
        slot.active && 'fyren-smart-bar__context-slot--active',
      )}
      aria-label={slot.label}
      aria-current={slot.active ? 'page' : undefined}
      onClick={() => onGo(slot.to)}
    >
      <span className="fyren-smart-bar__context-icon" aria-hidden>
        {renderHubIcon(slot.icon, 'h-[1.1rem] w-[1.1rem] text-accent')}
      </span>
      <span className="fyren-smart-bar__context-label">{slot.label}</span>
    </button>
  );
}

/** Hub-kontextrad — 4 slots per hub + Mer (anteckning/inspelning m.m.). */
export function FyrenSmartWidgetBar() {
  const [state, setState] = useState<BarState>('bar');
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const pageSummary = getPageContextSummary(location.pathname, location.search);

  const hubSlots = useMemo(
    () => getHubContextSlots(location.pathname, location.search),
    [location.pathname, location.search],
  );

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
    setState((s) => (s === 'more' ? 'more' : 'bar'));
  }, [location.pathname]);

  useEffect(() => {
    if (state === 'hidden') persistHidden(true);
    else persistHidden(false);
  }, [state, persistHidden]);

  if (location.pathname.startsWith('/widget')) return null;

  const goTo = (to: string) => {
    navigate(to);
    setState('bar');
  };

  return (
    <>
      {state === 'more' ? (
        <button
          type="button"
          className="fyren-smart-bar__backdrop"
          aria-label="Stäng mer-menyn"
          onClick={() => setState('bar')}
        />
      ) : null}

      <div
        className={clsx(
          'fyren-smart-bar',
          state === 'hidden' && 'fyren-smart-bar--hidden',
          state === 'bar' && 'fyren-smart-bar--bar',
          state === 'more' && 'fyren-smart-bar--more',
          isHome && state === 'bar' && 'fyren-smart-bar--glass-skin',
        )}
        aria-label="Hub-kontextrad"
      >
        {state === 'hidden' ? (
          <button
            type="button"
            className={clsx(
              'fyren-smart-bar__handle',
              isHolding && 'fyren-smart-bar__handle--holding',
            )}
            aria-expanded={false}
            aria-label="Visa hub-kontextrad"
            style={
              progress > 0
                ? ({ '--fyren-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
                : undefined
            }
            onClick={() => setState('bar')}
            {...valvHandlers}
          >
            <ChevronUp className="h-3 w-3 text-accent" strokeWidth={1.5} />
          </button>
        ) : null}

        {state === 'bar' ? (
          <div className="fyren-smart-bar__context-panel">
            <div className="fyren-smart-bar__context-row">
              {hubSlots.map((slot) => (
                <ContextSlotButton key={slot.id} slot={slot} onGo={goTo} />
              ))}
              <button
                type="button"
                className="fyren-smart-bar__context-slot fyren-smart-bar__context-slot--more"
                aria-label="Fler snabbval"
                onClick={() => setState('more')}
              >
                <span className="fyren-smart-bar__context-icon" aria-hidden>
                  <MoreHorizontal className="h-[1.1rem] w-[1.1rem] text-accent" strokeWidth={1.5} />
                </span>
                <span className="fyren-smart-bar__context-label">Mer</span>
              </button>
            </div>
            <button
              type="button"
              className="fyren-smart-bar__peek-chevron"
              aria-label="Dölj kontextrad"
              onClick={() => setState('hidden')}
            >
              <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        ) : null}

        {state === 'more' ? (
          <div className="fyren-smart-bar__expanded-panel">
            <button
              type="button"
              className="fyren-smart-bar__drag-handle"
              aria-label="Tillbaka till kontextrad"
              onClick={() => setState('bar')}
            />

            <p className="fyren-smart-bar__panel-title">Mer</p>
            {!isHome ? (
              <p className="fyren-smart-bar__context-hint text-xs text-text-dim">
                <span className="text-text-muted">{pageSummary.title}</span> — {pageSummary.body}
              </p>
            ) : null}

            <div className="fyren-smart-bar__icon-grid">
              {HUB_MORE_ACTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="fyren-smart-bar__icon-btn"
                  aria-label={item.label}
                  onClick={() => goTo(item.to)}
                >
                  <span className="fyren-smart-bar__icon-tile">
                    {renderHubIcon(item.icon, 'h-[1.15rem] w-[1.15rem] text-accent')}
                  </span>
                  <span className="fyren-smart-bar__icon-label">{item.label}</span>
                </button>
              ))}
            </div>

            <footer className="fyren-smart-bar__footer">
              <Lock className="h-3 w-3 shrink-0 text-accent/80" strokeWidth={1.5} />
              <span>Håll 3s på kompass i dock · låst zon</span>
              <button
                type="button"
                className="fyren-smart-bar__hide-btn"
                aria-label="Dölj kontextrad"
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
