import { Activity } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  MOVEMENT_PROGRAMS,
  programsForCapacity,
  type MovementProgram,
} from '../content/movementPrograms';
import { useMabra30Capacity } from '../lib/mabra30Capacity';
import { MabraMovementCoachPanel } from './MabraMovementCoachPanel';

const COPY = {
  eyebrow: 'Rörelse & kropp',
  lead: 'Skonsam rörelse — inte prestation. Ett program i taget.',
  level1Hint: 'Lugn kapacitet — bara mikrosteg syns just nu.',
  start: 'Starta',
  pause: 'Pausa',
  resume: 'Fortsätt',
  done: 'Markera som klar',
  doneTitle: 'Bra — kroppen fick röra sig',
  doneLead: 'Inget räknas som missat om du hoppar över en dag.',
  pickAnother: 'Välj ett annat program',
} as const;

type Phase = 'pick' | 'active' | 'done';

type Props = {
  uid?: string;
  onComplete?: (payload: { exerciseType: MovementProgram['exerciseType']; elapsedSeconds: number; bankId: string }) => void;
};

function formatRemaining(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MabraMovementPanel({ uid, onComplete }: Props) {
  const { capacityLevel } = useMabra30Capacity(uid);
  const visiblePrograms = useMemo(
    () => programsForCapacity(capacityLevel),
    [capacityLevel],
  );

  const [phase, setPhase] = useState<Phase>('pick');
  const [active, setActive] = useState<MovementProgram | null>(null);
  const [remainingSec, setRemainingSec] = useState(0);
  const [paused, setPaused] = useState(false);
  const startedAt = useRef<number | null>(null);
  const elapsedRef = useRef(0);

  const resetTimer = useCallback(() => {
    startedAt.current = null;
    elapsedRef.current = 0;
    setRemainingSec(0);
    setPaused(false);
  }, []);

  const beginProgram = (program: MovementProgram) => {
    resetTimer();
    setActive(program);
    setRemainingSec(program.durationMinutes * 60);
    startedAt.current = Date.now();
    setPhase('active');
  };

  useEffect(() => {
    if (phase !== 'active' || !active || paused) return undefined;
    if (remainingSec <= 0) return undefined;

    const id = window.setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [phase, active, paused, remainingSec]);

  const finish = () => {
    if (!active) return;
    const elapsed =
      startedAt.current != null
        ? Math.max(1, Math.round((Date.now() - startedAt.current) / 1000))
        : active.durationMinutes * 60;
    elapsedRef.current = elapsed;
    onComplete?.({
      exerciseType: active.exerciseType,
      elapsedSeconds: elapsed,
      bankId: active.bankId,
    });
    setPhase('done');
  };

  if (phase === 'done' && active) {
    return (
      <BentoCard title={COPY.eyebrow} icon={<Activity className="h-4 w-4" />} glow="green">
        <p className="text-base text-success">{COPY.doneTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{COPY.doneLead}</p>
        <button
          type="button"
          className="btn-pill--ghost mt-4 w-full text-sm"
          onClick={() => {
            setActive(null);
            resetTimer();
            setPhase('pick');
          }}
        >
          {COPY.pickAnother}
        </button>
      </BentoCard>
    );
  }

  if (phase === 'active' && active) {
    return (
      <BentoCard title={active.title} icon={<Activity className="h-4 w-4" />} glow="green">
        <p className="text-sm text-text-muted">{active.instruction}</p>
        <p className="mt-4 font-display-serif text-3xl tracking-wider text-accent">
          {formatRemaining(remainingSec)}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            className="btn-pill--secondary w-full"
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? COPY.resume : COPY.pause}
          </button>
          <button type="button" className="btn-pill--ghost w-full text-sm" onClick={finish}>
            {COPY.done}
          </button>
        </div>
      </BentoCard>
    );
  }

  return (
    <BentoCard title={COPY.eyebrow} icon={<Activity className="h-4 w-4" />} glow="green">
      <p className="mb-3 text-sm text-text-muted">{COPY.lead}</p>
      {capacityLevel === 1 ? (
        <p className="mb-3 text-xs text-text-dim">{COPY.level1Hint}</p>
      ) : null}
      <div className="space-y-2">
        {visiblePrograms.map((program) => (
          <button
            key={program.id}
            type="button"
            onClick={() => beginProgram(program)}
            className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-left hover:border-accent/40 hover:bg-surface-3"
          >
            <p className="text-sm font-medium text-accent">{program.title}</p>
            <p className="mt-1 text-xs text-text-muted">{program.lead}</p>
          </button>
        ))}
      </div>
      {visiblePrograms.length === 0 ? (
        <p className="text-sm text-text-muted">Inga program tillgängliga just nu.</p>
      ) : null}
      {!uid ? (
        <p className="mt-3 text-xs text-text-dim">Logga in för att spara session i molnet.</p>
      ) : null}

      {capacityLevel >= 2 ? (
        <div className="mt-6 border-t border-border pt-4">
          <MabraMovementCoachPanel uid={uid} />
        </div>
      ) : null}
    </BentoCard>
  );
}

/** Statisk guard — minst ett program i bank. */
export const MOVEMENT_PROGRAM_COUNT = MOVEMENT_PROGRAMS.length;
