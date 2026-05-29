import { saveChildrenLog } from '../../core/firebase/firestore';

export type BarnportenLogKind = 'message' | 'mood' | 'private' | 'quick_widget';

const CATEGORY_BY_KIND: Record<BarnportenLogKind, string> = {
  message: 'barnporten',
  mood: 'barnporten',
  private: 'barnporten_privat',
  quick_widget: 'barnporten_widget',
};

/** Barnporten silo 3 — authorRole child, ingen Valv auto-promote. */
export async function saveBarnportenLog(
  userId: string,
  params: {
    childAlias: string;
    observation: string;
    kind: BarnportenLogKind;
    contentType?: 'text' | 'voice' | 'mood' | 'step';
  },
) {
  const visibility = params.kind === 'private' ? 'private_child' : 'parent';

  return saveChildrenLog(userId, {
    childAlias: params.childAlias,
    observation: params.observation,
    category: CATEGORY_BY_KIND[params.kind],
    action: 'livslogg',
    authorRole: 'child',
    channel: 'barnporten',
    visibility,
    contentType: params.contentType ?? 'text',
  });
}
