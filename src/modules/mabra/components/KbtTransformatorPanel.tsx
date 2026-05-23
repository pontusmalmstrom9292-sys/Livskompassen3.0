import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BentoCard } from '../../core/ui/BentoCard';
import { fetchKbtTransformator, type KbtTransformResponse } from '../api/kbtTransformatorService';
import { shouldRedirectMabraCoachToSpeglar } from '../lib/mabraCoachGuard';

/** D29 — KBT-Transformatorn: tanke → 3 kort (förvrängning / fakta / omskrivning). */
export function KbtTransformatorPanel() {
  const [thought, setThought] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectSpeglar, setRedirectSpeglar] = useState(false);
  const [result, setResult] = useState<KbtTransformResponse | null>(null);

  const handleTransform = async () => {
    const trimmed = thought.trim();
    if (!trimmed) return;
    if (shouldRedirectMabraCoachToSpeglar(trimmed)) {
      setRedirectSpeglar(true);
      setResult(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    setRedirectSpeglar(false);
    setResult(null);
    try {
      const data = await fetchKbtTransformator(trimmed);
      setResult(data);
    } catch (err) {
      if (err instanceof Error && err.message === 'redirect_speglar') {
        setRedirectSpeglar(true);
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
        onChange={(e) => setThought(e.target.value)}
        placeholder="T.ex. Jag är en dålig pappa…"
        rows={3}
        className="input-glass w-full text-sm"
        disabled={loading}
      />
      <button
        type="button"
        onClick={() => void handleTransform()}
        disabled={loading || !thought.trim()}
        className="btn-pill--accent mt-3 w-full disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Transformera tanke
      </button>

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      {redirectSpeglar && (
        <div className="mt-4 rounded-xl border border-accent/25 bg-accent/5 p-3 text-sm text-text-muted">
          <p>Det här passar bättre i Speglar — konflikt och gaslighting.</p>
          <Link to="/speglar" className="btn-pill--ghost mt-2 inline-flex text-xs">
            Öppna Speglar
          </Link>
        </div>
      )}

      {result && (
        <div className="mt-4 grid gap-3">
          {result.usedLocalFallback toFallback
          {result.usedLocalFallback && (
            <p className="text-xs text-text-dim">
              Lokal vägledning — uppdatera mabraCoach i molnet för AI.
            </p>
          )}
          {(
            [
              { key: 'distortion', title: 'Kognitiv förvrängning', body: result.distortion },
              { key: 'clinicalFact', title: 'Klinisk fakta', body: result.clinicalFact },
              {
                key: 'compassionateRewrite',
                title: 'Självmedkännande omskrivning',
                body: result.compassionateRewrite,
              },
            ] as const
          ).map((card) => (
            <motion.div key={card.key} className="glass-card p-3 text-sm">
              <p className="text-[10px] uppercase tracking-widest text-accent/80">{card.title}</p>
              <p className="mt-1 text-text-muted whitespace-pre-wrap">{card.body}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </BentoCard>
  );
}
