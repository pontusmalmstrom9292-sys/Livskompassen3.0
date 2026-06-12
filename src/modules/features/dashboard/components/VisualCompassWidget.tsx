import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Shield, Flame, PenLine } from 'lucide-react';
import { clsx } from 'clsx';
import { BentoCard } from '@/modules/shared/ui/BentoCard';
import {
  getHomeCompassPhase,
  phaseGlowClasses,
  phaseLabel,
  phaseLead,
  phaseTitleClasses,
  phaseToCompassFlow,
} from '@/modules/core/home/homeCompassPhase';
import {
  COMPASS_FLOW_TIME_ICON,
  COMPASS_TIME_ICON_SRC,
} from '@/features/dailyLife/wellbeing/compasses/config/compassTimeIcons';
import { useCompassSummary } from '../hooks/useCompassSummary';
import { NAV_PATHS } from '@/modules/core/navigation/navTruth';

function StatPill({
  icon,
  label,
  value,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/20 bg-surface-2/50 px-4 py-3 backdrop-blur-sm">
      <span className="text-accent">{icon}</span>
      <span
        className={clsx(
          'text-lg font-semibold tabular-nums text-text',
          loading && 'animate-pulse text-text-muted',
        )}
      >
        {loading ? '—' : value}
      </span>
      <span className="text-[9px] uppercase tracking-[0.15em] text-text-dim">
        {label}
      </span>
    </div>
  );
}

/**
 * Visuell kompasssammanfattning — skrivskyddat kort för Dashboard.
 *
 * Visar dagsfas (morgon/dag/kväll) med tidsanpassad glöd,
 * AI-insikt (fas 1: lokal text) och aktivitetsstatistik
 * (journal, vault, streak) för de senaste 7 dagarna.
 */
export function VisualCompassWidget() {
  const navigate = useNavigate();
  const fallbackPhase = getHomeCompassPhase();
  const { journalCount, vaultCount, streak, latestInsight, recommendedPhase, dominantEmotion, loading } =
    useCompassSummary();
  
  // Dev Toggle State
  const [devPhaseOverride, setDevPhaseOverride] = useState<'morgon' | 'dag' | 'kvall' | null>(null);
  
  const phase = (import.meta.env.DEV && devPhaseOverride)
    ? devPhaseOverride
    : (recommendedPhase ?? fallbackPhase);
    
  const flow = phaseToCompassFlow(phase);
  const { iconId, shortLabel } = COMPASS_FLOW_TIME_ICON[flow];

  if (!loading && journalCount === 0 && vaultCount === 0 && streak === 0) {
    return (
      <BentoCard
        variant="hero"
        glow="gold"
        className={clsx('relative overflow-hidden text-center flex flex-col items-center justify-center py-10', phaseGlowClasses(phase))}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-1/50 pointer-events-none" />
        <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 relative z-10">
          <PenLine className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-xl font-display-serif mb-2 relative z-10 text-text">Din resa börjar här</h3>
        <p className="text-sm text-text-muted mb-8 max-w-xs mx-auto relative z-10 leading-relaxed">
          Skriv din första reflektion för att låsa upp kompassen och börja bygga din streak.
        </p>
        <button
          onClick={() => navigate(`${NAV_PATHS.HJARTAT}?tab=reflektion`)}
          className="relative z-10 flex items-center gap-2 px-6 py-3 bg-accent text-accent-contrast rounded-full text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/20"
        >
          <PenLine size={16} />
          Skriv din första reflektion
        </button>
      </BentoCard>
    );
  }

  return (
    <BentoCard
      variant="hero"
      glow="gold"
      className={clsx('relative overflow-hidden', phaseGlowClasses(phase))}
    >
      {/* Dev Toggle Button */}
      {import.meta.env.DEV && (
        <button
          onClick={() => {
            setDevPhaseOverride((prev) => {
              if (!prev) return 'morgon';
              if (prev === 'morgon') return 'dag';
              if (prev === 'dag') return 'kvall';
              return 'morgon';
            });
          }}
          className="absolute right-2 top-2 z-50 h-8 w-8 rounded opacity-0 hover:opacity-20 bg-text"
          title="Växla fas (Endast Dev)"
          aria-hidden="true"
        />
      )}

      {/* Ambient phase blob */}
      <div
        className={clsx(
          'pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-[0.07] blur-[80px]',
          phase === 'morgon' && 'bg-amber-400',
          phase === 'dag' && 'bg-[#d4af37]',
          phase === 'kvall' && 'bg-indigo-500',
        )}
      />

      {/* Header row: compass icon + text */}
      <div className="mb-5 flex items-center gap-5">
        <div
          className={clsx(
            'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border',
            phase === 'morgon' && 'border-amber-500/30 bg-amber-500/10',
            phase === 'dag' && 'border-accent/30 bg-accent/10',
            phase === 'kvall' && 'border-indigo-500/30 bg-indigo-500/10',
          )}
        >
          <img
            src={COMPASS_TIME_ICON_SRC[iconId]}
            alt={shortLabel}
            className="h-9 w-9"
            width={36}
            height={36}
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={clsx(
              'font-display-serif text-lg tracking-wide flex items-center gap-2',
              phaseTitleClasses(phase),
            )}
          >
            {phaseLabel(phase)}
            {dominantEmotion && (
              <span className="text-xs font-sans uppercase tracking-widest px-2 py-0.5 rounded border border-current opacity-70">
                {dominantEmotion}
              </span>
            )}
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-text-muted">
            {phaseLead(phase)}
          </p>
        </div>

        {/* Phase badge */}
        <span
          className={clsx(
            'shrink-0 rounded-full border px-3 py-1 text-[9px] uppercase tracking-[0.18em]',
            phase === 'morgon' &&
              'border-amber-500/30 bg-amber-500/8 text-amber-400',
            phase === 'dag' && 'border-accent/30 bg-accent/8 text-accent',
            phase === 'kvall' &&
              'border-indigo-500/30 bg-indigo-500/8 text-indigo-400',
          )}
        >
          {shortLabel}
        </span>
      </div>

      {/* Insight text */}
      <div
        className={clsx(
          'mb-5 rounded-xl border px-4 py-3',
          phase === 'morgon' && 'border-amber-500/15 bg-amber-500/5',
          phase === 'dag' && 'border-accent/15 bg-accent/5',
          phase === 'kvall' && 'border-indigo-500/15 bg-indigo-500/5',
        )}
      >
        <p
          className={clsx(
            'text-sm leading-relaxed',
            loading ? 'animate-pulse text-text-dim' : 'text-text-muted',
          )}
        >
          {loading ? 'Hämtar insikter…' : latestInsight}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <StatPill
          icon={<BookOpen size={16} />}
          label="Dagbok"
          value={journalCount}
          loading={loading}
        />
        <StatPill
          icon={<Shield size={16} />}
          label="Valvet"
          value={vaultCount}
          loading={loading}
        />
        <StatPill
          icon={<Flame size={16} />}
          label="Streak"
          value={`${streak}d`}
          loading={loading}
        />
      </div>
    </BentoCard>
  );
}
