import { Link } from 'react-router-dom';
import { ChevronRight, Compass } from 'lucide-react';
import { getCompassAdvice, getCompassFlowMeta } from '../../kompasser/utils/compassAdvice';

export function DagensRiktningCard() {
  const meta = getCompassFlowMeta();
  const advice = getCompassAdvice(meta.flow);

  return (
    <Link to="/vardagen" className="dagens-riktning-card">
      <span className="dagens-riktning-card__icon-wrap" aria-hidden>
        <Compass className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <div className="dagens-riktning-card__body">
        <p className="dagens-riktning-card__eyebrow">
          Dagens riktning · {meta.label}
        </p>
        <p className="dagens-riktning-card__quote">{advice}</p>
      </div>
      <ChevronRight className="dagens-riktning-card__chevron" strokeWidth={1.5} aria-hidden />
    </Link>
  );
}
