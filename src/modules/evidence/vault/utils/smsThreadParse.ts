/** Heuristisk uppdelning av inklistrad sms-tråd till tvåspalt (Hens / Min). */
export function parseSmsThreadToTwoColumn(raw: string): {
  theirVersion: string;
  myReality: string;
} | null {
  const text = raw.trim();
  if (text.length < 20) return null;

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return null;

  const mineMarkers = /^(jag|mig|min|mitt|mina|me|i)\b/i;
  const theirMarkers = /^(hen|de|du|dom)\b/i;

  const mine: string[] = [];
  const theirs: string[] = [];
  let bucket: 'mine' | 'theirs' | 'unknown' = 'unknown';

  for (const line of lines) {
    const headerMatch = line.match(/^([^:]{1,40}):\s*(.+)$/);
    if (headerMatch) {
      const who = headerMatch[1]!.trim();
      const body = headerMatch[2]!.trim();
      if (mineMarkers.test(who) || /^jag$/i.test(who)) {
        mine.push(body);
        bucket = 'mine';
      } else {
        theirs.push(body);
        bucket = 'theirs';
      }
      continue;
    }

    if (theirMarkers.test(line)) {
      theirs.push(line);
      bucket = 'theirs';
    } else if (mineMarkers.test(line)) {
      mine.push(line);
      bucket = 'mine';
    } else if (bucket === 'theirs') {
      theirs.push(line);
    } else if (bucket === 'mine') {
      mine.push(line);
    } else {
      theirs.push(line);
      bucket = 'theirs';
    }
  }

  if (mine.length === 0 && theirs.length === 0) return null;

  return {
    theirVersion: theirs.join('\n') || text,
    myReality: mine.join('\n') || '',
  };
}
