import { RefreshCw } from 'lucide-react';
import { pickCompassFact } from '../compassLifeAreaActions';

type Props = {
  fact: string;
  seed: string;
  onNewFact: (text: string) => void;
  onClose: () => void;
};

export function HomeFaktaPanel({ fact, seed, onNewFact, onClose }: Props) {
  return (
    <div className="home-fakta-panel">
      <p className="text-[10px] uppercase tracking-widest text-text-dim">Rolig fakta</p>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">{fact}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-pill--ghost text-xs"
          onClick={() => onNewFact(pickCompassFact(`${seed}-${Date.now()}`))}
        >
          <RefreshCw className="h-3 w-3" />
          Ny fakta
        </button>
        <button type="button" className="btn-pill--ghost text-xs" onClick={onClose}>
          Stäng
        </button>
      </div>
    </div>
  );
}
