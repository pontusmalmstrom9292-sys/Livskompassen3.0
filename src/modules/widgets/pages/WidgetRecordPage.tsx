import { Link } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AuthGate } from '../../core/auth/AuthGate';
import { useStore } from '../../core/store';
import { WidgetShell } from '../layout/WidgetShell';
import { useWidgetVaultRecording } from '../hooks/useWidgetVaultRecording';

const ETHICS_KEY = 'livskompassen_widget_recording_ethics_v1';

function WidgetRecordInner() {
  const user = useStore((s) => s.user);
  const [ethicsOk, setEthicsOk] = useState(() => localStorage.getItem(ETHICS_KEY) === '1');
  const rec = useWidgetVaultRecording(user?.uid);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' && ethicsOk && rec.phase === 'idle' && user) {
      void rec.start();
    }
  }, [ethicsOk, rec, user]);

  if (!ethicsOk) {
    return (
      <WidgetShell
        title="Tyst inspelning"
        lead="Låses i Valvet med datum, titel efter analys och textsammanfattning."
      >
        <div className="elongated-module elongated-module--gold p-4">
          <p className="text-sm text-text-muted">
            Inspelning lagras som WORM-bevis hos dig. Kontrollera lag om du spelar in andra —
            använd på eget ansvar. Ingen synlig REC visas utåt (diskret läge).
          </p>
          <button
            type="button"
            className="btn-pill--accent mt-4 w-full"
            onClick={() => {
              localStorage.setItem(ETHICS_KEY, '1');
              setEthicsOk(true);
            }}
          >
            Jag förstår — fortsätt
          </button>
        </div>
      </WidgetShell>
    );
  }

  return (
    <>
      {rec.phase === 'recording' && (
        <div className="widget-record-discreet-overlay" aria-hidden />
      )}
      <WidgetShell
      title="Inspelning → Valv"
      lead={
        rec.phase === 'recording'
          ? 'Prata fritt. Stoppa när du är klar.'
          : 'Datumstämpel · AI-titel · låst post med sammanfattning.'
      }
    >
      <div className="space-y-4">
        {rec.phase === 'idle' && (
          <button
            type="button"
            className="widget-record__pulse btn-pill--primary w-full py-4"
            onClick={() => void rec.start()}
            disabled={!rec.recordSupported}
          >
            Starta inspelning
          </button>
        )}

        {rec.phase === 'recording' && (
          <div className="elongated-module elongated-module--gold p-4 text-center">
            <span className="widget-record__dot" aria-hidden />
            <p className="mt-3 text-sm text-accent">Inspelar diskret…</p>
            {rec.interim && (
              <p className="mt-2 text-xs text-text-muted line-clamp-3">{rec.interim}</p>
            )}
            <button type="button" className="btn-pill--accent mt-4 w-full" onClick={rec.stop}>
              Stoppa och lås i Valvet
            </button>
          </div>
        )}

        {rec.phase === 'processing' && (
          <p className="flex items-center justify-center gap-2 text-sm text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyserar, namnger och låser…
          </p>
        )}

        {rec.phase === 'done' && rec.result && (
          <div className="elongated-module elongated-module--gold p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-success">
              <Lock className="h-4 w-4" />
              Låst i Valvet
            </p>
            <p className="mt-2 font-display text-base text-accent">{rec.result.title}</p>
            <p className="mt-2 text-sm text-text-muted">{rec.result.summary}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/dagbok?tab=bevis" className="btn-pill--accent text-center text-xs">
                Öppna Valv
              </Link>
              <button type="button" className="btn-pill--ghost text-xs" onClick={rec.reset}>
                Ny inspelning
              </button>
            </div>
          </div>
        )}

        {(rec.error || rec.audioError) && (
          <p className="text-sm text-danger">{rec.error ?? rec.audioError}</p>
        )}

        {!rec.speechSupported && rec.phase === 'idle' && (
          <p className="text-xs text-text-dim">
            Transkription saknas i denna webbläsare — titel blir datumstämpel; ljudfil sparas ändå.
          </p>
        )}
      </div>
    </WidgetShell>
    </>
  );
}

export function WidgetRecordPage() {
  return (
    <AuthGate>
      <WidgetRecordInner />
    </AuthGate>
  );
}
