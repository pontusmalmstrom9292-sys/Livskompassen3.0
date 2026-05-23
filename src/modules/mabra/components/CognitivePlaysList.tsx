import { ChevronRight } from 'lucide-react';

export type CognitivePlayId = 'grounding' | 'breathing' | 'reframing';

type Play = {
  id: CognitivePlayId;
  label: string;
  hint: string;
};

const PLAYS: Play[] = [
  {
    id: 'grounding',
    label: '5-4-3-2-1 Grounding',
    hint: 'Se, hör, känn — ett steg i taget',
  },
  {
    id: 'breathing',
    label: '4-7-8 Andning',
    hint: 'En minut räcker om start känns tungt',
  },
  {
    id: 'reframing',
    label: 'Perspektiv-skiftet',
    hint: 'Milt självprat — inget att prestera',
  },
];

type Props = {
  onStart: (play: CognitivePlayId) => void;
};

export function CognitivePlaysList({ onStart }: Props) {
  return (
    <section className="mabra-reflection-block" aria-labelledby="mabra-plays-heading">
      <h4 id="mabra-plays-heading" className="mabra-reflection-kicker">
        Kognitiva lekar
      </h4>
      <ul className="mabra-plays-list">
        {PLAYS.map((play) => (
          <li key={play.id}>
            <button type="button" onClick={() => onStart(play.id)} className="mabra-play-row">
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-sm font-medium text-accent">{play.label}</span>
                <span className="mt-0.5 block text-xs text-text-dim">{play.hint}</span>
              </span>
              <span className="mabra-play-go">
                GO
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
