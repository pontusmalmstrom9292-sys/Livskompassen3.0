import { TimeAndPayPanel } from './TimeAndPayPanel';
import { EconomyPayslipCard } from './EconomyPayslipCard';

export function EconomyTidPanel() {
  return (
    <div className="space-y-4">
      <TimeAndPayPanel />
      <EconomyPayslipCard />
    </div>
  );
}
