import { ExamplePreviewCard } from '@/shared/ui/ExamplePreviewCard';
import {
  BudgetPreviewMini,
  ImpulsePreviewMini,
  MealPrepPreviewMini,
  SavingsPreviewMini,
} from './previews/EconomyModulePreviews';
import { markEkonomiModulValjareSeen } from '../utils/ekonomiModulValjareStorage';

export type EkonomiModuleChoice = 'budget' | 'kost_prepp' | 'smarta_verktyg';

type Props = {
  onSelect: (choice: EkonomiModuleChoice) => void;
};

/** Modulväljare — ett ekonomiverktyg i taget. */
export function EkonomiModulValjare({ onSelect }: Props) {
  const go = (choice: EkonomiModuleChoice) => {
    markEkonomiModulValjareSeen();
    onSelect(choice);
  };

  return (
    <div className="space-y-4 p-4 sm:p-5">
      <p className="text-sm text-text-muted">
        Välj ett spår. Budget, mat och sparande — ett beslut i taget.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <ExamplePreviewCard
          title="Månadens budget"
          lead="Kuvert och fasta kostnader — överblick först."
          preview={<BudgetPreviewMini />}
          ctaLabel="Öppna budget"
          tone="gold"
          onStart={() => go('budget')}
        />
        <ExamplePreviewCard
          title="Veckomeny / matprep"
          lead="Neuro-kost — planera utan stress."
          preview={<MealPrepPreviewMini />}
          ctaLabel="Öppna matprep"
          tone="emerald"
          onStart={() => go('kost_prepp')}
        />
        <ExamplePreviewCard
          title="Impulskö paus"
          lead="24-timmars paus innan köp."
          preview={<ImpulsePreviewMini />}
          ctaLabel="Öppna pausverktyg"
          tone="indigo"
          onStart={() => go('smarta_verktyg')}
        />
        <ExamplePreviewCard
          title="Sparmål"
          lead="Familjesparmål och buffert — inga grafer."
          preview={<SavingsPreviewMini />}
          ctaLabel="Öppna sparmål"
          tone="gold"
          onStart={() => go('smarta_verktyg')}
        />
      </div>
    </div>
  );
}
