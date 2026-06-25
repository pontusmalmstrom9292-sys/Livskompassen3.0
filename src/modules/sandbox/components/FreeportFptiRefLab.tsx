import { useState } from 'react';
import { FreeportDagbokLab } from './FreeportDagbokLab';
import { FreeportEkonomiLab } from './FreeportEkonomiLab';
import { FreeportHemLab } from './FreeportHemLab';
import { FreeportInstallningarLab } from './FreeportInstallningarLab';
import { FreeportResurserLab } from './FreeportResurserLab';

type FptiScreenId = 'hem' | 'ekonomi' | 'resurser' | 'dagbok' | 'installningar';

const SCREENS: { id: FptiScreenId; label: string }[] = [
  { id: 'hem', label: 'Hem' },
  { id: 'ekonomi', label: 'Ekonomi' },
  { id: 'resurser', label: 'Resurser' },
  { id: 'dagbok', label: 'Dagbok' },
  { id: 'installningar', label: 'Inställningar' },
];

type Props = {
  onStatus?: (msg: string) => void;
};

/** FP-TI pixel-referens — statiska mock-skärmar (ej Modell A-kanon). */
export function FreeportFptiRefLab({ onStatus }: Props) {
  const [screen, setScreen] = useState<FptiScreenId>('hem');

  return (
    <div className="design-freeport__fpti-ref">
      <p className="design-freeport__fpti-ref-banner">
        Live kanon = fliken <strong>Hem (Modell A)</strong>. Dessa skärmar är statiska
        FP-TI-referenser för pixel-jämförelse mot mockup-bilderna.
      </p>
      <div className="design-freeport__fpti-ref-tabs" role="tablist" aria-label="FP-TI mock-skärmar">
        {SCREENS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={screen === item.id}
            className={[
              'design-freeport__fpti-ref-tab',
              screen === item.id ? 'design-freeport__fpti-ref-tab--on' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              setScreen(item.id);
              onStatus?.(`FP-TI ref: ${item.label}`);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {screen === 'hem' ? <FreeportHemLab onStatus={onStatus} /> : null}
      {screen === 'ekonomi' ? <FreeportEkonomiLab onStatus={onStatus} /> : null}
      {screen === 'resurser' ? <FreeportResurserLab onStatus={onStatus} /> : null}
      {screen === 'dagbok' ? <FreeportDagbokLab onStatus={onStatus} /> : null}
      {screen === 'installningar' ? <FreeportInstallningarLab onStatus={onStatus} /> : null}
    </div>
  );
}
