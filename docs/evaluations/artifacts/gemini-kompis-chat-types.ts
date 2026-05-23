/**
 * Inferred from mock KompisChat — inkorg only (user paste 2026-05-23).
 * Runtime: map user/assistant turns → `valvChatQuery` session in `useValvChatSession`.
 */

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: string;
}
