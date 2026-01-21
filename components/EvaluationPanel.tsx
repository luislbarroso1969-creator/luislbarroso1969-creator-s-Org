
import React from 'react';
import { Employee, ScoreItem } from '../types';
import { getAIRecommendation, calculateEvaluation } from '../services/evaluationService';

interface EvaluationPanelProps {
  employee: Employee;
  onUpdate: (updated: Employee) => void;
}

const ScoreButtons: React.FC<{
  current: 1 | 3 | 5 | 0;
  onChange: (val: 1 | 3 | 5) => void;
}> = ({ current, onChange }) => (
  <div className="flex gap-2">
    {[1, 3, 5].map((val) => (
      <button
        key={val}
        onClick={() => onChange(val as 1 | 3 | 5)}
        className={`w-10 h-10 rounded-lg font-bold transition-all border-2 ${
          current === val 
          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
          : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-300'
        }`}
      >
        {val}
      </button>
    ))}
  </div>
);

export const EvaluationPanel: React.FC<EvaluationPanelProps> = ({ employee, onUpdate }) => {
  const [aiAnalysis, setAiAnalysis] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const updateField = (field: keyof Employee, value: string) => {
    onUpdate({ ...employee, [field]: value });
  };

  const updateScore = (type: 'objectives' | 'competencies', id: string, value: 1 | 3 | 5) => {
    const updated = { ...employee };
    const list = [...updated[type]];
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], value };
      onUpdate({ ...updated, [type]: list });
      setAiAnalysis(null);
    }
  };

  const handleAIRequest = async () => {
    setIsAnalyzing(true);
    const result = calculateEvaluation(employee);
    const feedback = await getAIRecommendation(employee, result);
    setAiAnalysis(feedback);
    setIsAnalyzing(false);
  };

  const stats = calculateEvaluation(employee);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col h-full">
      {/* Header with Editable Fields */}
      <div className="bg-slate-900 text-white p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1 w-full space-y-2">
            <div className="relative group">
              <input
                type="text"
                value={employee.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Nome do Colaborador"
                className="bg-transparent text-2xl font-bold w-full border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors py-1"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Nº Func:</span>
                <input
                  type="text"
                  value={employee.employeeNumber || ''}
                  onChange={(e) => updateField('employeeNumber', e.target.value)}
                  placeholder="0000"
                  className="bg-transparent text-sm font-mono text-indigo-300 w-20 focus:outline-none"
                />
              </div>
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{employee.role}</span>
            </div>
          </div>

          <div className="text-right bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 min-w-[140px]">
            <div className="text-4xl font-black text-indigo-400">{stats.weightedTotal.toFixed(2)}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nota SIADAP Final</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Statistics Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 transition-all hover:shadow-inner">
            <span className="text-xs font-bold text-indigo-600 uppercase block mb-1">Média Objetivos (60%)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">{stats.objectivesScore.toFixed(2)}</span>
              <span className="text-xs text-slate-400">/ 5.00</span>
            </div>
          </div>
          <div className="p-4 bg-violet-50 rounded-xl border border-violet-100 transition-all hover:shadow-inner">
            <span className="text-xs font-bold text-violet-600 uppercase block mb-1">Média Competências (40%)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">{stats.competenciesScore.toFixed(2)}</span>
              <span className="text-xs text-slate-400">/ 5.00</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Objectives Section */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 text-lg pb-2 border-b">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black">01</span>
              Objetivos Individuais (6)
            </h3>
            <div className="space-y-3">
              {employee.objectives.map((obj) => (
                <div key={obj.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <span className="text-slate-700 font-semibold text-sm">{obj.label}</span>
                  <ScoreButtons current={obj.value} onChange={(v) => updateScore('objectives', obj.id, v)} />
                </div>
              ))}
            </div>
          </section>

          {/* Competencies Section */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 text-lg pb-2 border-b">
              <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-black">02</span>
              Competências (8)
            </h3>
            <div className="space-y-3">
              {employee.competencies.map((comp) => (
                <div key={comp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <span className="text-slate-700 font-semibold text-sm">{comp.label}</span>
                  <ScoreButtons current={comp.value} onChange={(v) => updateScore('competencies', comp.id, v)} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* AI Insight Section */}
        <section className="pt-6 border-t mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              Apreciação Qualitativa (IA)
            </h3>
            <button 
              onClick={handleAIRequest}
              disabled={isAnalyzing}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 ${
                isAnalyzing ? 'bg-slate-200 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  A gerar parecer...
                </>
              ) : (
                'Gerar Parecer Automático'
              )}
            </button>
          </div>
          
          {aiAnalysis ? (
            <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap font-sans border-t-4 border-indigo-500 shadow-xl">
              {aiAnalysis}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-10 rounded-2xl text-center">
               <div className="text-slate-300 mb-2 flex justify-center">
                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               </div>
               <p className="text-slate-400 text-sm font-medium">Preencha as pontuações e gere um parecer profissional em segundos.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
