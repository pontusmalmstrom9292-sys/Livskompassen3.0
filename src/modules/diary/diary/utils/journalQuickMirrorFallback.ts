import type { JournalQuickMirrorResponse } from '../api/journalQuickMirrorService';

/** Klient-fallback när callable ej nås (offline / ej inloggad). */
export function journalQuickMirrorFallback(
  mood: string,
  optionalText?: string,
): JournalQuickMirrorResponse {
  const moodLine = mood ? `Du markerade ${mood.toLowerCase()}.` : 'Du tog ett ögonblick att checka in.';
  const textLine = optionalText?.trim()
    ? ' Det du skrev får finnas här utan att du behöver lösa något.'
    : ' Inget mer krävs av dig just nu.';
  return {
    mirrorLine: `${moodLine}${textLine}`,
    microStep: '',
    suggestMode: 'none',
    toneCheck: 'pass',
  };
}
