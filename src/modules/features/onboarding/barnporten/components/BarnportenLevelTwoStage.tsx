import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Heart, Layers, CheckCircle } from 'lucide-react';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';

export function BarnportenLevelTwoStage() {
  const { barnportenLevel, hasSeenLevel2Animation, setHasSeenLevel2Animation } = useEvolutionStore();

  if (barnportenLevel !== 2 || hasSeenLevel2Animation) {
    return null;
  }

  const handleDismiss = () => {
    setHasSeenLevel2Animation(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="my-6 p-6 rounded-2xl bg-obsidian-bg border border-accent/30 shadow-accent-glow text-text"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] tracking-widest uppercase text-accent font-display font-semibold">
              Milstolpe Nådd · Silo 3
            </span>
            <h2 className="text-lg font-semibold text-accent-light font-display">
              Nivå 2: Trygg Expansion
            </h2>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-success/15 border border-success/30 text-success font-semibold">
          Aktiv
        </span>
      </div>

      <p className="text-sm text-text-muted mb-6 leading-relaxed">
        Grattis! Din reaktiva motor har låst upp <strong className="text-accent-light font-medium">Föräldrapaketet: Trygghet</strong>. 
        Nya funktioner har integrerats i din orkester utan att sidan behöver laddas om.
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-2 border border-border/40">
          <ShieldCheck className="h-5 w-5 text-accent-ai mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-accent-ai">BIFF / Grey Rock Skydd</h4>
            <p className="text-[11px] text-text-muted mt-0.5">
              Avancerad kommunikationssköld aktiverad för att reducera affektiva konflikter.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-2 border border-border/40">
          <Heart className="h-5 w-5 text-accent-ai mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-accent-ai">Barnfokus & Speglar</h4>
            <p className="text-[11px] text-text-muted mt-0.5">
              Realtidsvalidering av känslomässigt laddad input i det skyddade utkastlagret.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-2 border border-border/40">
          <Layers className="h-5 w-5 text-accent-ai mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-accent-ai">Orkester Presets</h4>
            <p className="text-[11px] text-text-muted mt-0.5">
              Automatisk synkning av `foralder_trygg` mönster över familjens hubbar.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-obsidian-bg shadow-md transition-all hover:bg-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 active:scale-95"
      >
        <CheckCircle className="h-4 w-4" />
        Bekräfta & Fortsätt
      </button>
    </motion.div>
  );
}
