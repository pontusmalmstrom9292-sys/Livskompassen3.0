import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '@/core/firebase/init';
import { withVaultSessionPayload } from '@/core/auth/vaultServerSession';

export type InboxRouting = 'kunskap' | 'bevis' | 'barnen' | 'dagbok' | 'review';

export interface InboxClassification {
  routing: InboxRouting;
  tags: string[];
  category: string;
  confidence: number;
  summary: string;
  traumaSensitive: boolean;
  childAlias?: string;
  rationale: string;
}

export interface InboxQueueItem {
  id: string;
  fileName: string;
  proposedRouting: string;
  tags: string[];
  category: string;
  confidence: number;
  summary: string;
  traumaSensitive: boolean;
  rationale: string;
  analysisExcerpt: string;
  childAlias?: string | null;
}

const getInboxQueueCallable = httpsCallable(functions, 'getInboxQueue');
const confirmInboxItemCallable = httpsCallable(functions, 'confirmInboxItem');
const dismissInboxItemCallable = httpsCallable(functions, 'dismissInboxItem');

export async function fetchInboxQueue(): Promise<InboxQueueItem[]> {
  try {
    const result = await getInboxQueueCallable({});
    const data = result.data as { items: InboxQueueItem[] };
    return data.items ?? [];
  } catch (error) {
    const fnError = error as FunctionsError;
    throw new Error(fnError.message || 'Kunde inte hämta inkorgen.');
  }
}

export async function confirmInbox(
  queueId: string,
  routing: 'kunskap' | 'bevis' | 'barnen' | 'dagbok',
  childAlias?: string
): Promise<{ collection: string; docId: string }> {
  try {
    const payload = { queueId, routing, childAlias };
    const result = await confirmInboxItemCallable(
      routing === 'bevis' ? withVaultSessionPayload(payload) : payload,
    );
    return result.data as { collection: string; docId: string };
  } catch (error) {
    const fnError = error as FunctionsError;
    throw new Error(fnError.message || 'Bekräftelse misslyckades.');
  }
}

export async function dismissInbox(queueId: string): Promise<void> {
  try {
    await dismissInboxItemCallable({ queueId });
  } catch (error) {
    const fnError = error as FunctionsError;
    throw new Error(fnError.message || 'Avvisning misslyckades.');
  }
}
