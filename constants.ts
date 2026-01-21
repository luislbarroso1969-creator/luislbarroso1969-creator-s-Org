
import { Role, Employee } from './types';

export const OBJECTIVES_COUNT = 6;
export const COMPETENCIES_COUNT = 8;
export const OBJ_WEIGHT = 0.60;
export const COMP_WEIGHT = 0.40;

const createEmptyScores = (count: number, prefix: string) => 
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i}`,
    label: `${prefix === 'obj' ? 'Objetivo' : 'Competência'} ${i + 1}`,
    value: 0 as 1 | 3 | 5 | 0
  }));

export const INITIAL_EMPLOYEES: Employee[] = [
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `ts-${i}`,
    name: `Técnico Superior ${i + 1}`,
    role: Role.TECNICO_SUPERIOR,
    objectives: createEmptyScores(OBJECTIVES_COUNT, 'obj'),
    competencies: createEmptyScores(COMPETENCIES_COUNT, 'comp'),
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `at-${i}`,
    name: `Assistente Técnico ${i + 1}`,
    role: Role.ASSISTENTE_TECNICO,
    objectives: createEmptyScores(OBJECTIVES_COUNT, 'obj'),
    competencies: createEmptyScores(COMPETENCIES_COUNT, 'comp'),
  }))
];
