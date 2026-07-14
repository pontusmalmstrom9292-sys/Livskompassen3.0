import { BentoCard } from '@/shared/ui/BentoCard';
import { EconomyOverviewPanel } from '@/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel';
import { EkonomiInputSuperModule } from '@/features/dailyLife/wellbeing/economy/supermodule';

type Props = {
  userId: string;
  useLegacyEkonomi: boolean;
};

/** Lazy-loaded ekonomi-flik för Liv och göra. */
export function LivEkonomiTabPanel({ userId, useLegacyEkonomi }: Props) {
  return (
    <BentoCard glow="gold" depth noHover bare className="!p-4 sm:!p-5">
      <div className="space-y-4">
        {useLegacyEkonomi ? (
          <EconomyOverviewPanel userId={userId} />
        ) : (
          <EkonomiInputSuperModule userId={userId} />
        )}
      </div>
    </BentoCard>
  );
}
