export type ProjectStatus = 'active' | 'paused' | 'archived';

export type ProjectBlockType = 'list' | 'note' | 'image' | 'task';

export type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  primaryBlockType?: ProjectBlockType;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectBlock = {
  id: string;
  projectId: string;
  type: ProjectBlockType;
  title: string;
  content?: string;
  /** Firebase Storage path (image blocks). */
  storagePath?: string;
  /** Public download URL after upload. */
  imageUrl?: string;
  order: number;
  planningTaskId?: string;
  createdAt?: string;
};

export type ProjectAutomationAction = 'create_task' | 'add_note';

export type ProjectAutomationRule = {
  id: string;
  label: string;
  matchPattern: string;
  action: ProjectAutomationAction;
  targetProjectId?: string;
  enabled: boolean;
};
