/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
/**
 * Återfallsberedskap — skamfri copy (AVE-skydd). Produkt + klinisk praxis (Marlatt).
 */

export const LAPSE_VS_RELAPSE = {
  title: 'Lapse och relapse — utan skam',
  lapse:
    'En lapse är ett enstaka steg ur spår — inte hela resan. Du kan stanna upp och välja nästa timme.',
  relapse:
    'En relapse är när det gamla mönstret tar över igen. Då är det dags att aktivera din plan och, vid behov, vårdstöd.',
  ave:
    'Abstinence Violation Effect: skam efter ett slip kan leda till mer bruk. Bryt skammen — du är inte “förstörd”.',
} as const;

export const COMEBACK_COPY = {
  title: 'Du är tillbaka',
  lead: 'Ett steg ur spår är inte hela resan. Nästa 24 timmar räknas.',
  ctaPlan: 'Öppna min plan',
  ctaSos: 'SOS — sug nu',
  ctaDone: 'Jag tar det härifrån',
} as const;

export const ESCALATION_COPY = {
  title: 'Stöd finns',
  lead: 'Du har öppnat ankaret flera gånger den här veckan. Många har nytta av att prata med någon.',
  hint: 'Appen ersätter inte vård.',
} as const;

export const PLAN_COPY = {
  coreWhyLabel: 'Varför idag (ett kort svar)',
  coreWhyHint: 'Inte “för alltid” — vad vill du stå för just nu?',
  ifThenTitle: 'If–Then (max 3)',
  ifPlaceholder: 'Om …',
  thenPlaceholder: '… då gör jag',
  pptTitle: 'People · Places · Things',
  peopleHint: 'Personer kopplade till risk',
  placesHint: 'Platser',
  thingsHint: 'Saker / appar / tider',
  supportLabel: 'Trygg kontakt (hint)',
  supportHint: 'Namn eller “mamma” — appen skickar inget automatiskt.',
  valuesTitle: 'Värdeord (max 5)',
  consequenceTitle: 'Mina konsekvenskort',
  save: 'Spara plan',
  saved: 'Sparat.',
} as const;
