
export enum Role {
  TECNICO_SUPERIOR = 'Técnico Superior',
  ASSISTENTE_TECNICO = 'Assistente Técnico'
}

export interface ScoreItem {
  id: string;
  label: string;
  value: 1 | 3 | 5 | 0;
}

export interface Employee {
  id: string;
  name: string;
  employeeNumber?: string;
  role: Role;
  objectives: ScoreItem[];
  competencies: ScoreItem[];
  lastEvaluationDate?: string;
}

export interface EvaluationResult {
  objectivesScore: number; // Raw average of objectives
  competenciesScore: number; // Raw average of competencies
  weightedTotal: number; // The final 1-5 score
  percentage: number; // 0-100% representation
}
