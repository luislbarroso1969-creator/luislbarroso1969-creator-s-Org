
import { Employee, EvaluationResult } from '../types';
import { OBJ_WEIGHT, COMP_WEIGHT } from '../constants';
import { GoogleGenAI } from "@google/genai";

export const calculateEvaluation = (employee: Employee): EvaluationResult => {
  // Filtramos apenas os itens que têm uma nota atribuída (1, 3 ou 5)
  const validObjs = employee.objectives.filter(o => o.value > 0);
  const validComps = employee.competencies.filter(c => c.value > 0);

  // Média dos Objetivos: calculada apenas sobre os preenchidos (independente de serem 3 ou 8)
  const avgObj = validObjs.length > 0 
    ? validObjs.reduce((acc, curr) => acc + curr.value, 0) / validObjs.length 
    : 0;
    
  // Média das Competências: calculada apenas sobre as preenchidas
  const avgComp = validComps.length > 0 
    ? validComps.reduce((acc, curr) => acc + curr.value, 0) / validComps.length 
    : 0;

  // Cálculo Final Ponderado:
  // Se houver apenas objetivos ou apenas competências, a fórmula ajusta o peso para o total disponível
  // para evitar que a nota baixe artificialmente por falta de dados numa das secções.
  let weightedTotal = 0;
  
  if (validObjs.length > 0 && validComps.length > 0) {
    // Caso padrão SIADAP: 60% Objetivos + 40% Competências
    weightedTotal = (avgObj * OBJ_WEIGHT) + (avgComp * COMP_WEIGHT);
  } else if (validObjs.length > 0) {
    // Se só houver objetivos, assume 100% da nota
    weightedTotal = avgObj;
  } else if (validComps.length > 0) {
    // Se só houver competências, assume 100% da nota
    weightedTotal = avgComp;
  }

  const percentage = (weightedTotal / 5) * 100;

  return {
    objectivesScore: avgObj,
    competenciesScore: avgComp,
    weightedTotal,
    percentage
  };
};

export const getAIRecommendation = async (employee: Employee, result: EvaluationResult) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analise o desempenho deste colaborador SIADAP:
    Nome: ${employee.name}
    Cargo: ${employee.role}
    Objetivos Ativos: ${employee.objectives.filter(o => o.value > 0).length} de 8 possíveis.
    Média Objetivos: ${result.objectivesScore.toFixed(2)}
    Média Competências: ${result.competenciesScore.toFixed(2)}
    Nota Final Ponderada: ${result.weightedTotal.toFixed(2)} / 5

    Por favor, forneça um resumo profissional em Português de Portugal com:
    1. Uma breve apreciação qualitativa.
    2. Sugestões de melhoria.
    3. Classificação qualitativa (Inadequado, Adequado, Bom, Muito Bom ou Excelente).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Não foi possível gerar a recomendação da IA.";
  }
};
