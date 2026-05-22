import type { ChildAlias } from '../constants';

export function buildVaultPayloadFromChildLog(params: {
  childAlias: ChildAlias;
  observation: string;
  category: string;
  childrenImpact?: string;
  childrenLogId: string;
  createdAt?: string;
}) {
  const date = (params.createdAt ?? new Date().toISOString()).slice(0, 10);
  const lines = [
    `[Barnen · ${params.childAlias} · ${date}]`,
    `Kategori: ${params.category}`,
    params.observation.trim(),
  ];
  if (params.childrenImpact?.trim()) {
    lines.push(`Påverkan på barn: ${params.childrenImpact.trim()}`);
  }

  const vaultCategory =
    params.category === 'skola' || params.category === 'tredjepart' ? 'skola' : 'barn';

  return {
    action: 'barnen_livslogg',
    category: vaultCategory,
    truth: lines.join('\n'),
    childrenImpact: params.childrenImpact?.trim() || undefined,
    entryType: 'simple' as const,
    sourceRef: `children_logs/${params.childrenLogId}`,
  };
}
