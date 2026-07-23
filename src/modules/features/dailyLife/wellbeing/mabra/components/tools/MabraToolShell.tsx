import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { ImmersiveExperienceShell } from '@/shared/ui/ImmersiveExperienceShell';
import { BentoCard } from '@/shared/ui/BentoCard';

type Props = {
  title: string;
  description?: string;
  onBack: () => void;
  children: ReactNode;
  /** When false, renders inline (legacy). Default: fullscreen immersive. */
  immersive?: boolean;
};

export function MabraToolShell({
  title,
  description,
  onBack,
  children,
  immersive = true,
}: Props) {
  const inner = (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onBack}
        className="planering-back-link min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <ChevronLeft className="h-4 w-4" />
        Tillbaka till MåBra
      </button>
      <BentoCard title={title} description={description}>
        {children}
      </BentoCard>
    </div>
  );

  if (!immersive) {
    return inner;
  }

  return (
    <ImmersiveExperienceShell title={title} onExit={onBack} themeId="J-mabra-lavendel">
      {inner}
    </ImmersiveExperienceShell>
  );
}
