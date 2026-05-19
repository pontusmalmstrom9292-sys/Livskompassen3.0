import { Link } from 'react-router-dom';
import { BentoCard } from '../ui/BentoCard';
import { KompisAvatar } from '../../kompis/components/KompisAvatar';
import { Compass, Shield, Anchor, BookOpen, Heart, Sparkles, Wallet } from 'lucide-react';

const modules = [
  { to: '/kompasser', label: 'Kompasser', desc: 'Morgon, dag och kväll — ett steg i taget.', icon: Compass },
  { to: '/valv', label: 'Verklighetsvalvet', desc: 'WORM-bevis och sanning.', icon: Shield },
  { to: '/hamn', label: 'Safe Harbor', desc: 'BIFF och Grey Rock-svar.', icon: Anchor },
  { to: '/dagbok', label: 'Dagbok', desc: 'Humör och korta reflektioner.', icon: BookOpen },
  { to: '/kunskap', label: 'Kunskapsvalvet', desc: 'Fråga Kompis om ditt Kampspår.', icon: Sparkles },
  { to: '/barnen', label: 'Barnens livsloggar', desc: 'Neutrala, faktabaserade observationer.', icon: Heart },
  { to: '/ekonomi', label: 'Ekonomi', desc: 'Budget och likviditet.', icon: Wallet },
];

export function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <KompisAvatar state="idle" size="md" />
        </div>
        <h2 className="text-3xl text-[#FDE68A] font-light">Välkommen Hem</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto italic">
          En trygg plats för din sanning, din ekonomi och din återhämtning.
        </p>
      </div>

      <div className="grid gap-3">
        {modules.map(({ to, label, desc, icon: Icon }) => (
          <Link key={to} to={to}>
            <BentoCard title={label} icon={<Icon className="h-4 w-4" />}>
              <p className="text-sm text-slate-300">{desc}</p>
            </BentoCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
