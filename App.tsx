
import React, { useState, useMemo } from 'react';
import { Role, Employee } from './types';
import { INITIAL_EMPLOYEES } from './constants';
import { EmployeeCard } from './components/EmployeeCard';
import { EvaluationPanel } from './components/EvaluationPanel';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [selectedId, setSelectedId] = useState<string | null>(INITIAL_EMPLOYEES[0].id);
  const [activeTab, setActiveTab] = useState<Role>(Role.TECNICO_SUPERIOR);

  const currentEmployee = useMemo(() => 
    employees.find(e => e.id === selectedId) || employees[0], 
    [employees, selectedId]
  );

  const filteredEmployees = useMemo(() => 
    employees.filter(e => e.role === activeTab),
    [employees, activeTab]
  );

  const handleUpdate = (updated: Employee) => {
    setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Sidebar List */}
      <aside className="w-full lg:w-96 bg-white border-r border-slate-200 flex flex-col h-screen overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-900">
          <h1 className="text-white text-xl font-black flex items-center gap-2">
            <div className="w-3 h-8 bg-indigo-500 rounded-full"></div>
            SIADAP EVALUATOR
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium tracking-wide">GESTÃO DE DESEMPENHO</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 bg-slate-100 mx-6 mt-6 rounded-xl gap-1">
          {[Role.TECNICO_SUPERIOR, Role.ASSISTENTE_TECNICO].map((role) => (
            <button
              key={role}
              onClick={() => setActiveTab(role)}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${
                activeTab === role 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {role}s
            </button>
          ))}
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex justify-between items-center">
            <span>Colaboradores ({filteredEmployees.length})</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-indigo-600">60/40 Weight</span>
          </div>
          {filteredEmployees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              isSelected={selectedId === emp.id}
              onClick={(e) => setSelectedId(e.id)}
            />
          ))}
        </div>

        {/* Footer Credit */}
        <div className="p-4 bg-slate-50 border-t text-[10px] text-slate-400 text-center font-medium">
          SISTEMA DE AVALIAÇÃO DE DESEMPENHO v1.0.0
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-8 h-screen overflow-hidden">
        <div className="max-w-5xl mx-auto h-full">
          {currentEmployee ? (
            <EvaluationPanel 
              employee={currentEmployee} 
              onUpdate={handleUpdate}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <div className="w-16 h-16 border-4 border-slate-200 border-dashed rounded-full mb-4"></div>
              <p className="font-medium">Selecione um colaborador para iniciar a avaliação</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
