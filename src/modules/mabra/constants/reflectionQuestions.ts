/** Statisk reflektionspool — ingen LLM, ingen auto-WORM (F-V10.1, F-V10.3). */
export const MABRA_REFLECTION_QUESTIONS: readonly string[] = [
  'Vilken liten sak gjorde dig stolt över dig själv idag, oavsett hur obetydlig den verkar?',
  'Vad är ett minimum som räcker idag — utan att prestera mer?',
  'Vilket ögonblick kändes lite lättare, även om dagen var tung?',
  'Vad i kroppen behöver vila just nu — utan att du behöver fixa något?',
  'Vem eller vad gav dig en känsla av trygghet nyligen, även kort?',
  'Vad skulle du säga till en vän i samma situation — en mild mening?',
  'Vilket steg tog du hand om dig själv på, som du nästan glömde bort?',
  'Vad kan du släppa i kväll utan skuld?',
  'Vad är du tacksam för idag — även om det är litet?',
  'Vilket värde vill du leva efter just nu, inte imorgon?',
  'Var märker du spänning — och vad behöver kroppen istället för analys?',
  'Vad behöver du höra från dig själv, inte från någon annan?',
  'Vilket litet val visade omsorg om dig idag?',
  'Vad vill du ta med dig in i kvällen — en rad räcker?',
  'Vad är sant om dig som person, oberoende av dagens humör?',
  'Vilket behov har varit högt — och hur kan du möta det mjukt?',
  'Vad gjorde att du andades lite lättare, om bara en stund?',
  'Vilken tanke vill du parkera till imorgon — den får vänta?',
  'Vad betyder "bra nog" för dig just idag?',
  'Vilket ögonblick var du närvarande — utan att prestera?',
] as const;

export function dailyQuestionIndex(date: Date, poolSize: number): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return dayOfYear % poolSize;
}

export function pickAnotherQuestionIndex(current: number, poolSize: number): number {
  if (poolSize <= 1) return 0;
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * poolSize);
  }
  return next;
}
