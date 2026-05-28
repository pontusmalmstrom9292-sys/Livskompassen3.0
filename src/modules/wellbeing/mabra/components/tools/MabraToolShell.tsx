import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { BentoCard } from '../../../../core/ui/BentoCard';

type Props = {
  title: string;
  description?: string;
  onBack: () => void;
  children: ReactNode;
};

export function MabraToolShell({ title, description, onBack, children }: Props) {
  return (
    <div className="space-y-3">
      <button type="button" onClick={onBack} className="planering-back-link">
        <ChevronLeft className="h-4 w-4" />
        Tillbaka till MåBra
      </button>
      <BentoCard title={title} description={description}>
        {children}
      </BentoCard>
    </div>
  );
}
