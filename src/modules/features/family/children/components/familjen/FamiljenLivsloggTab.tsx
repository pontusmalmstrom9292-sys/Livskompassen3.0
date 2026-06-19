import { Link } from 'react-router-dom';
import { Anchor } from 'lucide-react';
import { useMemo } from 'react';
import { BentoCard } from '@/shared/ui/BentoCard';
import type { FamiljenShell } from '../../hooks/useFamiljenShell';
import type { ChildAlias } from '../../constants';
import { useChildMomentView } from '../../hooks/useChildMomentView';
import { getFeaturedMoment, momentBody } from '../../utils/childMomentHelpers';
import { ChildMomentTabs } from './ChildMomentTabs';
import { ChildMomentStunderPanel } from './ChildMomentStunderPanel';
import { ChildMomentOmPanel } from './ChildMomentOmPanel';
import { ChildMomentFavoriterPanel } from './ChildMomentFavoriterPanel';
import { ChildrenLogsChat } from '../ChildrenLogsChat';
import { PinnedPlaneringModuleSlot } from '@/features/admin/planning/components/PinnedPlaneringModuleSlot';

type Props = {
  shell: FamiljenShell;
};

export function FamiljenLivsloggTab({ shell }: Props) {
  const { user, activeChild } = shell;
  const { view, setView } = useChildMomentView();

  const featured = useMemo(
    () => getFeaturedMoment(shell.logs, activeChild),
    [shell.logs, activeChild],
  );

  if (!user) return null;

  const featuredText = featured ? momentBody(featured) : null;

  return (
    <div className="space-y-4">
      {featuredText && (
        <BentoCard
          glow="blue"
          title={`Uthållen stund — ${activeChild}`}
          icon={<Anchor className="h-4 w-4" />}
        >
          <p className="text-sm leading-relaxed text-text-muted">&ldquo;{featuredText}&rdquo;</p>
        </BentoCard>
      )}

      <ChildMomentTabs active={view} childAlias={activeChild} onChange={setView} />

      <PinnedPlaneringModuleSlot targetId="familjen.livslogg" />

      <div role="tabpanel">
        {view === 'stunder' && <ChildMomentStunderPanel shell={shell} />}
        {view === 'om' && <ChildMomentOmPanel shell={shell} />}
        {view === 'favoriter' && <ChildMomentFavoriterPanel shell={shell} />}
      </div>

      <ChildrenLogsChat activeChild={activeChild as ChildAlias} />

      <p className="text-center text-xs text-text-dim">
        Bevis till Valv sker manuellt per stund —{' '}
        <Link to="/valvet?vaultTab=logga" className="hover:text-accent">
          öppna Valv
        </Link>
        . Chatt ovan läser endast barnens livslogg (egen silo).
      </p>
    </div>
  );
}
