import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { LivskompassMark } from '../ui/LivskompassMark';
import { getHeaderPageLabel } from '../navigation/headerPageLabel';

type Props = {
  showTagline?: boolean;
};

export function AppHeaderBrand({ showTagline = false }: Props) {
  const location = useLocation();
  const pageLabel = getHeaderPageLabel(location.pathname);
  const showPageBadge = pageLabel && pageLabel !== 'Hem';

  return (
    <Link
      to="/"
      className="app-header__brand app-header__brand--kanon app-header__brand-link"
      aria-label="Livskompassen — hem"
    >
      <div className="app-header__logo app-header__logo--kanon" aria-hidden>
        <LivskompassMark className="h-7 w-7 text-accent" />
      </div>
      <div className="app-header__brand-text">
        <span className="app-header__title app-header__title--kanon">LIVSKOMPASSEN</span>
        {showTagline ? (
          <span className="app-header__tagline">Kognitiv sköld</span>
        ) : null}
        {showPageBadge ? (
          <span className="app-header__page-badge">{pageLabel}</span>
        ) : null}
      </div>
    </Link>
  );
}
