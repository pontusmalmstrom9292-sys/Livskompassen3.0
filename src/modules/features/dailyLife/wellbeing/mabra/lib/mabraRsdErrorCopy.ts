import { MB_REF_RSD_04_BANK_ID, MB_REF_RSD_04_TEXT_SV } from '../content/rsdErrorCopy';

/** Deterministisk RSD-säker felcopy — ingen LLM, ingen Kunskap-RAG. */
export function getMabraRsdErrorCopy(): string {
  return MB_REF_RSD_04_TEXT_SV;
}

export function getMabraRsdErrorBankId(): string {
  return MB_REF_RSD_04_BANK_ID;
}
