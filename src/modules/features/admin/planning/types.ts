export type PlanningTaskStatus = 'todo' | 'waiting' | 'done';

export type PlanningTaskSource = 'email' | 'school' | 'calendar' | 'manual' | 'authority' | 'voice_to_vault';

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

/** start = modulväljare. hub = avancerad verktygsväljare. inkop = Inköpslista (ej Inkorg). */
export type PlaneringTab =
  | 'start'
  | 'hub'
  | 'handling'
  | 'fokus'
  | 'framsteg'
  | 'inkorg'
  | 'regler'
  | 'inkop';

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
