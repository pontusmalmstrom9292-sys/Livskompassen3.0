import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Sparkles, Loader2, Target, AlertTriangle, Lightbulb } from 'lucide-react';
import { withVaultSessionPayload } from '@/core/auth/vaultServerSession';
import { VaultLockedGate } from '@/core/components/VaultLockedGate';
import { useStore } from '@/core/store';
import { hasVaultGate } from '@/core/auth/sessionService';

interface InsightPattern {
  pattern: string;
  confidence: number;
}

interface WeeklyInsightsResult {
  weeklySummary?: string;
  detectedPatterns?: InsightPattern[];
  focusVsSentiment?: string;
  actionableAdvice?: string;
}

export const WeeklySummary: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<WeeklyInsightsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const functions = getFunctions();
      const callable = httpsCallable<Record<string, unknown>, WeeklyInsightsResult>(
        functions,
        'generateWeeklyInsights',
      );
      const res = await callable(withVaultSessionPayload({}));
      setInsights(res.data);
    } catch (err: unknown) {
      console.error('Error generating insights:', err);
      const message = err instanceof Error ? err.message : 'Kunde inte generera veckoinsikter just nu.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked) || hasVaultGate();

  if (!isVaultUnlocked) {
    return (
      <div className="mb-8 rounded-2xl border border-border/40 bg-surface/40 p-6 shadow-xl backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center text-2xl font-bold text-text">
            <Sparkles className="mr-3 h-6 w-6 text-success" aria-hidden />
            Veckoinsikter
          </h2>
        </div>
        <VaultLockedGate variant="card" />
      </div>
    );
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4 }}
      className="mb-8 rounded-2xl border border-border/40 bg-surface/40 p-6 shadow-xl backdrop-blur-md"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="flex items-center text-2xl font-bold text-text">
          <Sparkles className="mr-3 h-6 w-6 text-success" aria-hidden />
          Veckoinsikter
        </h2>
        <button
          type="button"
          onClick={() => void generateInsights()}
          disabled={loading}
          className="inline-flex min-h-11 items-center rounded-xl border border-border/40 bg-surface-3/50 px-4 py-2 text-text transition-colors hover:bg-surface-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              Analyserar…
            </>
          ) : (
            'Generera Insikter'
          )}
        </button>
      </div>

      {error && (
        <div
          className="mb-6 rounded-xl border border-danger/25 bg-danger/10 p-4 text-sm text-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      {insights && !loading && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {insights.weeklySummary && (
            <div className="rounded-xl border border-border/30 bg-surface-3/30 p-4">
              <p className="text-sm leading-relaxed text-text-muted">{insights.weeklySummary}</p>
            </div>
          )}

          {insights.detectedPatterns && insights.detectedPatterns.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center text-sm font-semibold uppercase tracking-wider text-text-dim">
                <Target className="mr-2 h-4 w-4" aria-hidden /> Observerade Mönster
              </h3>
              <div className="space-y-2">
                {insights.detectedPatterns.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-border/30 bg-surface-3/30 p-3"
                  >
                    <span className="text-sm text-text-muted">{p.pattern}</span>
                    <span className="ml-4 whitespace-nowrap text-xs text-text-dim">
                      {(p.confidence * 100).toFixed(0)}% säkerhet
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {insights.focusVsSentiment && (
            <div>
              <h3 className="mb-3 flex items-center text-sm font-semibold uppercase tracking-wider text-text-dim">
                <AlertTriangle className="mr-2 h-4 w-4 text-warning" aria-hidden /> Fokus vs Mående
              </h3>
              <p className="rounded-xl border border-warning/20 bg-warning/5 p-4 text-sm text-text-muted">
                {insights.focusVsSentiment}
              </p>
            </div>
          )}

          {insights.actionableAdvice && (
            <div>
              <h3 className="mb-3 flex items-center text-sm font-semibold uppercase tracking-wider text-text-dim">
                <Lightbulb className="mr-2 h-4 w-4 text-accent-secondary" aria-hidden /> Råd Framåt
              </h3>
              <p className="rounded-xl border border-accent-secondary/20 bg-accent-secondary/5 p-4 text-sm text-text-muted">
                {insights.actionableAdvice}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {!insights && !loading && !error && (
        <div className="p-8 text-center text-sm italic text-text-dim">
          Tryck på knappen för att låta Mönster-Arkivarien analysera din senaste vecka.
        </div>
      )}
    </motion.div>
  );
};
