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

export type PlaneringTab = 'handling' | 'fokus' | 'inkorg';
