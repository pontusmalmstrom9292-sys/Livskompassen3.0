/** @locked MOD-FAM-INCIDENT — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-INCIDENT.md */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, TextArea } from '@/design-system';
import { Loader2, Check, AlertTriangle, Anchor, Heart } from 'lucide-react';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import type { EpistemicKind } from '../../utils/childObservationEpistemics';
import { analyzeChildIncidentLocal } from '../../lib/analyzeChildIncidentLocal';
import { markCardOpened, markCardSkipped } from '../../lib/incidentCardRotation';
import { recentIncidentThemeTagIds } from '../../lib/incidentThemeFromLogs';
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';

/**
 * Fas A/B — «Vad hände»: fri text → heuristik + rotation → tre svar + WORM.
 */
export function FamiljenIncidentDelegate({ shell, onSaved }: FamiljenDelegateBaseProps) {
  const childAlias = shell.activeChild;
  const userId = shell.user?.uid;
  const logs = shell.logs;
  const onSave = shell.handleSaveIncident;

  const [rawText, setRawText] = useState('');
  const [epistemicKind, setEpistemicKind] = useState<EpistemicKind>('tolkning');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [savedLogId, setSavedLogId] = useState<string | null>(null);

  const themePatternIds = useMemo(
    () => recentIncidentThemeTagIds(logs ?? [], childAlias, 7),
    [logs, childAlias],
  );

  const analysis = useMemo(() => {
    if (!rawText.trim()) return null;
    return analyzeChildIncidentLocal({ rawText, epistemicKind, themePatternIds });
  }, [rawText, epistemicKind, themePatternIds]);

  useEffect(() => {
    return () => {
      setRawText('');
      setStep('form');
      setSavedLogId(null);
      setError(null);
    };
  }, [childAlias]);

  const handleAnalyzeAndSave = async () => {
    if (!rawText.trim() || !analysis) return;
    if (!userId) {
      setError('Ej inloggad. Kan inte spara.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const id = await onSave({
        observation: analysis.observationForWorm,
        truth: analysis.truthForWorm,
        bankId: analysis.bankId,
        epistemicKind,
      });
      markCardOpened(analysis.questionCard.id);
      setSavedLogId(id);
      setStep('result');
      onSaved?.(id);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      setError(
        msg.includes('Offline')
          ? 'Du är offline. Incidenten kunde inte sparas just nu.'
          : 'Kunde inte spara just nu. Försök igen.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === 'result' && analysis) {
    return (
      <div className="space-y-4 pt-2" role="status" aria-live="polite">
        <p className="flex items-center gap-2 text-sm text-success">
          <Check className="h-4 w-4 shrink-0" aria-hidden />
          Sparat i {childAlias}s logg (WORM).
        </p>

        <section className="space-y-1 rounded-lg border border-border/40 bg-surface/40 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Förklaring</p>
          <p className="text-sm text-text">{analysis.deepening}</p>
        </section>

        <section className="space-y-1 rounded-lg border border-border/40 bg-surface/40 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Vad du kan säga till {childAlias}
          </p>
          <p className="text-sm text-text">{analysis.childResponseScript}</p>
        </section>

        <section className="space-y-2 rounded-lg border border-border/40 bg-surface/40 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Frågekort</p>
          <p className="text-sm font-medium text-text">{analysis.questionCard.question}</p>
          <p className="text-xs text-text-muted">{analysis.questionCard.nextStep}</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            onClick={() => {
              markCardSkipped(analysis.questionCard.id);
              setRawText('');
              setStep('form');
              setSavedLogId(null);
            }}
          >
            Hoppa över kortet
          </Button>
        </section>

        {analysis.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Mönstertaggar">
            {analysis.tags.map((t) => (
              <li
                key={t.patternId}
                className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] text-text-muted"
              >
                {t.label}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            to={`${NAV_PATHS.FAMILJEN}?tab=hamn`}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-border/50 px-3 text-xs font-medium text-text hover:bg-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <Anchor className="h-4 w-4" aria-hidden />
            Svara ex (Hamn)
          </Link>
          <Link
            to={`${NAV_PATHS.HJARTAT}?tab=speglar`}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-border/50 px-3 text-xs font-medium text-text hover:bg-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <Heart className="h-4 w-4" aria-hidden />
            Speglar
          </Link>
        </div>

        {savedLogId && (
          <p className="text-[10px] text-text-muted">Logg-id: {savedLogId.slice(0, 12)}…</p>
        )}

        <Button
          type="button"
          variant="ghost"
          className="min-h-11 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          onClick={() => {
            setRawText('');
            setStep('form');
            setSavedLogId(null);
          }}
        >
          Ny incident
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      <p className="text-xs text-text-muted">
        Skriv fritt vad som hände. Du får stöd inom sekunder — sparas i barnens logg.
      </p>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Citat eller tolkning">
        {(['citat', 'tolkning'] as const).map((kind) => (
          <Button
            key={kind}
            type="button"
            size="sm"
            variant={epistemicKind === kind ? 'accent' : 'ghost'}
            className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            onClick={() => setEpistemicKind(kind)}
          >
            {kind === 'citat' ? 'Citat' : 'Tolkning'}
          </Button>
        ))}
      </div>

      <TextArea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        rows={4}
        placeholder={`T.ex. ${childAlias} sa att mamma sagt att pappa inte vill träffa honom.`}
        className="min-h-[7rem] w-full"
        aria-label="Vad som hände"
      />

      {analysis && analysis.tags.length > 0 && (
        <p className="flex items-start gap-2 text-xs text-text-muted">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          Förhands­taggar (beteende): {analysis.tags.map((t) => t.label).join(' · ')}
        </p>
      )}

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <Button
        type="button"
        className="min-h-11 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        disabled={!rawText.trim() || loading}
        onClick={() => void handleAnalyzeAndSave()}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Sparar…
          </>
        ) : (
          'Analysera och spara'
        )}
      </Button>
    </div>
  );
}
