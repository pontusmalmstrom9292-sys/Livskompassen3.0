import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadFreeportTheme, saveFreeportTheme, type FreeportThemeId } from './freeportThemes';
import { FreeportChromeShell } from './components/FreeportChromeShell';
import { FreeportThemeSwitcher } from './components/FreeportThemeSwitcher';
import { FreeportHemV3Lab } from './components/FreeportHemV3Lab';
import { FreeportEkonomiLab } from './components/FreeportEkonomiLab';
import { FreeportResurserLab } from './components/FreeportResurserLab';
import { FreeportDagbokLab } from './components/FreeportDagbokLab';
import { FreeportInstallningarLab } from './components/FreeportInstallningarLab';
import { FreeportChameleonLive } from './components/FreeportChameleonLive';
import { FreeportSuperhubPlayground } from './components/FreeportSuperhubPlayground';
import { FreeportPlaneringHub } from './components/FreeportPlaneringHub';
import { FreeportHjartatHub } from './components/FreeportHjartatHub';
import { FreeportMabraHub } from './components/FreeportMabraHub';
import { FreeportFamiljenHub } from './components/FreeportFamiljenHub';
import { getDefaultTarget, type FreeportChameleonTarget } from './freeportChameleonBridge';

type PanelId =
  | 'hem'
  | 'ekonomi'
  | 'resurser'
  | 'dagbok'
  | 'installningar'
  | 'chameleon'
  | 'live'
  | 'planering'
  | 'hjartat'
  | 'mabra'
  | 'familjen';

const PANELS: { id: PanelId; label: string }[] = [
  { id: 'hem', label: 'HEM (exakt)' },
  { id: 'ekonomi', label: 'EKONOMI (exakt)' },
  { id: 'resurser', label: 'RESURSER (exakt)' },
  { id: 'dagbok', label: 'DAGBOK (exakt)' },
  { id: 'installningar', label: 'INSTÄLLNINGAR (exakt)' },
  { id: 'chameleon', label: 'Chameleon live' },
  { id: 'hjartat', label: 'Hjärtat hub' },
  { id: 'mabra', label: 'MåBra hub' },
  { id: 'familjen', label: 'Familjen hub' },
  { id: 'live', label: 'Supermoduler (full)' },
  { id: 'planering', label: 'Planering hub' },
];

/**
 * Design Freeport — Chameleon Supermodule + Tactile Mid-Depth sandbox.
 * Prod orörd. Research: docs/evaluations/2026-06-18-design-freeport-research.md
 */
export function DesignFreeportPage() {
  const [themeId, setThemeId] = useState<FreeportThemeId>(() => loadFreeportTheme());
  const [panel, setPanel] = useState<PanelId>('hem');
  const [lowCapacity, setLowCapacity] = useState(false);
  const [status, setStatus] = useState('Välj zon → kort → chameleon byter delegate in-place.');
  const [chameleonTarget, setChameleonTarget] = useState<FreeportChameleonTarget>(() =>
    getDefaultTarget('hjartat'),
  );

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
            Tactile Mid-Depth · Chameleon delegates · Modell A. Prod på{' '}
            <Link to="/" className="design-freeport__link">
              /
            </Link>{' '}
            är orörd. Flow P1–P7: inga bulk-verktyg — se{' '}
            <code className="text-[10px] opacity-80">docs/evaluations/2026-06-18-flow-verktyg-beslut.md</code>
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
        {panel === 'ekonomi' ? <FreeportEkonomiLab onStatus={setStatus} /> : null}
        {panel === 'resurser' ? <FreeportResurserLab onStatus={setStatus} /> : null}
        {panel === 'dagbok' ? <FreeportDagbokLab onStatus={setStatus} /> : null}
        {panel === 'installningar' ? <FreeportInstallningarLab onStatus={setStatus} /> : null}
        {panel === 'chameleon' ? (
          <FreeportChameleonLive
            target={chameleonTarget}
            onTargetChange={setChameleonTarget}
            onStatus={setStatus}
          />
        ) : null}
        {panel === 'hjartat' ? (
          <FreeportHjartatHub lowCapacity={lowCapacity} onStatus={setStatus} />
        ) : null}
        {panel === 'mabra' ? (
          <FreeportMabraHub lowCapacity={lowCapacity} onStatus={setStatus} />
        ) : null}
        {panel === 'familjen' ? <FreeportFamiljenHub onStatus={setStatus} /> : null}
        {panel === 'live' ? <FreeportSuperhubPlayground /> : null}
        {panel === 'planering' ? <FreeportPlaneringHub /> : null}
      </div>
    </FreeportChromeShell>
  );
}

export default DesignFreeportPage;
