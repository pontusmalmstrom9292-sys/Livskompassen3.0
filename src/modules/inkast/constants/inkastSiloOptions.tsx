import { BookOpen, ShieldAlert, Users } from 'lucide-react';
import type { DropdownItem } from '@/core/ui/HubDropdownNav';
import type { InboxRouting } from '@/features/lifeJournal/evidence/kompis/api/inboxService';

/** UI-silo — mappas till G10-routing i backend. */
export type InkastUiSilo = 'dagbok' | 'valv' | 'barnen';

export type InkastManualRouting = Exclude<InboxRouting, 'review'>;

export const INKAST_SILO_ITEMS: DropdownItem<InkastUiSilo>[] = [
  { id: 'dagbok', label: 'Dagbok', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'valv', label: 'Arkiv', icon: <ShieldAlert className="h-4 w-4" /> },
  { id: 'barnen', label: 'Barnen', icon: <Users className="h-4 w-4" /> },
];

/** Synlig hjälptext under silo-valet i manuellt inkast. */
export const INKAST_SILO_DESCRIPTIONS: Record<InkastUiSilo, string> = {
  dagbok:
    'Din personliga verklighet. För reflektioner, tankar och daglig logistik.',
  valv: 'Juridisk säkerhet. För SMS, mejl, dokument och allt som ska bevisas.',
  barnen: 'Barnens trygghet. För observationer om mående och hämtning/lämning.',
};

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
  tags: string[];
  comment: string;
  childAlias?: string;
  optInTrauma?: boolean;
};

export function manualChoiceToSubmitFields(choice: InkastManualChoice) {
  const tags = choice.tags.map((t) => t.trim()).filter(Boolean).slice(0, 12);
  return {
    manualRouting: uiSiloToRouting(choice.silo),
    manualTags: tags.length ? tags : undefined,
    manualCategory: tags[0] || undefined,
    manualComment: choice.comment.trim() || undefined,
    manualChildAlias: choice.childAlias?.trim() || undefined,
    optInTrauma: choice.optInTrauma ?? true,
  };
}
