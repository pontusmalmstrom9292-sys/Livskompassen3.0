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
    case 'mabra_inkast':
      return 'Mabra inkast — tematisk reflektion. Granska och godkänn innan spar (HITL).';
    case 'familjen':
    case 'barnfokus':
    case 'barnen':
      return 'Familjen inkast — barnobservation. Granska innan spar i barnloggar (HITL).';
    default:
      return null;
  }
}
