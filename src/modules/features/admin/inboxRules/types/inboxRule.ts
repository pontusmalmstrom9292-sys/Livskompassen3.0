import type { InboxRouting } from '@/features/lifeJournal/evidence/kompis/api/inboxService';

export type InboxRuleMatchType = 'contains' | 'exact';

export interface InboxCategorizationRuleInput {
  label: string;
  matchType: InboxRuleMatchType;
  pattern: string;
  targetTags: string[];
  targetCategory: string;
  targetRouting: InboxRouting | ''; // empty string means do not change routing
  priority: number;
  enabled: boolean;
}

export interface InboxCategorizationRule extends InboxCategorizationRuleInput {
  id: string;
}
