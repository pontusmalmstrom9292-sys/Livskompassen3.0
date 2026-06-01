import { getMabraPlay } from '../../content/mabraExtendedPlays';
import { MabraToolShell } from './MabraToolShell';

type Props = {
  bankId: string;
  onBack: () => void;
};

export function MabraMicroPlayTool({ bankId, onBack }: Props) {
  const play = getMabraPlay(bankId);

  if (!play) {
    return (
      <MabraToolShell title="Mikrolek" onBack={onBack}>
        <p className="text-sm text-text-dim">Leken hittades inte.</p>
      </MabraToolShell>
    );
  }

  return (
    <MabraToolShell title={play.title_sv} description="≤ 2 min · ingen poäng" onBack={onBack}>
      <p className="text-base leading-relaxed text-text-muted">{play.rule_sv}</p>
      <p className="mt-4 text-xs text-text-dim">
        Klart när du vill — tryck tillbaka till hubben.
      </p>
    </MabraToolShell>
  );
}
