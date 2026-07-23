import { ButtonLink } from '@/design-system';
import { BARNPORTEN_AGENTS } from '../constants/barnportenAgents';

/** Förälder — barn-Orkester (länk till Valv, ingen cross-RAG). */
export function BarnportenOrkesterPanel() {
  return (
    <div className="familjen-tab-surface">
      <p className="text-[10px] uppercase tracking-widest text-text-muted">Barnens assistenter</p>
      <ul className="mt-2 space-y-2 text-sm text-text-muted">
        {BARNPORTEN_AGENTS.map((a) => (
          <li key={a.id}>
            <span className="font-medium text-accent">{a.name}</span> — {a.role}: {a.focus}
          </li>
        ))}
      </ul>
      <ButtonLink
        to="/valvet?vaultTab=orkester"
        variant="ghost"
        className="mt-3 inline-flex min-h-11 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        Öppna meddelande-analys i arkiv
      </ButtonLink>
    </div>
  );
}
