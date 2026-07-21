/** Frozen whitelist — måste matcha firestore.rules `project_blocks.type`. */
export const PROJECT_BLOCK_TYPES = ['list', 'note', 'image', 'video', 'task'] as const;

export type ProjectBlockTypeConst = (typeof PROJECT_BLOCK_TYPES)[number];

export function isProjectBlockType(value: string): value is ProjectBlockTypeConst {
  return (PROJECT_BLOCK_TYPES as readonly string[]).includes(value);
}
