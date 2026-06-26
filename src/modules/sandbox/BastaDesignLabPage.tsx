import { Link } from 'react-router-dom';
import { BastaDesignApp } from './basta-design/BastaDesignApp';

/**
 * Bästa design — Figma-export som interaktiv labsida.
 * Prod orörd. Välj tema «Bästa design» i Theme Lab för prod-färger.
 */
export function BastaDesignLabPage() {
  return (
    <>
      <div className="basta-design-lab__bar">
        <Link to="/">← Prod</Link>
        <span className="basta-design-lab__badge">Figma-ref · mockdata</span>
        <Link to="/dev/theme-lab">Theme Lab</Link>
      </div>
      <BastaDesignApp />
    </>
  );
}

export default BastaDesignLabPage;
