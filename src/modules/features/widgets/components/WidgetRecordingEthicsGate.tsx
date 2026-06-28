import { useCallback, useState } from 'react';

/** Delad WH1-etikgrind — samma nyckel i WidgetRecordPage och ActionDashboard. */
export const WIDGET_RECORDING_ETHICS_STORAGE_KEY = 'livskompassen_widget_recording_ethics_v1';

export function readWidgetRecordingEthicsAccepted(): boolean {
  try {
    return localStorage.getItem(WIDGET_RECORDING_ETHICS_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function writeWidgetRecordingEthicsAccepted(): void {
  localStorage.setItem(WIDGET_RECORDING_ETHICS_STORAGE_KEY, '1');
}

export function useWidgetRecordingEthicsAccepted() {
  const [accepted, setAccepted] = useState(readWidgetRecordingEthicsAccepted);

  const accept = useCallback(() => {
    writeWidgetRecordingEthicsAccepted();
    setAccepted(true);
  }, []);

  return { accepted, accept };
}

type EthicsGateMode = 'discreet' | 'standard' | 'dashboard';

type Props = {
  mode?: EthicsGateMode;
  onAccept: () => void;
  className?: string;
};

function ethicsBodyText(mode: EthicsGateMode): string {
  if (mode === 'discreet') {
    return 'Hemskärmswidgeten heter «Anteckningar» — ingen synlig inspelningsmarkering utåt.';
  }
  return 'Inspelning lagras som låst post i arkivet. Kontrollera lag om du spelar in andra.';
}

/** Saklig etikinformation före WH1-röstinspelning — ingen JADE. */
export function WidgetRecordingEthicsGate({
  mode = 'standard',
  onAccept,
  className,
}: Props) {
  return (
    <div className={className ?? 'elongated-module elongated-module--gold p-4'}>
      <p className="text-sm text-text-muted">{ethicsBodyText(mode)}</p>
      <button type="button" className="ds-btn ds-btn--accent mt-4 w-full" onClick={onAccept}>
        Jag förstår — fortsätt
      </button>
    </div>
  );
}
