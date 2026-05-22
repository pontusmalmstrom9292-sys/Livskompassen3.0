import type { KampsparEntryRow } from '../types/firestore';

const QUIZ_PROMPT =
  '[Livskompassen lärande] Baserat på MINNE: ställ exakt EN kort fråga (max 15 ord) för att lära dig något om användaren som INTE redan står tydligt i minnet. Endast frågan — ingen inledning.';

const GAP_PROMPT =
  '[Livskompassen luckor] Sök i MINNE efter personer eller begrepp som nämns utan tydlig relation eller definition. Ställ exakt EN fråga om det viktigaste gapet (t.ex. "Vem är X?"). Endast frågan.';

const NAME_PATTERN = /\b[A-ZÅÄÖ][a-zåäö]+(?:\s+[A-ZÅÄÖ][a-zåäö]+)+\b/gu;

export function learningPrompt(mode: 'quiz' | 'gap'): string {
  return mode === 'quiz' ? QUIZ_PROMPT : GAP_PROMPT;
}

/** Plockar ut frågetext från valvsvar. */
export function extractQuestion(raw: string): string {
  const trimmed = raw.trim().replace(/^["'«]|["'»]$/g, '');
  const firstLine = trimmed.split('\n').find((l) => l.trim().length > 0) ?? trimmed;
  const sentence = firstLine.split(/[.!?]/)[0]?.trim() ?? firstLine;
  return sentence.endsWith('?') ? sentence : `${sentence.replace(/\.$/, '')}?`;
}

/** Client-fallback: hitta namn som nämns ofta utan relationspost. */
export function detectKnowledgeGap(entries: KampsparEntryRow[]): {
  subject: string;
  question: string;
  reason: string;
} | null {
  const mentionCounts = new Map<string, number>();
  const definedSubjects = new Set<string>();

  for (const entry of entries) {
    if (
      entry.category === 'profil' ||
      entry.category === 'relation' ||
      entry.tags?.some((t) => t === 'relation' || t === 'profil')
    ) {
      definedSubjects.add(entry.title.toLowerCase());
      const nameMatch = entry.title.match(NAME_PATTERN);
      if (nameMatch) definedSubjects.add(nameMatch[0].toLowerCase());
    }

    const matches = `${entry.title} ${entry.content}`.match(NAME_PATTERN) ?? [];
    for (const name of matches) {
      mentionCounts.set(name, (mentionCounts.get(name) ?? 0) + 1);
    }
  }

  for (const [name, count] of mentionCounts) {
    const key = name.toLowerCase();
    if (count < 2) continue;
    if (definedSubjects.has(key)) continue;
    const hasRelation = entries.some(
      (e) =>
        e.content.toLowerCase().includes(key.split(' ')[0] ?? '') &&
        /\b(mamma|pappa|farmor|morfar|ex|syskon|partner|kollega|vän)\b/i.test(e.content),
    );
    if (hasRelation) continue;
    return {
      subject: name,
      question: `Vem är ${name}?`,
      reason: `Namnet "${name}" förekommer ${count} gånger utan tydlig relation i Minne.`,
    };
  }

  return null;
}
