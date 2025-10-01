export type UUID = string;

export interface Discipline {
  id: UUID;
  name: string;
  board: string; // banca
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  durationMin: number; // carga estimada
  tags: string[];
  description?: string;
  keyTopics?: string[];
  studyTips?: string[];
  contentStructure?: Array<{
    title: string;
    description: string;
    topics: string[];
  }>;
  detailedContent?: {
    modules?: Array<{
      name: string;
      topics: string[];
      estimatedHours: number;
    }>;
    bibliography?: string[];
    jurisprudence?: string[];
  };
  materials?: {
    videos?: number;
    pdfs?: number;
    exercises?: number;
    simulados?: number;
    resumos?: number;
  };
  prerequisites?: string[];
}

export interface StudyBlock {
  id: UUID;
  disciplineId: UUID;
  title: string;
  date: string; // ISO
  start: string; // HH:mm
  end: string;   // HH:mm
  type: 'Estudo' | 'Revisão' | 'Simulado';
  pomodoros?: number;
  completed?: boolean;
  userId?: string; // Para isolamento de dados por usuário
}

export interface PlanSettings {
  weeklyHours: number;
  examDate?: string; // ISO
  disciplines: Array<{ disciplineId: UUID; mastery: 1|2|3|4|5 }>;
  template?: 'Intensivo' | 'Equilíbrio' | 'Revisão';
}

export interface ProgressLog {
  blockId: UUID;
  actualMinutes: number;
  completedAt: string; // ISO
}

export interface KPI {
  weeklyHours: number;
  monthlyHours: number;
  activeDisciplines: number;
  adherencePercentage: number;
  revisionsUpToDate: number;
}

export interface Insight {
  id: UUID;
  type: 'warning' | 'suggestion' | 'achievement';
  title: string;
  description: string;
  action?: string;
  createdAt: string;
}

export interface Template {
  id: string;
  name: 'Intensivo' | 'Equilíbrio' | 'Revisão';
  description: string;
  weeklyHours: number;
  studyToReviewRatio: number;
  simulationFrequency: number; // days
}
