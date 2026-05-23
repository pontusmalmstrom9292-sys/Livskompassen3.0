import { useState } from 'react';
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

  if (location.pathname.startsWith('/widget')) return null;

  return (
    <div
      className={clsx('fyren-widget-bar', open && 'fyren-widget-bar--open')}
      aria-label="Snabbwidget"
    >
      <button
        type="button"
        className="fyren-widget-bar__prick"
        aria-expanded={open}
        aria-label={open ? 'Stäng snabbmeny' : 'Öppna snabbwidget'}
        onClick={() => setOpen((o) => !o)}
        onDoubleClick={(e) => {
          e.preventDefault();
          navigate('/widget/inspelning?autostart=1');
        }}
      />

      <div className="fyren-widget-bar__strip" hidden={!open}>
        {WIDGET_ACTIONS.map(({ id, label, icon: Icon, to }) => (
          <Link
            key={id}
            to={to}
            className="fyren-widget-bar__action"
            title={label}
            onClick={() => setOpen(false)}
          >
            <Icon className="h-4 w-4" strokeWidth={1.65} />
            <span className="fyren-widget-bar__label">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
