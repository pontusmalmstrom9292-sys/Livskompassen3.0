export type KbtTransformResult = {
  distortion: string;
  clinicalFact: string;
  compassionateRewrite: string;
};

export function parseKbtTransformJson(raw: string): KbtTransformResult {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  const candidate = jsonMatch ? jsonMatch[0] : trimmed;
  const parsed = JSON.parse(candidate) as Partial<KbtTransformResult>;
  const distortion = parsed.distortion?.trim();
  const clinicalFact = parsed.clinicalFact?.trim();
  const compassionateRewrite = parsed.compassionateRewrite?.trim();
  if (!distortion || !clinicalFact || !compassionateRewrite) {
    throw new Error('Ofullständigt KBT-svar.');
  }
  return { distortion, clinicalFact, compassionateRewrite };
}

export function kbtTransformFallback(thought: string): KbtTransformResult {
  return {
    distortion: 'Automatisk negativ tolkning (kategorisering ej tillgänglig offline).',
    clinicalFact: `Du noterade: "${thought.slice(0, 120)}". Det är en tanke — inte bevis.`,
    compassionateRewrite:
      'Jag kan ha en tung tanke utan att den är sant. Jag tar ett andetag och väljer ett litet nästa steg.',
  };
}
