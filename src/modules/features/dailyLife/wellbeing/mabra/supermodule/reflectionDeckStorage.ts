const STORAGE_KEY = 'livskompassen_mabra_reflection_answers_v1';

export function readReflectionDeckAnswers(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    const record = parsed as Record<string, unknown>;
    const answers: Record<string, string> = {};
    for (const [key, value] of Object.entries(record)) {
      if (typeof value === 'string') answers[key] = value;
    }
    return answers;
  } catch {
    return {};
  }
}

export function writeReflectionDeckAnswers(answers: Record<string, string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    /* quota */
  }
}

export function clearReflectionDeckAnswer(bankId: string): void {
  const answers = readReflectionDeckAnswers();
  if (!(bankId in answers)) return;
  const next = { ...answers };
  delete next[bankId];
  writeReflectionDeckAnswers(next);
}
