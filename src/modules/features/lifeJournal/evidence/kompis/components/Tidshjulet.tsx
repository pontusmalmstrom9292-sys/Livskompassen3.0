import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import type { KampsparEntryRow } from '@/core/types/firestore';
import { EmptyState } from '@/core/ui/EmptyState';
import {
  formatTidshjulLabel,
  partitionKampsparForTidshjulet,
  type TidshjulRing,
} from '../utils/tidshjulTimeline';

type Props = {
  entries: KampsparEntryRow[];
  highlightEntryId?: string | null;
  selectedEntryId?: string | null;
  onSelectEntry?: (entry: KampsparEntryRow) => void;
  /** Kort puls när citation fokuserar noden. */
  highlightPulse?: boolean;
};

type RingConfig = {
  ring: TidshjulRing;
  label: string;
  radiusPct: number;
  nodes: KampsparEntryRow[];
};

function RingNodes({
  config,
  highlightEntryId,
  selectedEntryId,
  onSelectEntry,
  highlightPulse,
}: {
  config: RingConfig;
  highlightEntryId?: string | null;
  selectedEntryId?: string | null;
  onSelectEntry?: (entry: KampsparEntryRow) => void;
  highlightPulse?: boolean;
}) {
  const { nodes, radiusPct, label } = config;
  if (nodes.length === 0) return null;

  return (
    <>
      <span
        className="pointer-events-none absolute left-1/2 top-1 text-[8px] uppercase tracking-widest text-text-dim"
        style={{
          transform: `translate(-50%, 0) translateY(${(50 - radiusPct) * 0.9}%)`,
        }}
      >
        {label}
      </span>
      {nodes.map((entry, index) => {
        const angle = (index / Math.max(nodes.length, 1)) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + Math.cos(angle) * radiusPct;
        const y = 50 + Math.sin(angle) * radiusPct;
        const isHighlight = entry.id === highlightEntryId;
        const isSelected = entry.id === selectedEntryId;

        const nodeLabel = `${formatTidshjulLabel(entry)} — ${entry.title}`;

        return (
          <button
            key={entry.id}
            type="button"
            onClick={() => onSelectEntry?.(entry)}
            aria-label={nodeLabel}
            aria-pressed={isSelected}
            className="absolute z-20 flex min-h-11 min-w-11 max-w-[96px] cursor-pointer flex-col items-center justify-center rounded-lg p-1 text-left transition hover:bg-surface/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            title={nodeLabel}
          >
            <div
              className={`mx-auto h-3 w-3 rounded-full shadow-accent-glow ${
                isSelected
                  ? 'bg-accent ring-2 ring-accent'
                  : isHighlight
                    ? `bg-accent ring-2 ring-accent/60 ${highlightPulse ? 'animate-pulse scale-125' : ''}`
                    : 'bg-accent-light'
              }`}
            />
            <p className="mt-1 truncate text-center text-[9px] uppercase tracking-wider text-text-dim">
              {formatTidshjulLabel(entry)}
            </p>
            <p className="truncate text-center text-[10px] text-text-muted">{entry.title}</p>
          </button>
        );
      })}
    </>
  );
}

export function Tidshjulet({
  entries,
  highlightEntryId,
  selectedEntryId,
  onSelectEntry,
  highlightPulse = false,
}: Props) {
  const { dåtid, nutid, framtid } = partitionKampsparForTidshjulet(entries);

  const rings: RingConfig[] = [
    { ring: 'dåtid', label: 'Dåtid (kampspar)', radiusPct: 44, nodes: dåtid },
    { ring: 'nutid', label: 'Nutid', radiusPct: 28, nodes: nutid },
    { ring: 'framtid', label: 'Framtid', radiusPct: 38, nodes: framtid },
  ];

  return (
    <div
      className="relative mx-auto my-6 flex aspect-square w-full max-w-md items-center justify-center"
      role="img"
      aria-label={`Tidshjulet med ${entries.length} poster i ringarna Dåtid, Nutid och Framtid`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border border-dashed border-surface-3"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[12%] rounded-full border border-accent/15"
      />

      <motion.div className="absolute inset-[22%] rounded-full border border-accent/25 bg-accent/5 backdrop-blur-sm" />

      <div className="relative z-10 flex h-16 w-16 flex-col items-center justify-center rounded-full border border-surface-3 bg-bg shadow-xl shadow-black/50">
        <Compass className="h-7 w-7 text-accent" />
        <span className="mt-0.5 text-[8px] uppercase tracking-widest text-text-dim">Nu</span>
      </div>

      {rings.map((ring) => (
        <RingNodes
          key={ring.ring}
          config={ring}
          highlightEntryId={highlightEntryId}
          selectedEntryId={selectedEntryId}
          onSelectEntry={onSelectEntry}
          highlightPulse={highlightPulse}
        />
      ))}

      {entries.length === 0 && (
        <div className="absolute inset-x-6 bottom-4 z-30">
          <EmptyState message="Lägg till din första post nedan — Dåtid-ringen fylls från live kampspar." />
        </div>
      )}
    </div>
  );
}
