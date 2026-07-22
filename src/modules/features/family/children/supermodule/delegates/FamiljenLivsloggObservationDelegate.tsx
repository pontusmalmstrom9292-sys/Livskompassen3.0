import { useState, useEffect } from 'react';
import { Button, TextArea } from '@/design-system';
import { Plus, Loader2, Check } from 'lucide-react';
import { LIVSLOGG_CATEGORIES, type LivsloggCategory } from '../../constants';
import { SaveAsEvidencePrompt } from '../../components/SaveAsEvidencePrompt';
import type { EpistemicKind } from '../../utils/childObservationEpistemics';
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';
import { analyzeJadePatterns, type JadeViolation } from '../../../safeHarbor/lib/jadeDetector';
import { AlertTriangle } from 'lucide-react';

const OBSERVATION_PLACEHOLDER: Record<EpistemicKind, string> = {
  citat: 'Ordagrant citat av barnet — t.ex. "Jag vill inte åka dit mer."',
  tolkning: 'Vad du såg eller hörde — beteende och tid, ingen diagnos på motpart.',
};

export function FamiljenLivsloggObservationDelegate({ shell, onSaved }: FamiljenDelegateBaseProps) {
  const childAlias = shell.activeChild;
  const userId = shell.user?.uid;
  const onSave = shell.handleSaveObservation;

  const [step, setStep] = useState<'form' | 'saved'>('form');
  const [observation, setObservation] = useState('');
  const [childrenImpact, setChildrenImpact] = useState('');
  const [category, setCategory] = useState<LivsloggCategory>('vardag');
  const [epistemicKind, setEpistemicKind] = useState<EpistemicKind>('tolkning');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedLogId, setSavedLogId] = useState<string | null>(null);
  
  const [jadeViolations, setJadeViolations] = useState<JadeViolation[]>([]);
  const [bypassJadeGuard, setBypassJadeGuard] = useState(false);

  useEffect(() => {
    return () => {
      setObservation('');
      setChildrenImpact('');
      setCategory('vardag');
      setStep('form');
      setSavedLogId(null);
      setError(null);
      setJadeViolations([]);
      setBypassJadeGuard(false);
    };
  }, [childAlias]);

  const resetForm = () => {
    setObservation('');
    setChildrenImpact('');
    setCategory('vardag');
    setStep('form');
    setSavedLogId(null);
    setError(null);
    setJadeViolations([]);
    setBypassJadeGuard(false);
  };

  const handleSave = async () => {
    if (!observation.trim()) return;
    if (!userId) {
      setError('Ej inloggad. Kan inte spara.');
      return;
    }
    
    // Asynkron opt-in JADE-guard (Task 3)
    if (!bypassJadeGuard) {
      const violations = analyzeJadePatterns(observation);
      if (violations.length > 0) {
        setJadeViolations(violations);
        return; // Stoppa här så användaren får varningen
      }
    }
    
    setLoading(true);
    setError(null);
    try {
      const id = await onSave({
        observation: observation.trim(),
        category: category,
        childrenImpact: childrenImpact.trim() || undefined,
        epistemicKind,
      });
      setSavedLogId(id);
      setStep('saved');
      onSaved?.(id);
    } catch (e: any) {
      if (e.message?.includes('Offline')) {
        setError('Du är offline. Denna observation kunde inte sparas just nu.');
      } else {
        setError('Kunde inte spara just nu. Försök igen.');
      }
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'saved' && savedLogId) {
    return (
      <div className="space-y-2 pt-2">
        <p className="flex items-center gap-2 text-sm text-success">
          <Check className="h-4 w-4" />
          Livslogg sparad.
        </p>
        
        <div className="bg-surface-3 p-4 rounded-xl border border-border/50 mt-4">
          <SaveAsEvidencePrompt
            userId={userId!}
            childAlias={childAlias}
            childrenLogId={savedLogId}
            observation={observation.trim()}
            category={category}
            childrenImpact={childrenImpact.trim() || undefined}
            onDone={resetForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      <p className="text-xs uppercase tracking-widest text-text-muted">
        Steg 1 — Observation ({childAlias})
      </p>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as LivsloggCategory)}
        aria-label={`Kategori för ${childAlias}s livslogg`}
        className="input-glass w-full rounded-xl px-3 py-2"
        disabled={loading}
      >
        {LIVSLOGG_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <div className="flex flex-wrap gap-2">
        {(['tolkning', 'citat'] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            aria-pressed={epistemicKind === kind}
            onClick={() => setEpistemicKind(kind)}
            className={
              epistemicKind === kind
                ? 'rounded-lg border border-accent/50 bg-surface-3 px-2.5 py-1 text-[10px] uppercase tracking-wider text-accent'
                : 'rounded-lg border border-border px-2.5 py-1 text-[10px] uppercase tracking-wider text-text-muted hover:border-accent/30'
            }
          >
            {kind === 'citat' ? 'Barnets ord (citat)' : 'Min observation (tolkning)'}
          </button>
        ))}
      </div>

      <p className="text-xs text-text-muted leading-relaxed">
        {epistemicKind === 'citat'
          ? 'Citat sparas med [citat]-prefix — vad barnet sa eller visade, ordagrant.'
          : 'Tolkning sparas med [tolkning]-prefix — din observation utan etikett på motpart.'}
      </p>

      <TextArea
        value={observation}
        onChange={(e) => {
          setObservation(e.target.value);
          setJadeViolations([]);
          setBypassJadeGuard(false);
        }}
        placeholder={OBSERVATION_PLACEHOLDER[epistemicKind]}
        rows={3}
        className="input-glass neu-inset w-full resize-none rounded-xl px-3 py-2"
        disabled={loading}
      />

      <TextArea
        value={childrenImpact}
        onChange={(e) => setChildrenImpact(e.target.value)}
        placeholder="Påverkan på barn (valfritt)..."
        rows={2}
        className="input-glass neu-inset w-full resize-none rounded-xl px-3 py-2"
        disabled={loading}
      />

      {jadeViolations.length > 0 ? (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-3 space-y-2 mt-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-danger">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Opt-in JADE-Guard (Kognitiv avlastning)</span>
          </div>
          <p className="text-xs text-text-muted">
            Din observation innehåller {jadeViolations.length} JADE-mönster (t.ex. försvar eller anklagelse). 
            WORM-livsloggen bör hållas strikt neutral för din egen sinnesro och bevisvärde.
          </p>
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setBypassJadeGuard(true);
                handleSave();
              }}
              disabled={loading}
              className="text-xs border-danger/20 text-danger"
            >
              Jag är säker, spara ändå
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setJadeViolations([])}
              className="text-xs"
            >
              Avbryt och redigera
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="accent"
          onClick={handleSave}
          disabled={loading || !observation.trim()}
          className="disabled:opacity-50 mt-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Spara livslogg
        </Button>
      )}
      
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
