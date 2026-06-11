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
  { bankId: 'MB-REF-ADHD-01', lens: 'tidsblindhet', text_sv: 'Vilken överlämning eller deadline är lättast att missa — och vilket en externt ankare skulle hjälpa?' },
  { bankId: 'MB-REF-ADHD-02', lens: 'rsd', text_sv: 'När kroppen reagerar snabbt på kritik — vad är ett sakligt faktum om din reaktion, utan att döma dig?' },
  { bankId: 'MB-REF-ADHD-03', lens: 'mikrosteg', text_sv: 'Ett steg under fem minuter som skulle avlasta dig idag — bara ett.' },
  { bankId: 'MB-REF-ADHD-04', lens: 'somn', text_sv: 'Hur sov du senaste nätterna — information, inte betyg?' },
  { bankId: 'MB-REF-GAD-01', lens: 'oro', text_sv: 'Vad är oro just nu — och vad är ett faktum du kan verifiera?' },
  { bankId: 'MB-REF-GAD-02', lens: 'kropp', text_sv: 'Var sitter spänningen i kroppen — namnge platsen utan att fixa.' },
  { bankId: 'MB-REF-GAD-03', lens: 'plan', text_sv: 'Om oron fick bli en konkret planrad — vad skulle den säga?' },
  { bankId: 'MB-REF-GAD-04', lens: 'hypervigilans', text_sv: 'Vad skannar du efter just nu — hot eller bara osäkerhet?' },
  { bankId: 'MB-REF-GAD-05', lens: 'paus', text_sv: 'Vad skulle en 60-sekunders paus ge dig — inte lösa, bara pausa?' },
  { bankId: 'MB-REF-GAD-06', lens: 'somn', text_sv: 'En sak som hjälpte eller störde sömnen — neutral observation.' },
  { bankId: 'C-feel-04', lens: 'kanslor', text_sv: 'Vilken känsla är störst — och vad behöver den inte att du gör?' },
  { bankId: 'C-feel-05', lens: 'kanslor', text_sv: 'En kroppsdel som känns lugnare än resten — peka eller namnge.' },
  { bankId: 'MB-REF-ACT-01', lens: 'act', text_sv: 'Ett värde som är viktigt idag — ett ord.' },
  { bankId: 'MB-REF-ACT-02', lens: 'act', text_sv: 'En handling under 5 min som stämmer med det värdet.' },
  { bankId: 'MB-REF-ACT-03', lens: 'act', text_sv: 'Vad kan du acceptera att känna just nu utan att agera på det?' },
  { bankId: 'MB-REF-JOY-01', lens: 'teman', text_sv: 'Ett intresse eller tema som känns mitt — inte någons förväntan. Ett ord räcker.' },
  { bankId: 'MB-REF-JOY-02', lens: 'gladje', text_sv: 'Sim, klättra, vila, eller något helt annat — vad känns lätt att tänka på idag, utan att boka?' },
  { bankId: 'MB-REF-JOY-03', lens: 'gladje', text_sv: 'När gjorde jag senast något bara för att det var skönt — inte för att bli bra på det?' },
  { bankId: 'MB-REF-JOY-04', lens: 'teman', text_sv: 'Ett lugn som inte behöver att någon annan ser det — var eller hur, ungefär?' },
  { bankId: 'MB-REF-JOY-05', lens: 'teman', text_sv: 'Vilken hobby eller aktivitet har jag pausat — och vad skulle minsta steget tillbaka vara?' },
  { bankId: 'MB-REF-JOY-06', lens: 'gladje', text_sv: 'Vad är meningsfullt för mig just nu — inte vad jag borde tycka om?' },
] as const;
