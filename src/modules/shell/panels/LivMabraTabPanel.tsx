import { BentoCard } from '@/shared/ui/BentoCard';
import { MabraHubView } from '@/features/dailyLife/wellbeing/mabra/views/MabraHubView';

/** Lazy-loaded MåBra-flik — inline på /vardagen utan auto-redirect till /mabra/*. */
export function LivMabraTabPanel() {
  return (
    <BentoCard glow="green" depth noHover bare className="!p-4 sm:!p-5">
      <MabraHubView inlineHub />
    </BentoCard>
  );
}
