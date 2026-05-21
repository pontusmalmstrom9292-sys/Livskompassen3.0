import { Link } from 'react-router-dom';
import { BentoCard } from '../ui/BentoCard';
import { KompisAvatar } from '../../kompis/components/KompisAvatar';
import { Compass, Shield, Anchor, BookOpen, Heart, Sparkles, Wallet, Brain } from 'lucide-react';

const modules = [
  { to: '/kompasser', label: 'Kompasser', desc: 'Morgon, dag och kväll — ett steg i taget.', icon: Compass },
  { to: '/valv', label: 'Verklighetsvalvet', desc: 'WORM-bevis och sanning.', icon: Shield },
  { to: '/hamn', label: 'Safe Harbor', desc: 'BIFF och Grey Rock-svar.', icon: Anchor },
  { to: '/dagbok', label: 'Dagbok', desc: 'Humör och korta reflektioner.', icon: BookOpen },
  { to: '/speglar', label: 'Speglar', desc: 'ACT + VIVIR — känsla vs fakta.', icon: Brain },
  { to: '/kunskap', label: 'Kunskapsvalvet', desc: 'Fråga Kompis om ditt Kampspår.', icon: Sparkles },
  { to: '/barnen', label: 'Barnens livsloggar', desc: 'Kasper, Arvid och Balansmätaren.', icon: Heart },
  { to: '/ekonomi', label: 'Ekonomi', desc: 'Budget och likviditet.', icon: Wallet },
];

export function HomePage() {
  return (
    <div className="space-y-8">
      <div className="glass-hero space-y-4 p-8 text-center">
        <div className="flex justify-center">
          <KompisAvatar state="idle" size="md" />
        </div>
        <h2 className="font-display text-3xl font-light text-accent">Välkommen Hem</h2>
        <p className="mx-auto max-w-xs text-sm italic leading-relaxed text-text-muted">
          En trygg plats för din sanning, din ekonomi och din återhämtning.
        </p>
      </div>

      <div className="grid gap-3">
        {modules.map(({ to, label, desc, icon: Icon }) => (
          <Link key={to} to={to} className="block transition-transform hover:scale-[1.01]">
            <BentoCard title={label} icon={<Icon className="h-4 w-4" />}>
              <p className="text-sm text-text-muted">{desc}</p>
            </BentoCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
