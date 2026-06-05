import { BookOpen, ShieldAlert, Users } from 'lucide-react';
import type { DropdownItem } from '@/core/ui/HubDropdownNav';
import type { InboxRouting } from '@/features/lifeJournal/evidence/kompis/api/inboxService';

/** UI-silo — mappas till G10-routing i backend. */
export type InkastUiSilo = 'dagbok' | 'valv' | 'barnen';

export type InkastManualRouting = Exclude<InboxRouting, 'review'>;

export const INKAST_SILO_ITEMS: DropdownItem<InkastUiSilo>[] = [
  { id: 'dagbok', label: 'Dagbok (Kunskap)', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'valv', label: 'Valv (Bevis)', icon: <ShieldAlert className="h-4 w-4" /> },
  { id: 'barnen', label: 'Barnen (Logg)', icon: <Users className="h-4 w-4" /> },
];

/** Synlig hjälptext under silo-valet i manuellt inkast. */
export const INKAST_SILO_DESCRIPTIONS: Record<InkastUiSilo, string> = {
  dagbok:
    'Din personliga verklighet. För reflektioner, tankar och daglig logistik.',
  valv: 'Juridisk säkerhet. För SMS, mejl, dokument och allt som ska bevisas.',
  barnen: 'Barnens trygghet. För observationer om mående och hämtning/lämning.',
};

export type InkastAnalysisTagId = 'gaslighting' | 'motsagelse' | 'beten' | 'fakta';

export type InkastAnalysisTag = {
  id: InkastAnalysisTagId;
  label: string;
  description: string;
};

export const INKAST_ANALYSIS_TAGS: InkastAnalysisTag[] = [
  {
    id: 'gaslighting',
    label: '#gaslighting',
    description: 'När verkligheten förvrängs.',
  },
  {
    id: 'motsagelse',
    label: '#motsägelse',
    description: 'När information ändras eller inte går ihop.',
  },
  {
    id: 'beten',
    label: '#beten',
    description: 'Provokationer skrivna för att trigga JADE (försvar/förklaring).',
  },
  {
    id: 'fakta',
    label: '#fakta',
    description: 'Neutral logistik (tid, plats, datum).',
  },
];

export const INKAST_ANALYSIS_TAG_ITEMS: DropdownItem<InkastAnalysisTagId>[] =
  INKAST_ANALYSIS_TAGS.map((tag) => ({
    id: tag.id,
    label: tag.label,
  }));

export function resolveInkastAnalysisTagId(category: string): InkastAnalysisTagId {
  const normalized = category.trim().toLowerCase().replace(/^#/, '');
  const match = INKAST_ANALYSIS_TAGS.find((tag) => tag.id === normalized);
  return match?.id ?? 'fakta';
}

export function inkastAnalysisTagById(id: InkastAnalysisTagId): InkastAnalysisTag {
  return INKAST_ANALYSIS_TAGS.find((tag) => tag.id === id) ?? INKAST_ANALYSIS_TAGS[3]!;
}

export function uiSiloToRouting(silo: InkastUiSilo): InkastManualRouting {
  if (silo === 'valv') return 'bevis';
  if (silo === 'barnen') return 'barnen';
  return 'kunskap';
}

export function routingToUiSilo(routing: InboxRouting): InkastUiSilo {
  if (routing === 'bevis') return 'valv';
  if (routing === 'barnen') return 'barnen';
  return 'dagbok';
}

export const INKAST_SILO_LABELS: Record<InkastUiSilo, string> = {
  dagbok: 'Dagbok (Kunskap)',
  valv: 'Valv (Bevis)',
  barnen: 'Barnen (Logg)',
};

export type InkastManualChoice = {
  silo: InkastUiSilo;
  category: string;
  comment: string;
  childAlias?: string;
  optInTrauma?: boolean;
};

export function manualChoiceToSubmitFields(choice: InkastManualChoice) {
  return {
    manualRouting: uiSiloToRouting(choice.silo),
    manualCategory: choice.category.trim() || undefined,
    manualComment: choice.comment.trim() || undefined,
    manualChildAlias: choice.childAlias?.trim() || undefined,
    optInTrauma: choice.optInTrauma ?? true,
  };
}
