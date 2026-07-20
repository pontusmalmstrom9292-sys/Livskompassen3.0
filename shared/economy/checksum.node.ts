/** Node-only sync checksum — tests + Cloud Functions. */
import { createHash } from 'node:crypto';
import { canonicalJson } from './checksum';

export function sha256HexSync(payload: unknown): string {
  return createHash('sha256').update(canonicalJson(payload)).digest('hex');
}

export { PAYROLL_ENGINE_VERSION } from './checksum';
