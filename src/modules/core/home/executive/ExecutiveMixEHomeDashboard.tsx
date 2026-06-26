import { useState } from 'react';
import { HomeGreeting } from '../HomeGreeting';
import { HomeStreakChip } from '../HomeStreakChip';
import { HomeExecutiveSnabbstart } from '../HomeExecutiveSnabbstart';
import { DagensRiktningCard } from '../DagensRiktningCard';

type Props = {
  onCheckInSaved?: () => void;
};

/** mix-E klassisk hem — hälsning, kompass-scen, dagens riktning. */
export function ExecutiveMixEHomeDashboard({ onCheckInSaved }: Props) {
  const [riktningOpen, setRiktningOpen] = useState(false);

  return (
    <div className="executive-home-dashboard executive-home-dashboard--mix-e mx-auto w-full max-w-2xl space-y-4 pb-4">
      <div className="exec-mix-e-greeting relative">
        <HomeGreeting variant="executive" mockupCopy hideEyebrow />
        <div className="exec-mix-e-greeting__eld">
          <HomeStreakChip />
        </div>
      </div>
      <HomeExecutiveSnabbstart className="exec-mix-e-snabbstart" />
      <DagensRiktningCard
        open={riktningOpen}
        onOpenChange={setRiktningOpen}
        onCheckInSaved={onCheckInSaved}
      />
    </div>
  );
}
