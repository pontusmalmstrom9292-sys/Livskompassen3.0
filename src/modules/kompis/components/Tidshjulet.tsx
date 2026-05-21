import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import type { KampsparEntryRow } from '../../core/types/firestore';
import { EmptyState } from '../../core/ui/EmptyState';

type Props = {
  entries: KampsparEntryRow[];
};

export function Tidshjulet({ entries }: Props) {
  const nodes = entries.slice(0, 8);

  return (
    <div className="relative mx-auto my-8 flex aspect-square w-full max-w-md items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border border-dashed border-surface-3"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-4 rounded-full border border-accent/20"
      />

      <motion.div className="absolute inset-12 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-sm" />

      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-surface-3 bg-bg shadow-xl shadow-black/50">
        <Compass className="h-8 w-8 text-accent" />
      </div>

      {nodes.map((entry, index) => {
        const angle = (index / Math.max(nodes.length, 1)) * Math.PI * 2 - Math.PI / 2;
        const radius = 42;
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;
        const label = entry.eventDate?.slice(0, 10) || entry.createdAt?.slice(0, 10) || '—';

        return (
          <div
            key={entry.id}
            className="absolute z-20 max-w-[88px]"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            title={entry.title}
          >
            <div className="mx-auto h-3 w-3 rounded-full bg-accent-light shadow-accent-glow" />
            <p className="mt-1 truncate text-center text-[9px] uppercase tracking-wider text-text-dim">
              {label}
            </p>
            <p className="truncate text-center text-[10px] text-text-muted">{entry.title}</p>
          </div>
        );
      })}

      {entries.length === 0 && (
        <div className="absolute inset-x-6 bottom-4 z-30">
          <EmptyState message="Lägg till din första post nedan — noder visas här." />
        </div>
      )}
    </div>
  );
}
