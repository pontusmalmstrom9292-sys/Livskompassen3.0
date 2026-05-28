/** Statiska KBT/ACT-reflektionsfrågor per humör — ingen LLM i wizard. */
export const MOOD_REFLECTION_PROMPTS: Record<string, string> = {
  Lugn: 'Vad gjorde det lite lättare idag?',
  Trött: 'Vad kan du släppa i kväll utan skuld?',
  Spänd: 'Var i kroppen känner du spänningen — utan att lösa problemet?',
  Hoppfull: 'Vilket litet steg vill du ta med dig?',
  Låg: 'Vad är ett minimum som räcker idag?',
};

export const MOOD_ONLY_STUB = (mood: string) => `Humör: ${mood} (snabb notering)`;
