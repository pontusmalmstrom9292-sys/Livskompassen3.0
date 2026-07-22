import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { CompassQuickWidgetRail } from '@/features/dailyLife/wellbeing/compasses/components/CompassQuickWidgetRail';
import { DashboardPage } from '@/features/dailyLife/wellbeing/compasses/components/DashboardPage';
import { getCompassAdvice, getCompassFlowMeta } from '@/features/dailyLife/wellbeing/compasses/utils/compassAdvice';
import { getDefaultCompassByTime } from '@/features/dailyLife/wellbeing/compasses/utils/compassTime';
import { DagensRiktningCompassIcon } from './DagensRiktningCompassIcon';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckInSaved?: () => void;
};

export function DagensRiktningCard({ open, onOpenChange, onCheckInSaved }: Props) {
  const flow = getDefaultCompassByTime();
  const meta = getCompassFlowMeta(flow);
  const advice = getCompassAdvice(flow);

  return (
    <section className="dagens-riktning" aria-label="Dagens riktning">
      <div className={clsx('dagens-riktning-card', open && 'dagens-riktning-card--open')}>
        <div className="dagens-riktning-card__main">
          <div className="dagens-riktning-card__icon-wrap">
            <DagensRiktningCompassIcon activeFlow={flow} />
          </div>

          <div className="dagens-riktning-card__body">
            <p className="dagens-riktning-card__eyebrow">
              <span className="dagens-riktning-card__active-dot" aria-hidden />
              Dagens riktning · {meta.label}
            </p>
            <p className="dagens-riktning-card__title">{meta.heroTitle}</p>
            <p className="dagens-riktning-card__quote">{advice}</p>
          </div>
        </div>

        <div className="dagens-riktning-card__actions">
          <button
            type="button"
            className="dagens-riktning-card__cta min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
            aria-expanded={open}
            onClick={() => onOpenChange(!open)}
          >
            <span>{open ? 'Stäng check-in' : 'Checka in nu'}</span>
            <ChevronDown
              className={clsx('dagens-riktning-card__cta-chevron', open && 'dagens-riktning-card__cta-chevron--open')}
              strokeWidth={1.75}
              aria-hidden
            />
          </button>
        </div>

        {open ? (
          <div className="dagens-riktning-card__panel">
            <CompassQuickWidgetRail flow={flow} className="compass-quick-widget-rail--in-module" />
            <DashboardPage
              variant="module"
              forcedFlow={flow}
              onCheckInSaved={() => {
                onCheckInSaved?.();
                onOpenChange(false);
              }}
            />
          </div>
        ) : (
          <CompassQuickWidgetRail flow={flow} compact className="compass-quick-widget-rail--below" />
        )}
      </div>
    </section>
  );
}
