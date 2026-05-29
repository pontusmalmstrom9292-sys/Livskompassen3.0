import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { fetchKbtTransformator, type KbtTransformResponse } from '../api/kbtTransformatorService';
import { shouldRedirectMabraCoachToSpeglar } from '../lib/mabraCoachGuard';
import { MabraSpeglarGuardHint } from './MabraSpeglarGuardHint';

/** D29 — KBT-Transformatorn: tanke → 3 kort (förvrängning / fakta / omskrivning). */
export function KbtTransformatorPanel() {
  const [thought, setThought] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guardDismissed, setGuardDismissed] = useState(false);
  const [showGuardPrompt, setShowGuardPrompt] = useState(false);
  const [result, setResult] = useState<KbtTransformResponse | null>(null);

  const trimmed = thought.trim();
  const guardActive = shouldRedirectMabraCoachToSpeglar(trimmed) && !guardDismissed;

  const handleTransform = async () => {
    if (!trimmed) return;
    if (shouldRedirectMabraCoachToSpeglar(trimmed) && !guardDismissed) {
      setShowGuardPrompt(true);
      setResult(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setShowGuardPrompt(false);
    setResult(null);
    try {
      const data = await fetchKbtTransformator(trimmed);
      setResult(data);
    } catch (err) {
      if (err instanceof Error && err.message === 'redirect_speglar') {
        setShowGuardPrompt(true);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : 'Transformering misslyckades.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BentoCard
      title="KBT-Transformatorn"
      description="Mata in en automatisk tanke — få tre kort"
      icon={<Sparkles className="h-4 w-4" />}
    >
      <textarea
        value={thought}
        onChange={(e) => {
          setThought(e.target.value);
          setGuardDismissed(false);
          setShowGuardPrompt(false);
        }}
        placeholder="T.ex. Jag är en dålig pappa…"
        rows={3}
        className="input-glass w-full text-sm"
        disabled={loading}
      />

      {(showGuardPrompt || guardActive) && (
        <MabraSpeglarGuardHint
          className="mt-3"
          onStay={() => {
            setGuardDismissed(true);
            setShowGuardPrompt(false);
          }}
        />
      )}

      <button
        type="button"
        onClick={() => void handleTransform()}
        disabled={loading || !trimmed}
        className="btn-pill--accent mt-3 w-full disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Transformera tanke
      </button>

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      {result && (
        <div className="mt-4 grid gap-3">
          <div className="rounded-xl border border-border-strong bg-surface/40 p-3">
            <p className="text-[10px] uppercase tracking-widest text-text-dim">Förvrängning</p>
            <p className="mt-1 text-sm text-text-muted">{result.distortion}</p>
          </div>
          <div className="rounded-xl border border-border-strong bg-surface/40 p-3">
            <p className="text-[10px] uppercase tracking-widest text-text-dim">Fakta</p>
            <p className="mt-1 text-sm text-text-muted">{result.clinicalFact}</p>
          </div>
          <div className="rounded-xl border border-accent/25 bg-accent/5 p-3">
            <p className="text-[10px] uppercase tracking-widest text-accent">Omskrivning</p>
            <p className="mt-1 text-sm text-text">{result.compassionateRewrite}</p>
          </div>
        </div>
      )}
    </BentoCard>
  );
}
