/** Node-only sync validate — tests. */
import { sha256HexSync } from '../checksum.node';
import { parseAgreementContent, type ParsedAgreementFile } from './validateAgreement';

export function validateAgreementFileSync(content: string, fileName: string): ParsedAgreementFile {
  const parsed = parseAgreementContent(content, fileName);
  const checksum = sha256HexSync({ config: parsed.config, validFrom: parsed.validFrom, validTo: parsed.validTo });
  return { ...parsed, checksum };
}
