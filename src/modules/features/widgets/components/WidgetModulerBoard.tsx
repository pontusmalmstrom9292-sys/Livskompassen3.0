/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md */
import { useEffect, useMemo, useState } from 'react';
import { Archive, LayoutGrid, Pin, Plus, Loader2 } from 'lucide-react';
import { useStore } from '@/core/store';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import {
  archiveUserWidget,
  saveUserWidget,
  subscribeUserWidgets,
  updateUserWidgetConfig,
} from '@/core/firebase/firestore';
import type { UserWidget, UserWidgetRow } from '@/core/types/firestore';
import { EmptyState } from '@/core/ui/EmptyState';
import { resolveWidgetStylePreset } from '../config/widgetStylePresets';
import { resolveWidgetBuildCapacity } from '../utils/widgetBuildCapacity';
import { HomeWidgetRenderer } from './HomeWidgetRenderer';
import { WidgetModulerAddForm } from './WidgetModulerAddForm';
import { WidgetButton } from './WidgetButton';

export function WidgetModulerBoard() {
  const user = useStore((s) => s.user);
  const evolutionDoc = useEvolutionStore((s) => s.doc);
  const listenToEvolutionHub = useEvolutionStore((s) => s.listenToEvolutionHub);
  const [widgets, setWidgets] = useState<UserWidgetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const capacity = useMemo(
    () => resolveWidgetBuildCapacity(evolutionDoc),
    [evolutionDoc],
  );

  useEffect(() => {
    if (!user?.uid) return;
    return listenToEvolutionHub(user.uid);
  }, [user?.uid, listenToEvolutionHub]);

  useEffect(() => {
    if (!user?.uid) {
      setWidgets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = subscribeUserWidgets(user.uid, (rows) => {
      setWidgets(rows);
      setLoading(false);
    });
    return unsub;
  }, [user?.uid]);

  const activeWidgets = useMemo(
    () => widgets.filter((w) => (w.status ?? 'active') !== 'archived'),
    [widgets],
  );

  if (!user?.uid) {
    return <EmptyState message="Logga in för att se dina moduler." />;
  }

  const handleUpdate = async (widgetId: string, config: UserWidget['config']) => {
    await updateUserWidgetConfig(user.uid, widgetId, config);
  };

  const handleArchive = async (widgetId: string) => {
    const ok = window.confirm('Arkivera denna modul? Den försvinner från listan men kan återställas senare.');
    if (!ok) return;
    await archiveUserWidget(user.uid, widgetId);
  };

  const handleSave = async (widget: Omit<UserWidget, 'userId' | 'ownerId' | 'createdAt'>) => {
    await saveUserWidget(user.uid, widget);
  };

  return (
    <div className="widget-moduler-board space-y-4">
      <div className="widget-moduler-board__toolbar">
        <div className="min-w-0 space-y-1">
          <p className="flex items-center gap-1.5 text-xs text-text-muted">
            <LayoutGrid className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} aria-hidden />
            {activeWidgets.length === 0
              ? 'Inga moduler ännu — lägg till en nedan.'
              : `${activeWidgets.length} modul${activeWidgets.length === 1 ? '' : 'er'}`}
          </p>
          <p className="text-[11px] text-text-muted" role="status">
            {capacity.canExperiment
              ? `Kapacitet nivå ${capacity.cognitiveLevel} — mallar och Experimentera tillgängliga.`
              : `Kapacitet nivå ${capacity.cognitiveLevel} — enkla mallar. Experimentera öppnas senare.`}
          </p>
        </div>
        {!showAdd ? (
          <WidgetButton type="button" variant="secondary" onClick={() => setShowAdd(true)}>
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Ny modul
          </WidgetButton>
        ) : null}
      </div>

      {showAdd ? (
        <WidgetModulerAddForm
          userId={user.uid}
          nextOrder={widgets.length}
          capacity={capacity}
          onSave={handleSave}
          onCancel={() => setShowAdd(false)}
        />
      ) : null}

      {loading ? (
        <p className="flex items-center justify-center gap-2 py-8 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden />
          Läser moduler…
        </p>
      ) : activeWidgets.length === 0 && !showAdd ? (
        <EmptyState message="Tryck «Ny modul» för nedräkning, checklista, sparmål eller snabbnotis." />
      ) : (
        <div className="widget-moduler-board__grid space-y-3">
          {activeWidgets.map((widget) => {
            const preset = resolveWidgetStylePreset(widget.stylePreset);
            const pinned = Boolean(widget.slotId || widget.pinnedToHome);
            return (
              <div key={widget.id} className="widget-moduler-board__card space-y-1.5">
                <div className="widget-moduler-board__meta flex flex-wrap items-center gap-2 px-1">
                  <span className="text-[10px] uppercase tracking-widest text-text-muted">
                    {preset.label_sv}
                  </span>
                  {pinned ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] text-accent">
                      <Pin className="h-3 w-3" aria-hidden />
                      Fäst
                    </span>
                  ) : null}
                  <WidgetButton
                    type="button"
                    variant="ghost"
                    className="ml-auto min-h-11 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    onClick={() => void handleArchive(widget.id)}
                  >
                    <Archive className="h-3.5 w-3.5" aria-hidden />
                    Arkivera
                  </WidgetButton>
                </div>
                <HomeWidgetRenderer
                  widget={widget}
                  userId={user.uid}
                  onUpdate={handleUpdate}
                  readOnly={false}
                  softActions
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
