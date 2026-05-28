/** Enkla startfrågor per känsla — ingen LLM. */
export const MOOD_REFLECTION_PROMPTS: Record<string, string> = {
  Lugn: 'Vad gjorde dagen lite lättare?',
  Glad: 'Vad vill du minnas från idag?',
  Trött: 'Vad kan du släppa i kväll?',
  Spänd: 'Var sitter det i kroppen — utan att fixa allt?',
  Oro: 'Vad oroar dig mest just nu, i en kort rad?',
  Arg: 'Vad hände — bara fakta, inga försvar?',
  Låg: 'Vad är det minsta som räcker idag?',
  Tom: 'Är tomhet okej just nu? Skriv ett ord om du vill.',
  Hoppfull: 'Ett litet steg du vill ta med dig?',
  Stolt: 'Vad gjorde du som faktiskt räknas?',
  Tacksam: 'En sak du är tacksam för idag?',
  Överväldigad: 'Vad kan vänta till imorgon?',
};

export const QUICK_WRITE_PROMPTS: string[] = [
  'Idag var…',
  'Jag behöver…',
  'Det som hjälpte var…',
  'Imorgon vill jag…',
  'Jag släpper…',
  'En sak jag vill säga till mig själv:',
];

export const RANDOM_PROMPT_POOL: string[] = [
  ...Object.values(MOOD_REFLECTION_PROMPTS),
  ...QUICK_WRITE_PROMPTS,
  'Tre ord om dagen:',
  'Om någon läste detta — vad skulle de förstå?',
];

export function pickRandomPrompt(): string {
  return RANDOM_PROMPT_POOL[Math.floor(Math.random() * RANDOM_PROMPT_POOL.length)] ?? 'En rad räcker.';
}

export const MOOD_ONLY_STUB = (mood: string) => `Känsla: ${mood} (snabb notering)`;
