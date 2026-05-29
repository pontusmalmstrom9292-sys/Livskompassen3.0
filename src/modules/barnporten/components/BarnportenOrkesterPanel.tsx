import { Link } from 'react-router-dom';
import { BARNPORTEN_AGENTS } from '../constants/barnportenAgents';

/** Förälder — barn-Orkester (länk till Valv, ingen cross-RAG). */
export function BarnportenOrkesterPanel() {
  return (
    <div className="rounded-xl border border-white/10 p-3">
      <p className="text-[10px] uppercase tracking-widest text-text-dim">Barnporten-Orkester</p>
      <ul className="mt-2 space-y-2 text-sm text-text-muted">
        {BARNPORTEN_AGENTS.map((a) => (
          <li key={a.id}>
            <span className="font-medium text-accent">{a.name}</span> — {a.role}: {a.focus}
          </li>
        ))}
      </ul>
      <Link to="/dagbok?tab=bevis&vaultTab=orkester" className="btn-pill--ghost mt-3 inline-flex text-xs">
        Föräldra-Orkester i Valv
      </Link>
    </div>
  );
}
