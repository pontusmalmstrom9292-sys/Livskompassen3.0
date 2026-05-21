export type DossierReportType = 'LEGAL' | 'BBIC';

export type DossierSourceKey = 'reality_vault' | 'children_logs' | 'journal';

export type DossierSources = Record<DossierSourceKey, boolean>;

export type DossierWizardStep = 'period' | 'sources' | 'review' | 'result';

export type DossierDocKind = DossierSourceKey;

export interface DossierCandidateDoc {
  id: string;
  kind: DossierDocKind;
  createdAt: string;
  title: string;
  preview: string;
  category?: string;
}

export interface GenerateDossierInput {
  dateFrom: string;
  dateTo: string;
  sources: DossierSources;
  reportType: DossierReportType;
  includeAiForeword: boolean;
  categoryFilter?: string[];
  includedDocIds: {
    reality_vault: string[];
    children_logs: string[];
    journal: string[];
  };
}

export interface GenerateDossierResult {
  dossierId: string;
  documentHash: string;
  downloadUrl?: string;
  pdfBase64?: string;
  jobId?: string;
  status: 'ready' | 'pending';
}
