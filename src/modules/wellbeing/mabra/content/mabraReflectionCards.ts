/** Frågekort från Mabra-CONTENT-BANK (KEEP) — deterministisk lista, P1. */

export type MabraReflectionCard = {
  bankId: string;
  lens: string;
  text_sv: string;
};

export const MABRA_REFLECTION_CARDS: readonly MabraReflectionCard[] = [
  { bankId: 'C-feel-01', lens: 'kanslor', text_sv: 'Hur känns den här upplevelsen i kroppen — plats eller temperatur?' },
  { bankId: 'C-feel-02', lens: 'kanslor', text_sv: 'Vad behöver känslan inte att du fixar just nu?' },
  { bankId: 'C-feel-03', lens: 'kanslor', text_sv: 'Om känslan fick en färg idag — vilken, ungefär?' },
  { bankId: 'C-identity-01', lens: 'identitet', text_sv: 'Vem är jag när ingen tittar — ett ord räcker.' },
  { bankId: 'C-identity-02', lens: 'identitet', text_sv: 'Vad är jag stolt över som inte handlar om att bevisa något för andra?' },
  { bankId: 'C-identity-03', lens: 'identitet', text_sv: 'En egenskap jag vill ha mer av i vardagen — inte perfekt, bara mer.' },
  { bankId: 'C-goal-01', lens: 'mal', text_sv: 'Ett litet mål denna vecka — inte prestation, max en mening.' },
  { bankId: 'C-goal-02', lens: 'mal', text_sv: 'Vad skulle "tillräckligt bra" se ut idag?' },
  { bankId: 'C-joy-01', lens: 'gladje', text_sv: 'Vad tycker jag är kul, lugnt eller meningsfullt just nu?' },
  { bankId: 'C-joy-02', lens: 'gladje', text_sv: 'En aktivitet utan krav — vad lockar idag?' },
  { bankId: 'C-rsd-01', lens: 'rsd', text_sv: 'Vad triggade känslan av avvisning — din upplevelse, inte deras avsikt.' },
  { bankId: 'C-rsd-02', lens: 'rsd', text_sv: 'Vad behöver kroppen: långsam utandning, vatten, eller paus?' },
  { bankId: 'C-rsd-03', lens: 'rsd', text_sv: 'En mening till dig: "Det här är en reaktion, inte hela jag."' },
  { bankId: 'C-kbt-01', lens: 'kbt', text_sv: 'Vad säger den kritiska rösten — en kort mening?' },
  { bankId: 'C-kbt-02', lens: 'kbt', text_sv: 'Vilken förvrängning kanske det liknar: allt-eller-inget, "borde", läsa tankar?' },
  { bankId: 'C-kbt-03', lens: 'kbt', text_sv: 'En mildare mening en trygg vän kunde säga — du behöver inte tro den fullt.' },
] as const;
