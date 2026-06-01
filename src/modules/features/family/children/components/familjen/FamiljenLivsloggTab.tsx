import { Link } from 'react-router-dom';
import { Anchor } from 'lucide-react';
import { useMemo } from 'react';
import type { FamiljenShell } from '../../hooks/useFamiljenShell';
import { useChildMomentView } from '../../hooks/useChildMomentView';
import { getFeaturedMoment, momentBody } from '../../utils/childMomentHelpers';
import { ChildMomentTabs } from './ChildMomentTabs';
import { ChildMomentStunderPanel } from './ChildMomentStunderPanel';
import { ChildMomentOmPanel } from './ChildMomentOmPanel';
import { ChildMomentFavoriterPanel } from './ChildMomentFavoriterPanel';

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
        <div className="familjen-anchor-card">
          <div className="mb-2 flex items-center gap-2">
            <Anchor className="h-4 w-4 text-accent" />
            <p className="text-[10px] uppercase tracking-widest text-accent/90">
              Uthållen stund — {activeChild}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-text-muted">&ldquo;{featuredText}&rdquo;</p>
        </div>
      )}

      <ChildMomentTabs active={view} childAlias={activeChild} onChange={setView} />

      <div role="tabpanel">
        {view === 'stunder' && <ChildMomentStunderPanel shell={shell} />}
        {view === 'om' && <ChildMomentOmPanel shell={shell} />}
        {view === 'favoriter' && <ChildMomentFavoriterPanel shell={shell} />}
      </div>

      <p className="text-center text-xs text-text-dim">
        <Link to="/dagbok?tab=bevis" className="hover:text-accent">
          Öppna arkiv för låsta poster och arkiv-chatt →
        </Link>
      </p>
    </div>
  );
}
