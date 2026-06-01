import { ParalysPanel } from '@/features/dailyLife/wellbeing/compasses/components/ParalysPanel';

export function HomeTaskPanel() {
  return (
    <div className="home-module-panel">
      <ParalysPanel onDone={() => undefined} />
    </div>
  );
}
