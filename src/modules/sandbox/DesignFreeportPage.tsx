import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadFreeportTheme, saveFreeportTheme, type FreeportThemeId } from './freeportThemes';
import { FreeportChromeShell } from './components/FreeportChromeShell';
import { FreeportThemeSwitcher } from './components/FreeportThemeSwitcher';
import { FreeportHemV3Lab } from './components/FreeportHemV3Lab';
import { FreeportFptiRefLab } from './components/FreeportFptiRefLab';
import { FreeportSuperhubPlayground } from './components/FreeportSuperhubPlayground';
import { FreeportPlaneringHub } from './components/FreeportPlaneringHub';
import { FreeportHjartatHub } from './components/FreeportHjartatHub';
import { FreeportMabraHub } from './components/FreeportMabraHub';
import { FreeportFamiljenHub } from './components/FreeportFamiljenHub';

type PanelId =
  | 'hem'
  | 'hjartat'
  | 'mabra'
  | 'familjen'
  | 'planering'
  | 'live'
  | 'fpti-ref';

const PANELS: { id: PanelId; label: string }[] = [
  { id: 'hem', label: 'Hem (Modell A)' },
  { id: 'hjartat', label: 'Hjärtat hub' },
  { id: 'mabra', label: 'MåBra hub' },
  { id: 'familjen', label: 'Familjen hub' },
  { id: 'planering', label: 'Planering hub' },
  { id: 'live', label: 'Supermoduler (full)' },
  { id: 'fpti-ref', label: 'FP-TI ref (mock)' },
];

/**
 * Design Freeport — Modell A kanon + Chameleon delegates + tactile skin.
 * Prod orörd. Research: docs/evaluations/2026-06-18-design-freeport-research.md
 */
export function DesignFreeportPage() {
  const [themeId, setThemeId] = useState<FreeportThemeId>(() => loadFreeportTheme());
  const [panel, setPanel] = useState<PanelId>('hem');
  const [lowCapacity, setLowCapacity] = useState(false);
  const [status, setStatus] = useState('Modell A: kompass → utforska → chameleon morph in-place.');

  const handleTheme = useCallback((id: FreeportThemeId) => {
    setThemeId(id);
    saveFreeportTheme(id);
  }, []);

  return (
    <FreeportChromeShell themeId={themeId}>
      <div className="design-freeport__page">
        <header className="design-freeport__header">
          <h1 className="design-freeport__title">Design Freeport</h1>
          <p className="design-freeport__hint">
            <strong>Hem (Modell A)</strong> är kanon — live Chameleon + kompassmodul.{' '}
            <strong>FP-TI ref</strong> är statiska pixel-mockar. Prod på{' '}
            <Link to="/" className="design-freeport__link">
              /
            </Link>{' '}
            är orörd.
          </p>

          <FreeportThemeSwitcher activeId={themeId} onChange={handleTheme} />

          <div className="design-freeport__tabs">
            {PANELS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`design-freeport__tab${panel === p.id ? ' design-freeport__tab--on' : ''}`}
                onClick={() => setPanel(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {(panel === 'hem' || panel === 'hjartat' || panel === 'mabra') ? (
            <label className="mt-3 flex items-center gap-2 text-xs text-[var(--fp-text-muted)]">
              <input
                type="checkbox"
                checked={lowCapacity}
                onChange={(e) => setLowCapacity(e.target.checked)}
              />
              Simulera låg kapacitet (färre kort / lugn triad)
            </label>
          ) : null}

          <p className="design-freeport__status mt-2" aria-live="polite">
            {status}
          </p>

          <div className="design-freeport__links">
            <Link to="/dev/theme-lab" className="design-freeport__link">
              Theme Lab
            </Link>
            <Link to="/dev/hub-lab" className="design-freeport__link">
              Hub Lab
            </Link>
            <Link to="/dev/obsidian-depth-v2" className="design-freeport__link">
              Depth v2
            </Link>
            <Link to="/dev/obsidian-forge" className="design-freeport__link">
              Forge
            </Link>
          </div>
        </header>

        {panel === 'hem' ? (
          <FreeportHemV3Lab lowCapacity={lowCapacity} onStatus={setStatus} />
        ) : null}
        {panel === 'hjartat' ? (
          <FreeportHjartatHub lowCapacity={lowCapacity} onStatus={setStatus} />
        ) : null}
        {panel === 'mabra' ? (
          <FreeportMabraHub lowCapacity={lowCapacity} onStatus={setStatus} />
        ) : null}
        {panel === 'familjen' ? <FreeportFamiljenHub onStatus={setStatus} /> : null}
        {panel === 'planering' ? <FreeportPlaneringHub /> : null}
        {panel === 'live' ? <FreeportSuperhubPlayground /> : null}
        {panel === 'fpti-ref' ? <FreeportFptiRefLab onStatus={setStatus} /> : null}
      </div>
    </FreeportChromeShell>
  );
}

export default DesignFreeportPage;
