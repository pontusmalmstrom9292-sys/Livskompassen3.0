import { checkAiCostCaps } from './costCapGuard';

/** Returnerar false om AI-budget (dag/månad) är förbrukad. */
export async function isAiBudgetAllowed(userId: string): Promise<boolean> {
  const cap = await checkAiCostCaps(userId);
  return cap.allowed;
}

/** Kastar om AI-budget är förbrukad — använd före dyra batch/callable-anrop. */
export async function ensureAiBudgetAllowed(userId: string): Promise<void> {
  const cap = await checkAiCostCaps(userId);
  if (!cap.allowed) {
    throw new Error(`AI budget exceeded (${cap.reason ?? 'cap'})`);
  }
}
