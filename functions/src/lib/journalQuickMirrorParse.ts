export type JournalQuickMirrorResult = {
  mirrorLine: string;
  microStep: string;
  suggestMode: 'snabb' | 'reflektera' | 'none';
  toneCheck: 'pass' | 'too_fixing' | 'too_long';
};

export function parseJournalQuickMirrorJson(raw: string): JournalQuickMirrorResult {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  const candidate = jsonMatch ? jsonMatch[0] : trimmed;
  const parsed = JSON.parse(candidate) as Partial<JournalQuickMirrorResult>;

  const mirrorLine = parsed.mirrorLine?.trim();
  if (!mirrorLine) throw new Error('Saknar mirrorLine.');

  const suggestMode = parsed.suggestMode;
  if (suggestMode !== 'snabb' && suggestMode !== 'reflektera' && suggestMode !== 'none') {
    throw new Error('Ogiltig suggestMode.');
  }

  const toneCheck = parsed.toneCheck;
  if (toneCheck !== 'pass' && toneCheck !== 'too_fixing' && toneCheck !== 'too_long') {
    throw new Error('Ogiltig toneCheck.');
  }

  return {
    mirrorLine,
    microStep: parsed.microStep?.trim() ?? '',
    suggestMode,
    toneCheck,
  };
}

export function journalQuickMirrorFallback(mood: string, quickText?: string): JournalQuickMirrorResult {
  const moodLine = mood ? `Du markerade ${mood.toLowerCase()}.` : 'Du tog ett ögonblick att checka in.';
  const textLine = quickText?.trim()
    ? ` Det du skrev får finnas här utan att du behöver lösa något.`
    : ' Inget mer krävs av dig just nu.';
  return {
    mirrorLine: `${moodLine}${textLine}`,
    microStep: '',
    suggestMode: 'none',
    toneCheck: 'pass',
  };
}
