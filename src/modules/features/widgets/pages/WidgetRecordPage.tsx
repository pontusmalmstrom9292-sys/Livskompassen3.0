/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md */
import { useSearchParams } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { AuthGate } from '@/core/auth/AuthGate';
import { useStore } from '@/core/store';
import { WidgetShell } from '../layout/WidgetShell';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetSuccessCard } from '../components/WidgetSuccessCard';
import { useWidgetShellClear } from '../context/widgetShellContext';
import { useWidgetVaultRecording } from '../hooks/useWidgetVaultRecording';
import { WidgetRecordMetadataForm } from '../components/WidgetRecordMetadataForm';
import {
  useWidgetRecordingEthicsAccepted,
  WidgetRecordingEthicsGate,
} from '../components/WidgetRecordingEthicsGate';
import { parseWidgetDeepLinkPath } from '../WidgetDeepLinkBridge';
import { useWidgetReactivate } from '../hooks/useWidgetReactivate';

function WidgetRecordInner() {
  const user = useStore((s) => s.user);
  const [searchParams] = useSearchParams();
  const discreet = searchParams.get('discreet') === '1';
  const { accepted: ethicsOk, accept: acceptEthics } = useWidgetRecordingEthicsAccepted();
  const rec = useWidgetVaultRecording(user?.uid);
  const autostarted = useRef(false);

  useWidgetShellClear(rec.reset);

  const tryAutostart = useCallback(() => {
    if (
      searchParams.get('autostart') !== '1' ||
      !ethicsOk ||
      !user ||
      rec.phase !== 'idle' ||
      autostarted.current
    ) {
      return;
    }
    autostarted.current = true;
    void rec.start();
  }, [ethicsOk, rec, searchParams, user]);

  useEffect(() => {
    tryAutostart();
  }, [tryAutostart]);

  useWidgetReactivate(
    useCallback(
      (path) => {
        const parsed = parseWidgetDeepLinkPath(path);
        if (parsed?.pathname !== '/widget/inspelning') return;
        const params = new URLSearchParams(parsed.search.replace(/^\?/, ''));
        if (params.get('autostart') !== '1') return;
        if (!ethicsOk || !user || rec.phase !== 'idle') return;
        autostarted.current = false;
        tryAutostart();
      },
      [ethicsOk, rec.phase, tryAutostart, user],
    ),
  );

  const shellTitle = discreet ? 'Anteckningar' : 'Tyst inspelning';
  const shellLead =
    rec.phase === 'recording'
      ? 'Prata fritt. Ingen röd REC på hemskärmswidgeten.'
      : 'Efter stopp: vem / vad / varför — sedan lås med datum i Valvet.';

  if (!ethicsOk) {
    return (
      <WidgetShell
        title={shellTitle}
        lead="Låses i Valvet med datum, titel och valfri kontext (vem, vad, varför)."
      >
        <WidgetRecordingEthicsGate
          mode={discreet ? 'discreet' : 'standard'}
          onAccept={acceptEthics}
        />
      </WidgetShell>
    );
  }

  return (
    <>
      {rec.phase === 'recording' && (
        <div className="widget-record-discreet-overlay" aria-hidden />
      )}
      <WidgetShell title={shellTitle} lead={shellLead}>
        <div className="space-y-4">
          {rec.phase === 'idle' && (
            <WidgetButton
              type="button"
              variant="accent"
              fullWidth
              className="widget-record__pulse py-4"
              onClick={() => void rec.start()}
              disabled={!rec.recordSupported}
            >
              {discreet ? 'Ny anteckning (ljud)' : 'Starta inspelning'}
            </WidgetButton>
          )}

          {rec.phase === 'recording' && (
            <div className="elongated-module elongated-module--gold p-4 text-center">
              <span className="widget-record__dot" aria-hidden />
              <p className="mt-3 text-sm text-accent">
                {discreet ? 'Antecknar ljud…' : 'Inspelar diskret…'}
              </p>
              {rec.interim && (
                <p className="mt-2 text-xs text-text-muted line-clamp-3">{rec.interim}</p>
              )}
              <WidgetButton type="button" variant="accent" fullWidth className="mt-4" onClick={rec.stop}>
                Stoppa
              </WidgetButton>
            </div>
          )}

          {rec.phase === 'processing' && (
            <p className="flex items-center justify-center gap-2 text-sm text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              {rec.prepared ? 'Låser i Valvet…' : 'Förbereder…'}
            </p>
          )}

          {rec.phase === 'metadata' && rec.prepared && (
            <WidgetRecordMetadataForm
              suggestedTitle={rec.prepared.analysis.title}
              onLock={(meta) => rec.lockWithMetadata(meta)}
              onSkip={() => rec.lockWithMetadata({ vem: '', vad: '', varfor: '' })}
            />
          )}

          {rec.phase === 'done' && rec.result && (
            <WidgetSuccessCard
              message={rec.result.queued ? 'I granskningskö' : 'Låst i Valvet'}
              icon={Lock}
              detail={
                <>
                  <p>{rec.result.title}</p>
                  <p className="mt-2 text-sm font-normal text-text-muted">{rec.result.summary}</p>
                </>
              }
              actionLabel="Ny anteckning"
              onAction={rec.reset}
            />
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
    <AuthGate variant="widget" widgetTitle="Anteckningar">
      <WidgetRecordInner />
    </AuthGate>
  );
}
