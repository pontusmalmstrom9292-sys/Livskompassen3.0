import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { DashboardPage } from '../../wellbeing/compasses/components/DashboardPage';
import { getCompassFlowMeta } from '../../wellbeing/compasses/utils/compassAdvice';
import { getDefaultCompassByTime } from '../../wellbeing/compasses/utils/compassTime';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckInSaved?: () => void;
};

export function HomeCheckInPanel({ open, onOpenChange, onCheckInSaved }: Props) {
  const flow = getDefaultCompassByTime();
  const meta = getCompassFlowMeta(flow);

  return (
    <div className="home-check-in">
      <button
        type="button"
        className={clsx('home-check-in__trigger', open && 'home-check-in__trigger--open')}
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
      >
        <span>Checka in · {meta.label}</span>
        <ChevronDown
          className={clsx('h-4 w-4 transition-transform', open && 'rotate-180')}
          strokeWidth={1.5}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="home-check-in__panel">
          <DashboardPage
            variant="module"
            forcedFlow={flow}
            onCheckInSaved={onCheckInSaved}
          />
        </div>
      ) : null}
    </div>
  );
}
