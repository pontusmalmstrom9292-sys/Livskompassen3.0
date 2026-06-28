import { Brain } from 'lucide-react';
import { ButtonLink } from '@/design-system';

type Props = {
  activeCount: number;
};

/** Kort banner när Pansarläge körs på Handling — samma logik som Kanban. */
export function CognitiveGuardOverloadBanner({ activeCount }: Props) {
  return (
    <div
      className="flex flex-col gap-2 rounded-xl border border-accent/30 bg-accent/5 px-3 py-3 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between"
      role="status"
    >
      <div className="flex items-start gap-2">
        <Brain className="h-4 w-4 shrink-0 animate-pulse text-accent" aria-hidden />
        <p>
          <span className="font-medium text-text">Kognitivt skydd aktivt.</span>{' '}
          Du har {activeCount} oavslutade uppgifter — Pansarläge visas på Handling (ett steg i taget).
        </p>
      </div>
      <ButtonLink to="/planering?tab=handling" variant="accent" size="sm" className="shrink-0 text-center">
        Öppna Handling
      </ButtonLink>
    </div>
  );
}
