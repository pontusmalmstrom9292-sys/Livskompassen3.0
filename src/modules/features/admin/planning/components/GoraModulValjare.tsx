import { useNavigate } from 'react-router-dom';
import { ExamplePreviewCard } from './ExamplePreviewCard';
import {
  FokusPreviewMini,
  FramstegPreviewMini,
  InkopslistaPreviewMini,
  InkorgPreviewMini,
  KanbanPreviewMini,
  ProjektPreviewMini,
} from './previews/GoraModulePreviews';
import { markGoraModulValjareSeen } from '../utils/goraModulValjareStorage';

/** Modulväljare — max 5 kort, ett beslut i taget. */
export function GoraModulValjare() {
  const navigate = useNavigate();

  const go = (path: string) => {
    markGoraModulValjareSeen();
    navigate(path);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        Välj ett spår. Resten kan vänta — inget döljs bakom flikar.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ExamplePreviewCard
          title="Jag ska göra en sak nu"
          lead="Kanban eller fokus — en sak i taget."
          preview={<KanbanPreviewMini />}
          ctaLabel="Öppna Handling"
          tone="gold"
          onStart={() => go('/planering?tab=handling&picked=1')}
        />
        <ExamplePreviewCard
          title="Sortera inkorg"
          lead="Klistra in mejl — blir uppgift i Handling."
          preview={<InkorgPreviewMini />}
          ctaLabel="Öppna Inkorg"
          tone="lavender"
          onStart={() => go('/planering?tab=inkorg&picked=1')}
        />
        <ExamplePreviewCard
          title="Bygg projekt"
          lead="Lista, anteckning, bild — flexibelt."
          preview={<ProjektPreviewMini />}
          ctaLabel="Gå till Projekt"
          tone="gold"
          onStart={() => go('/projekt')}
        />
        <ExamplePreviewCard
          title="Vecka / överblick"
          lead="Antal att göra, väntar, klart — inga grafer."
          preview={<FramstegPreviewMini />}
          ctaLabel="Se Framsteg"
          tone="indigo"
          onStart={() => go('/planering?tab=framsteg&picked=1')}
        />
        <ExamplePreviewCard
          title="Inköpslista"
          lead="Snabb punktlista i affären."
          preview={<InkopslistaPreviewMini />}
          ctaLabel="Öppna Inköpslista"
          tone="emerald"
          onStart={() => go('/planering?tab=inkop&picked=1')}
        />
      </div>
      <ExamplePreviewCard
        title="Fokus — ett mikrosteg"
        lead="Paralys-Brytaren när kanban känns tungt."
        preview={<FokusPreviewMini />}
        ctaLabel="Öppna Fokus"
        tone="indigo"
        onStart={() => go('/planering?tab=fokus&picked=1')}
      />
    </div>
  );
}
