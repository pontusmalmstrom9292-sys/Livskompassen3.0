/**
 * Lager 1 → Lager 2 handoff — deterministisk nyckelordsmatch (ingen LLM).
 * @deprecated Import `shouldShowValvHandoff` from `core/triggers/valvHandoff` for nya anrop.
 */
import { shouldShowValvHandoff } from '@/core/triggers/valvHandoff';

export function shouldShowJournalHandoff(text: string): boolean {
  return shouldShowValvHandoff(text);
}
