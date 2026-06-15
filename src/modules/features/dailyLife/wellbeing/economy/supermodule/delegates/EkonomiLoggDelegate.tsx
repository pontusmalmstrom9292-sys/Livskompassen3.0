import { EconomyLogPanel } from '@/features/dailyLife/wellbeing/economy/components/EconomyLogPanel';

export type EkonomiLoggDelegateProps = {
  onChanged?: () => void;
};

/** Fas 14A — fasta räkningar och vardagsutgifter (privatekonomi). */
export function EkonomiLoggDelegate({ onChanged }: EkonomiLoggDelegateProps) {
  return (
    <div className="ekonomi-delegate ekonomi-delegate--logg" data-write-target="economy_ledger">
      <EconomyLogPanel scope="vardag" onChanged={onChanged} />
    </div>
  );
}
