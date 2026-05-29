export type PlanningTaskStatus = 'todo' | 'waiting' | 'done';

export type PlanningTaskSource = 'email' | 'school' | 'calendar' | 'manual' | 'authority';

export type PlanningTask = {
  id: string;
  title: string;
  summary?: string;
  status: PlanningTaskStatus;
  dueAt?: string;
  source: PlanningTaskSource;
  sourceRef?: string;
  microStep?: string;
  projectId?: string;
  createdAt?: string;
};

/** hub = verktygsväljare (default). inkop = snabb punktlista. */
export type PlaneringTab = 'hub' | 'handling' | 'fokus' | 'framsteg' | 'inkorg' | 'inkop';

export type QuickListItem = {
  id: string;
  text: string;
  done: boolean;
};

export type QuickList = {
  id: string;
  title: string;
  items: QuickListItem[];
  updatedAt: string;
};
