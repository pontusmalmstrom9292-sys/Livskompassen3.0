import type { ChildAlias } from '../constants';

export type ChildProfileSeed = {
  alias: ChildAlias;
  initial: string;
  subtitle: string;
  observations: [string, string, string];
  focus: string;
};

/** F-04.4 — statisk seed, inte LLM vid load. */
export const CHILD_PROFILE_SEEDS: ChildProfileSeed[] = [
  {
    alias: 'Arvid',
    initial: 'A',
    subtitle: 'Trygghet & utveckling',
    observations: [
      'Behöver förutsägbar övergång vid lämning.',
      'Reagerar lugnt när vuxen håller lågaffektiv ton.',
      'Sömn påverkar humör tydligt — notera kvällsrutin.',
    ],
    focus: 'Ett kort samtal vid läggdags — inget mer i kväll.',
  },
  {
    alias: 'Kasper',
    initial: 'K',
    subtitle: 'Lekfullhet & glädje',
    observations: [
      'Återhämtar sig snabbare med rörelse efter skola.',
      'Behöver tydlig start/stopp vid skärmtid.',
      'Positiv återkoppling fungerar bättre än långa förklaringar.',
    ],
    focus: 'Tio minuters lek utan mål — bara närvaro.',
  },
];

export const BARNFOKUS_BANNER = {
  title: 'Barnfokus: Den trygga hamnen',
  lead: 'Parallellt föräldraskap — neutral loggning, Grey Rock utåt. Barnen ska inte bära vuxenkonflikt.',
} as const;
