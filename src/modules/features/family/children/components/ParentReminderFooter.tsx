import { Heart } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { barnfokusParentPromptForToday } from '../content/barnfokusCatalog';

type Props = {
  childAlias?: string;
};

/** D14 — lågaffektiv påminnelse under Familjen. */
export function ParentReminderFooter({ childAlias = 'barnet' }: Props) {
  const parentPrompt = barnfokusParentPromptForToday(childAlias);

  return (
    <BentoCard glow="blue" className="!p-4 text-center">
      <Heart className="mx-auto h-4 w-4 text-accent/60" aria-hidden />
      <p className="mt-2 text-sm text-text-muted">
        Du är den trygga hamnen — även när världen känns splittrad.
      </p>
      <p className="mt-2 text-xs text-accent/80">{parentPrompt.text_sv}</p>
      <p className="mt-1 text-xs text-text-dim">
        Ett minne i taget räcker. Du behöver inte bevisa att du är en bra pappa varje kväll.
      </p>
    </BentoCard>
  );
}
