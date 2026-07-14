/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md */
import { useEffect, useState } from 'react';
import { LayoutGrid, Plus, Loader2 } from 'lucide-react';
import { useStore } from '@/core/store';
import {
  deleteUserWidget,
  saveUserWidget,
  subscribeUserWidgets,
  updateUserWidgetConfig,
} from '@/core/firebase/firestore';
import type { UserWidget, UserWidgetRow } from '@/core/types/firestore';
import { EmptyState } from '@/core/ui/EmptyState';
import { HomeWidgetRenderer } from './HomeWidgetRenderer';
import { WidgetModulerAddForm } from './WidgetModulerAddForm';
import { WidgetButton } from './WidgetButton';

export function WidgetModulerBoard() {
  const user = useStore((s) => s.user);
  const [widgets, setWidgets] = useState<UserWidgetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

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

  if (!user?.uid) {
    return <EmptyState message="Logga in för att se dina moduler." />;
  }

  const handleUpdate = async (widgetId: string, config: UserWidget['config']) => {
    await updateUserWidgetConfig(user.uid, widgetId, config);
  };

  const handleDelete = async (widgetId: string) => {
    await deleteUserWidget(user.uid, widgetId);
  };

  const handleSave = async (widget: Omit<UserWidget, 'userId' | 'ownerId' | 'createdAt'>) => {
    await saveUserWidget(user.uid, widget);
  };

  return (
    <div className="widget-moduler-board space-y-4">
      <div className="widget-moduler-board__toolbar">
        <p className="text-xs text-text-muted flex items-center gap-1.5">
          <LayoutGrid className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} aria-hidden />
          {widgets.length === 0
            ? 'Inga moduler ännu — lägg till en nedan.'
            : `${widgets.length} modul${widgets.length === 1 ? '' : 'er'}`}
        </p>
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
          onSave={handleSave}
          onCancel={() => setShowAdd(false)}
        />
      ) : null}

      {loading ? (
        <p className="flex items-center justify-center gap-2 py-8 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden />
          Läser moduler…
        </p>
      ) : widgets.length === 0 && !showAdd ? (
        <EmptyState message="Tryck «Ny modul» för nedräkning, checklista, sparmål eller snabbnotis." />
      ) : (
        <div className="widget-moduler-board__grid space-y-3">
          {widgets.map((widget) => (
            <HomeWidgetRenderer
              key={widget.id}
              widget={widget}
              userId={user.uid}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
