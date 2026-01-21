
import React from 'react';
import { Employee, EvaluationResult } from '../types';
import { calculateEvaluation } from '../services/evaluationService';

interface EmployeeCardProps {
  employee: Employee;
  onClick: (emp: Employee) => void;
  isSelected: boolean;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onClick, isSelected }) => {
  const result = calculateEvaluation(employee);
  
  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-emerald-600 font-bold';
    if (score >= 3.5) return 'text-blue-600 font-semibold';
    if (score >= 2.0) return 'text-amber-600 font-medium';
    return 'text-rose-600';
  };

  const progressColor = (score: number) => {
    if (score >= 4) return 'bg-emerald-500';
    if (score >= 2.5) return 'bg-blue-500';
    return 'bg-rose-500';
  };

  return (
    <div 
      onClick={() => onClick(employee)}
      className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
        isSelected 
        ? 'border-indigo-500 bg-white shadow-lg scale-[1.02]' 
        : 'border-slate-100 bg-slate-50 hover:bg-white'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-slate-800 font-bold text-sm truncate">{employee.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded uppercase tracking-wider">
              {employee.role === 'Técnico Superior' ? 'TS' : 'AT'}
            </span>
            {employee.employeeNumber && (
              <span className="text-[10px] text-slate-400 font-mono">#{employee.employeeNumber}</span>
            )}
          </div>
        </div>
        <div className={`text-lg leading-none ${getScoreColor(result.weightedTotal)}`}>
          {result.weightedTotal.toFixed(2)}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${progressColor(result.weightedTotal)}`} 
            style={{ width: `${result.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
