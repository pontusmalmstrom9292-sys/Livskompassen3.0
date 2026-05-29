import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getHeaderPageLabel } from '../navigation/headerPageLabel';

const WORDMARK_SRC = '/design/header/livskompassen-wordmark.png';

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
      <img
        src={WORDMARK_SRC}
        alt="Livskompassen"
        className="app-header__wordmark"
        width={220}
        height={40}
        decoding="async"
      />
      <div className="app-header__brand-text">
        {showTagline ? (
          <span className="app-header__tagline">Kognitiv sköld</span>
        ) : null}
        {showPageBadge ? (
          <span className="app-header__page-badge" aria-current="page">
            {pageLabel}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
