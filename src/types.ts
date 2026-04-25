export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}

export enum EisenhowerQuadrant {
  URGENT_IMPORTANT = "URGENT_IMPORTANT",
  NOT_URGENT_IMPORTANT = "NOT_URGENT_IMPORTANT",
  URGENT_NOT_IMPORTANT = "URGENT_NOT_IMPORTANT",
  NOT_URGENT_NOT_IMPORTANT = "NOT_URGENT_NOT_IMPORTANT"
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  time?: string;
  priority: TaskPriority;
  quadrant: EisenhowerQuadrant;
  completed: boolean;
  createdAt: number;
}

export interface DailyBriefing {
  morningBriefing: string;
  eveningReview: string;
  efficiencyTip: string;
}

export interface AtlasState {
  tasks: Task[];
  briefing: DailyBriefing | null;
  lastUpdate: number;
}
