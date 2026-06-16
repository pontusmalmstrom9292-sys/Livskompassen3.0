import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { LivskompassBrandLockup } from '../ui/LivskompassBrandLockup';
import { getHeaderPageLabel } from '../navigation/headerPageLabel';
import { useCapacityScore } from '../store/useCapacityGate';

export function AppHeaderBrand() {
  const location = useLocation();
  const pageLabel = getHeaderPageLabel(location.pathname, location.search);
  const showPageBadge = pageLabel && pageLabel !== 'Hem';
  const capacityScore = useCapacityScore();
  const isLowCapacity = capacityScore > 0 && capacityScore < 50;
  const isHighCapacity = capacityScore >= 50;

  return (
    <Link
      to="/"
      className="app-header__brand app-header__brand--kanon app-header__brand-link"
      aria-label="Livskompassen — hem"
    >
      <LivskompassBrandLockup layout="header" />
      <span 
        className={clsx(
          "fyren-ambient-indicator", 
          isLowCapacity && "fyren-ambient-indicator--low",
          isHighCapacity && "fyren-ambient-indicator--normal"
        )} 
        aria-hidden="true"
      />
      {showPageBadge ? (
        <span className="app-header__page-badge" aria-current="page">
          {pageLabel}
        </span>
      ) : null}
    </Link>
  );
}
