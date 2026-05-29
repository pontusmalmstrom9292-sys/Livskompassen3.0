import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { LivskompassBrandLockup } from '../ui/LivskompassBrandLockup';
import { getHeaderPageLabel } from '../navigation/headerPageLabel';

export function AppHeaderBrand() {
  const location = useLocation();
  const pageLabel = getHeaderPageLabel(location.pathname);
  const showPageBadge = pageLabel && pageLabel !== 'Hem';

  return (
    <Link
      to="/"
      className="app-header__brand app-header__brand--kanon app-header__brand-link"
      aria-label="Livskompassen — hem"
    >
      <LivskompassBrandLockup layout="inline" />
      {showPageBadge ? (
        <span className="app-header__page-badge" aria-current="page">
          {pageLabel}
        </span>
      ) : null}
    </Link>
  );
}
