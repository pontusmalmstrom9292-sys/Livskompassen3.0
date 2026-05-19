import { Anchor, CheckSquare } from 'lucide-react';
import { BentoCard } from '../../components/ui/BentoCard';

export function SafeHarborPage() {
  return (
    <BentoCard title="Safe Harbor" icon={<Anchor className="h-4 w-4" />}>
      <p className="mb-3 text-sm text-slate-300">
        Morgonkompassen ger exakt ett mikrosteg for att minska kognitiv belastning.
      </p>
      <ul className="space-y-2 text-sm text-slate-300">
        <li className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-[#FDE68A]" />
          VIVIR-logik: sortera fakta fran brus
        </li>
        <li className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-[#FDE68A]" />
          BIFF/Grey Rock-forslag utan JADE
        </li>
      </ul>
    </BentoCard>
  );
}
