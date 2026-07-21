import { ExamplePreviewCard } from '@/shared/ui/ExamplePreviewCard';
import {
  BudgetPreviewMini,
  ImpulsePreviewMini,
  LoggPreviewMini,
  MealPrepPreviewMini,
  SavingsPreviewMini,
} from './previews/EconomyModulePreviews';
import { markEkonomiModulValjareSeen } from '../utils/ekonomiModulValjareStorage';
import { EKONOMI_HUB_LEAD } from '../ekonomiCopy';

export type EkonomiModuleChoice = 'budget' | 'kost_prepp' | 'impuls' | 'spar' | 'logg';

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
    <div className="space-y-4 p-4 sm:p-5" role="region" aria-label="Välj ekonomiverktyg">
      <p className="text-sm text-text-muted">{EKONOMI_HUB_LEAD}</p>
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
          onStart={() => go('impuls')}
        />
        <ExamplePreviewCard
          title="Sparmål"
          lead="Familjesparmål och buffert — inga grafer."
          preview={<SavingsPreviewMini />}
          ctaLabel="Öppna sparmål"
          tone="gold"
          onStart={() => go('spar')}
        />
        <ExamplePreviewCard
          title="Logg & räkningar"
          lead="Utgifter och fasta räkningar — vardagsekonomi."
          preview={<LoggPreviewMini />}
          ctaLabel="Öppna logg"
          tone="gold"
          onStart={() => go('logg')}
        />
      </div>
    </div>
  );
}
