import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamplePreviewCard } from '@/shared/ui/ExamplePreviewCard';
import { ProjektPreviewMini } from '@/features/admin/planning/components/previews/GoraModulePreviews';
import { ProjektPickerSheet } from './ProjektPickerSheet';
import type { ProjectBlockType } from '../types';

function NotePreviewMini() {
  return (
    <p className="text-[10px] italic text-text-muted">
      &quot;Packlista inför sommar — pojkarna…&quot;
    </p>
  );
}

function ImagePreviewMini() {
  return (
    <div className="rounded-lg border border-dashed border-accent/25 bg-surface/30 px-3 py-4 text-center text-[10px] text-text-dim">
      Bild + caption
    </div>
  );
}

function TaskPreviewMini() {
  return (
    <ul className="space-y-0.5 text-[10px] text-text-muted">
      <li>□ Ringa skola</li>
      <li>□ Boka tid</li>
    </ul>
  );
}

function VideoPreviewMini() {
  return (
    <div className="rounded-lg border border-dashed border-accent-secondary/25 bg-surface/30 px-3 py-4 text-center text-[10px] text-text-dim">
      Kort video + caption
    </div>
  );
}

const START_ROUTES: Record<ProjectBlockType, string> = {
  list: '/projekt/ny?type=list',
  note: '/projekt/ny?type=note',
  image: '/projekt/ny?type=image',
  video: '/projekt/ny?type=video',
  task: '/projekt/ny?type=task',
};

/** Tom projekt-hub — statiska previews före första projekt. */
export function ProjektTomStatePanel() {
  const navigate = useNavigate();
  const [pickerOpen, setPickerOpen] = useState(false);

  const go = (type: ProjectBlockType) => {
    navigate(START_ROUTES[type]);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">Så här kan ett projekt se ut — välj en startpunkt.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <ExamplePreviewCard
          title="Lista"
          lead="Inköp, packning eller steg — utan Kanban-stress."
          preview={<ProjektPreviewMini />}
          ctaLabel="Skapa lista"
          tone="gold"
          onStart={() => go('list')}
        />
        <ExamplePreviewCard
          title="Anteckning"
          lead="Fri text — kopplas valfritt till Handling."
          preview={<NotePreviewMini />}
          ctaLabel="Skapa anteckning"
          tone="lavender"
          onStart={() => go('note')}
        />
        <ExamplePreviewCard
          title="Bild"
          lead="Foto eller skärmdump med kort caption."
          preview={<ImagePreviewMini />}
          ctaLabel="Lägg till bild"
          tone="indigo"
          onStart={() => go('image')}
        />
        <ExamplePreviewCard
          title="Video"
          lead="Kort klipp — max 50 MB, sparas i Storage."
          preview={<VideoPreviewMini />}
          ctaLabel="Lägg till video"
          tone="lavender"
          onStart={() => go('video')}
        />
        <ExamplePreviewCard
          title="Uppgift"
          lead="En sak — kan synkas med projekt-ID i Kanban."
          preview={<TaskPreviewMini />}
          ctaLabel="Skapa uppgift"
          tone="emerald"
          onStart={() => go('task')}
        />
      </div>
      <button
        type="button"
        className="btn-pill--ghost w-full text-sm"
        onClick={() => setPickerOpen(true)}
      >
        Välj typ i sheet (samma som widget)
      </button>
      <ProjektPickerSheet open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </div>
  );
}
