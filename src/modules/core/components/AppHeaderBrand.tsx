import { Link } from 'react-router-dom';
import { LivskompassMark } from '../ui/LivskompassMark';

type Props = {
  showTagline?: boolean;
};

export function AppHeaderBrand({ showTagline = false }: Props) {
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
      </div>
    </Link>
  );
}
