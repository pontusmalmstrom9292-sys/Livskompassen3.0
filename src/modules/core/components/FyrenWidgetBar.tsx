import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  List,
  Mic,
  PenLine,
  Plus,
  Shield,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useLongPress } from '../hooks/useLongPress';

const WIDGET_ACTIONS = [
  { id: 'record', label: 'Inspelning', icon: Mic, to: '/widget/inspelning?autostart=1' },
  { id: 'note', label: 'Anteckning', icon: PenLine, to: '/widget/anteckning' },
  { id: 'list', label: 'Lista', icon: List, to: '/projekt/ny' },
  { id: 'plan', label: 'Planering', icon: Calendar, to: '/planering' },
  { id: 'valv', label: 'Valv', icon: Shield, to: '/dagbok?tab=bevis' },
  { id: 'projekt', label: 'Projekt', icon: Plus, to: '/projekt/ny' },
] as const;

/** In-app Fyren Edge — samma åtgärder som hemskärms-widgets WH1–WH5. */
export function FyrenWidgetBar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const prickPress = useLongPress({
    onLongPress: () => navigate('/dagbok?tab=bevis'),
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
        {WIDGET_ACTIONS.map(({ id, label, icon: Icon, to }) => (
          <Link
            key={id}
            to={to}
            className="fyren-widget-bar__action"
            title={label}
            aria-label={label}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.65} />
            <span className="fyren-widget-bar__label">{label}</span>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}
