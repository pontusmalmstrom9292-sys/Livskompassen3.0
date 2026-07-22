import { getMabraPlay } from '../../content/mabraExtendedPlays';
import { MB_PLAY_54321_BANK_ID } from '../../content/grounding54321Play';
import { MabraGrounding54321Wizard } from './MabraGrounding54321Wizard';
import { MabraToolShell } from './MabraToolShell';

type Props = {
  bankId: string;
  onBack: () => void;
};

export function MabraMicroPlayTool({ bankId, onBack }: Props) {
  if (bankId === MB_PLAY_54321_BANK_ID) {
    return <MabraGrounding54321Wizard onBack={onBack} />;
  }

  const play = getMabraPlay(bankId);

  if (!play) {
    return (
      <MabraToolShell title="Mikrolek" onBack={onBack}>
        <p className="text-sm text-text-muted">Leken hittades inte.</p>
      </MabraToolShell>
    );
  }

  return (
    <MabraToolShell title={play.title_sv} description="≤ 2 min · ingen poäng" onBack={onBack}>
      <p className="text-base leading-relaxed text-text-muted">{play.rule_sv}</p>
      <p className="mt-4 text-xs text-text-muted">
        Klart när du vill — tryck tillbaka till hubben.
      </p>
    </MabraToolShell>
  );
}
