import { useState } from 'react';
import { FreeportValvetLab } from './FreeportValvetLab';
import { FreeportBarnfokusLab } from './FreeportBarnfokusLab';
import { FreeportLivsloggLab } from './FreeportLivsloggLab';
import { FreeportKanbanLab } from './FreeportKanbanLab';
import { FreeportInkorgLab } from './FreeportInkorgLab';
import { FreeportCheckinLab } from './FreeportCheckinLab';
import { FreeportMonsterLab } from './FreeportMonsterLab';
import { FreeportKunskapsbankLab } from './FreeportKunskapsbankLab';
import { FreeportAktorskartaLab } from './FreeportAktorskartaLab';
import { FreeportDossierLab } from './FreeportDossierLab';
import { FreeportProfilLab } from './FreeportProfilLab';
import { FreeportHemLab } from './FreeportHemLab';
import { FreeportDagbokLab } from './FreeportDagbokLab';
import { FreeportEkonomiLab } from './FreeportEkonomiLab';
import { FreeportInställningarLab } from './FreeportInstallningarLab';

export type PremiumScreenId =
  | 'hem'
  | 'dagbok'
  | 'ekonomi'
  | 'valvet'
  | 'barnfokus'
  | 'livslogg'
  | 'kanban'
  | 'inkorg'
  | 'checkin'
  | 'monster'
  | 'kunskapsbank'
  | 'aktorskarta'
  | 'dossier'
  | 'profil'
  | 'installningar';

export const PREMIUM_SCREENS: { id: PremiumScreenId; label: string }[] = [
  { id: 'hem', label: 'Hem' },
  { id: 'dagbok', label: 'Dagbok' },
  { id: 'ekonomi', label: 'Ekonomi' },
  { id: 'valvet', label: 'Valvet' },
  { id: 'barnfokus', label: 'Barnfokus' },
  { id: 'livslogg', label: 'Livslogg' },
  { id: 'kanban', label: 'Kanban' },
  { id: 'inkorg', label: 'Inkorg' },
  { id: 'checkin', label: 'Check-in' },
  { id: 'monster', label: 'Mönster' },
  { id: 'kunskapsbank', label: 'Kunskapsbank' },
  { id: 'aktorskarta', label: 'Aktörskarta' },
  { id: 'dossier', label: 'Dossier' },
  { id: 'profil', label: 'Profil' },
  { id: 'installningar', label: 'Inställningar' },
];

type Props = {
  onStatus?: (msg: string) => void;
};

/** Executive Premium — alla mock-skärmar (80/15/5, --fp-* tokens). */
export function FreeportPremiumScreensLab({ onStatus }: Props) {
  const [screen, setScreen] = useState<PremiumScreenId>('hem');

  return (
    <div className="design-freeport__premium-gallery" data-premium-screen={screen}>
      <p className="design-freeport__premium-gallery-banner">
        <strong>Executive Premium</strong> — navy + guld, mockdata only. Prod på{' '}
        <code>/</code> är orörd. Välj skärm för pixel-jämförelse.
      </p>
      <div className="design-freeport__premium-gallery-tabs" role="tablist" aria-label="Premium-skärmar">
        {PREMIUM_SCREENS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={screen === item.id}
            className={[
              'design-freeport__premium-gallery-tab',
              screen === item.id ? 'design-freeport__premium-gallery-tab--on' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              setScreen(item.id);
              onStatus?.(`Premium: ${item.label}`);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {screen === 'hem' ? <FreeportHemLab onStatus={onStatus} /> : null}
      {screen === 'dagbok' ? <FreeportDagbokLab onStatus={onStatus} /> : null}
      {screen === 'ekonomi' ? <FreeportEkonomiLab onStatus={onStatus} /> : null}
      {screen === 'valvet' ? <FreeportValvetLab onStatus={onStatus} /> : null}
      {screen === 'barnfokus' ? <FreeportBarnfokusLab onStatus={onStatus} /> : null}
      {screen === 'livslogg' ? <FreeportLivsloggLab onStatus={onStatus} /> : null}
      {screen === 'kanban' ? <FreeportKanbanLab onStatus={onStatus} /> : null}
      {screen === 'inkorg' ? <FreeportInkorgLab onStatus={onStatus} /> : null}
      {screen === 'checkin' ? <FreeportCheckinLab onStatus={onStatus} /> : null}
      {screen === 'monster' ? <FreeportMonsterLab onStatus={onStatus} /> : null}
      {screen === 'kunskapsbank' ? <FreeportKunskapsbankLab onStatus={onStatus} /> : null}
      {screen === 'aktorskarta' ? <FreeportAktorskartaLab onStatus={onStatus} /> : null}
      {screen === 'dossier' ? <FreeportDossierLab onStatus={onStatus} /> : null}
      {screen === 'profil' ? <FreeportProfilLab onStatus={onStatus} /> : null}
      {screen === 'installningar' ? <FreeportInställningarLab onStatus={onStatus} /> : null}
    </div>
  );
}
