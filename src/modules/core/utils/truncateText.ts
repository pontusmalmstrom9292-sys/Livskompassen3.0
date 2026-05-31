export function truncateText(text: string, max = 200): string {
  const s = text == null ? '' : typeof text === 'string' ? text : String(text);
  if (s.length <= max) return s;
  return `${s.slice(0, max).trimEnd()}…`;
}
