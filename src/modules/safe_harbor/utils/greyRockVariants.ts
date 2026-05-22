/** Tre deterministiska Grey Rock-varianter från ett backend-svar (ingen extra LLM). */
export type GreyRockVariant = {
  id: 'standard' | 'strict' | 'minimal';
  label: string;
  text: string;
};

export function deriveGreyRockVariants(reply: string): GreyRockVariant[] {
  const trimmed = reply.trim();
  if (!trimmed) {
    return [
      { id: 'standard', label: 'Standard', text: 'Noterat. Jag återkommer vid behov av logistik.' },
      { id: 'strict', label: 'Strikt', text: 'Noterat.' },
      { id: 'minimal', label: 'Minimal', text: 'Ok.' },
    ];
  }

  const sentences = trimmed.split(/(?<=[.!?])\s+/).filter((s) => s.length > 0);
  const first = sentences[0] ?? trimmed;

  const standard = trimmed;
  const strict =
    sentences.length > 1
      ? `${first.trim()} Jag återkommer vid behov av logistik.`
      : trimmed.length > 120
        ? `${trimmed.slice(0, 117).trim()}…`
        : trimmed;

  const minimal =
    first.length <= 72
      ? first.replace(/\s+$/, '')
      : `${first.slice(0, 69).trim()}…`;

  const variants: GreyRockVariant[] = [
    { id: 'standard', label: 'Standard (BIFF)', text: standard },
    { id: 'strict', label: 'Strikt', text: strict },
    { id: 'minimal', label: 'Minimal', text: minimal },
  ];

  return variants;
}
