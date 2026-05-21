export function truncateText(text: string, max = 200): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}
