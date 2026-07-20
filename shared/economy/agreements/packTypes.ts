/** Payroll agreement + tax table pack types (Firestore WORM). */
import type { AgreementYamlShape, CollectiveAgreementId } from './types';

export type TaxBracketRow = { min: number; max: number; col1: number };

export type AgreementPack = {
  id: string;
  agreementId: CollectiveAgreementId;
  config: AgreementYamlShape;
  validFrom: string;
  validTo?: string;
  versionLabel: string;
  checksum: string;
  sourceFileName: string;
  uploadedAt: string;
};

export type TaxTablePack = {
  id: string;
  table: number;
  year: number;
  brackets: TaxBracketRow[];
  source?: string;
  checksum: string;
  sourceFileName: string;
  uploadedAt: string;
};

export type PayrollPackPointers = {
  activeAgreementPackId?: string | null;
  activeTaxTablePackId?: string | null;
  taxYear?: number;
};
