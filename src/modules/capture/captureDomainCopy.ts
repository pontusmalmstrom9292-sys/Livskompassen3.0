/** Domän-ledtrådar per capture-yta — deterministisk copy, ingen LLM. */

export function inkastSourceModuleHint(sourceModule: string): string | null {
  switch (sourceModule) {
    case 'hem_smart_inkast':
      return 'Kvällsinkast — innehållet avgör silo. Osäkert hamnar i granskningskö.';
    case 'valv_samla':
      return 'Valv Samla — kommunikation och bevis prioriteras.';
    case 'planering_inkorg':
      return 'Planering — hamnar i granskningskö tills du bekräftar.';
    case 'hem_capture':
      return 'Smart Inkast — AI föreslår arkiv. Du godkänner alltid innan spar.';
    default:
      return null;
  }
}
