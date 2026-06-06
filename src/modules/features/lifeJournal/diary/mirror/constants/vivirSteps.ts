export const VIVIR_STEPS = [
  {
    key: 'vem',
    letter: 'V',
    title: 'Vem',
    prompt: 'Vilka personer eller parter är inblandade? (namn/roller, inga värderingar.)',
    placeholder: 'T.ex. medförälder, skola, mig själv…',
  },
  {
    key: 'inflytande',
    letter: 'I',
    title: 'Inflytande',
    prompt: 'Vad kan du faktiskt påverka här — och vad ligger utanför din kontroll?',
    placeholder: 'T.ex. jag bestämmer min reaktion, inte deras…',
  },
  {
    key: 'viktigt',
    letter: 'V',
    title: 'Viktigt',
    prompt: 'Vad är viktigast för dig i den här situationen?',
    placeholder: 'T.ex. barnens trygghet, lugn, tydliga gränser…',
  },
  {
    key: 'intention',
    letter: 'I',
    title: 'Intention',
    prompt: 'Vad säger bevis (sms, mejl, datum) om den andra partens handling — inte deras motiv?',
    placeholder: 'Fakta: skickade sms kl. 18:02 om hämtning…',
  },
  {
    key: 'redo',
    letter: 'R',
    title: 'Redo',
    prompt: 'Är du redo att agera, eller behöver du mer bevis först?',
    placeholder: 'T.ex. behöver spara logg i valvet innan svar…',
  },
] as const;

export const ACT_MIRRORS = [
  (input: string) =>
    input.trim()
      ? `Det du beskriver — "${input.trim().slice(0, 120)}${input.length > 120 ? '…' : ''}" — är en begriplig reaktion.`
      : 'Du behöver inte formulera perfekt. Det du känner räcker som start.',
  () => 'Jag fixar inget här; jag speglar bara.',
  () => 'Nästa steg är att skilja känsla från fakta (VIVIR).',
];

export function mirrorFeeling(input: unknown): string {
  const text = typeof input === 'string' ? input : '';
  return ACT_MIRRORS.map((fn) => fn(text)).join(' ');
}
