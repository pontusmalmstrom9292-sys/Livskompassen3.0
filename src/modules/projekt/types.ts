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
  order: number;
  planningTaskId?: string;
  createdAt?: string;
};
