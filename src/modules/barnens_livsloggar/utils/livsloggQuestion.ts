import type { LivsloggCategory } from '../constants';
import {
  LIVSLOGG_QUESTION_POOL,
  type QuestionPoolEntry,
} from '../constants/livsloggQuestionPool';

export function pickRandomQuestion(category: LivsloggCategory): QuestionPoolEntry {
  const pool = LIVSLOGG_QUESTION_POOL[category] ?? LIVSLOGG_QUESTION_POOL.lek ?? [];
  if (pool.length === 0) {
    return {
      label: 'Dagens fråga',
      text: 'Vad vill du minnas från idag?',
    };
  }
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function formatQuestionLogObservation(question: QuestionPoolEntry, answer: string): string {
  const trimmed = answer.trim();
  return `[${question.label}] ${question.text}\nSvar: ${trimmed}`;
}

/** Kort rad för profilkort (F-B12.4). */
export function excerptForProfile(observation: string, maxLen = 120): string {
  const svarIdx = observation.indexOf('Svar:');
  const line = svarIdx >= 0 ? observation.slice(svarIdx + 5).trim() : observation.trim();
  const oneLine = line.replace(/\s+/g, ' ');
  if (oneLine.length <= maxLen) return oneLine;
  return `${oneLine.slice(0, maxLen - 1)}…`;
}
