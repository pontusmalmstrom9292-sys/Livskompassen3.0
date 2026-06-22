import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    } catch (err: any) {
      console.error('Error generating insights:', err);
      setError(err.message || 'Kunde inte generera veckoinsikter just nu.');
    } finally {
      setLoading(false);
    }
  };

  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked) || hasVaultGate();

  if (!isVaultUnlocked) {
    return (
      <div className="bg-[var(--color-obsidian-calm)]/40 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Sparkles className="w-6 h-6 mr-3 text-emerald-400" />
            Veckoinsikter
          </h2>
        </div>
        <VaultLockedGate variant="card" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--color-obsidian-calm)]/40 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md mb-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Sparkles className="w-6 h-6 mr-3 text-emerald-400" />
          Veckoinsikter
        </h2>
        <button
          onClick={generateInsights}
          disabled={loading}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyserar...
            </>
          ) : (
            'Generera Insikter'
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm mb-6">
          {error}
        </div>
      )}

      {insights && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Summary */}
          {insights.weeklySummary && (
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-white/90 leading-relaxed text-sm">
                {insights.weeklySummary}
              </p>
            </div>
          )}

          {/* Patterns */}
          {insights.detectedPatterns && insights.detectedPatterns.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" /> Observerade Mönster
              </h3>
              <div className="space-y-2">
                {insights.detectedPatterns.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <span className="text-white/80 text-sm">{p.pattern}</span>
                    <span className="text-xs text-white/40 ml-4 whitespace-nowrap">
                      {(p.confidence * 100).toFixed(0)}% säkerhet
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Focus vs Sentiment */}
          {insights.focusVsSentiment && (
            <div>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" /> Fokus vs Mående
              </h3>
              <p className="text-white/80 text-sm p-4 bg-yellow-400/5 rounded-xl border border-yellow-400/10">
                {insights.focusVsSentiment}
              </p>
            </div>
          )}

          {/* Actionable Advice */}
          {insights.actionableAdvice && (
            <div>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-blue-400" /> Råd Framåt
              </h3>
              <p className="text-white/80 text-sm p-4 bg-blue-400/5 rounded-xl border border-blue-400/10">
                {insights.actionableAdvice}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {!insights && !loading && !error && (
        <div className="text-center p-8 text-white/40 text-sm italic">
          Tryck på knappen för att låta Mönster-Arkivarien analysera din senaste vecka.
        </div>
      )}
    </motion.div>
  );
};
