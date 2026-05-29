import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { DashboardPage } from '../../wellbeing/compasses/components/DashboardPage';
import { getCompassAdvice, getCompassFlowMeta } from '../../wellbeing/compasses/utils/compassAdvice';
import { getDefaultCompassByTime } from '../../wellbeing/compasses/utils/compassTime';
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
            className="dagens-riktning-card__cta"
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
            <DashboardPage
              variant="module"
              forcedFlow={flow}
              onCheckInSaved={() => {
                onCheckInSaved?.();
                onOpenChange(false);
              }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
