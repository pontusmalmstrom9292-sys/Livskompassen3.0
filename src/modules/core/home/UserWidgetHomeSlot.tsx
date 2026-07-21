/**
 * W2 — Hem-adapter för user_widgets.
 * Visar aktiva moduler med slotId=hem.brass.below-grid eller legacy pinnedToHome.
 * Read-only (ingen delete/soft på Hem).
 */
import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/core/store';
import { subscribeUserWidgets } from '@/core/firebase/firestore';
import type { UserWidgetRow } from '@/core/types/firestore';
import { HomeWidgetRenderer } from '@/features/widgets/components/HomeWidgetRenderer';
import {
  isPinnedToHomeSlot,
  USER_WIDGET_HOME_SLOT_ID,
} from '@/features/widgets/utils/normalizeUserWidget';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { textStyles } from '@/design-system';

export function UserWidgetHomeSlot() {
  const user = useStore((s) => s.user);
  const [widgets, setWidgets] = useState<UserWidgetRow[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setWidgets([]);
      setReady(true);
      return;
    }
    setReady(false);
    return subscribeUserWidgets(user.uid, (rows) => {
      setWidgets(rows);
      setReady(true);
    });
  }, [user?.uid]);

  const pinned = useMemo(
    () =>
      widgets
        .filter((w) => Boolean(w?.id))
        .filter((w) => (w.status ?? 'active') !== 'archived')
        .filter((w) => isPinnedToHomeSlot(w) || w.slotId === USER_WIDGET_HOME_SLOT_ID)
        .sort((a, b) => a.order - b.order),
    [widgets],
  );

  if (!user?.uid) return null;
  if (!ready) {
    return (
      <div className="user-widget-home-slot" aria-busy="true" aria-label="Laddar fästa moduler">
        <HubPanelSkeleton label="Laddar moduler…" lines={2} />
      </div>
    );
  }
  if (pinned.length === 0) return null;

  return (
    <section
      className="user-widget-home-slot calm-card space-y-3 p-3 sm:p-4"
      aria-label="Mina fästa moduler"
    >
      <p className={`px-0.5 ${textStyles.eyebrow} text-accent/80`}>Mina moduler</p>
      {pinned.map((widget) => (
        <HomeWidgetRenderer
          key={widget.id}
          widget={widget}
          userId={user.uid}
          readOnly
        />
      ))}
    </section>
  );
}
