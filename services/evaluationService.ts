
import { Employee, EvaluationResult } from '../types';
import { OBJ_WEIGHT, COMP_WEIGHT } from '../constants';
import { GoogleGenAI } from "@google/genai";

export const calculateEvaluation = (employee: Employee): EvaluationResult => {
  // Filtramos apenas os itens que têm uma nota atribuída (1, 3 ou 5)
  // O valor 0 é tratado como "Não Aplicável" ou "Não Preenchido"
  const validObjs = employee.objectives.filter(o => o.value > 0);
  const validComps = employee.competencies.filter(c => c.value > 0);

  // Média dos Objetivos: soma das notas / número de objetivos preenchidos
  const avgObj = validObjs.length > 0 
    ? validObjs.reduce((acc, curr) => acc + curr.value, 0) / validObjs.length 
    : 0;
    
  // Média das Competências: soma das notas / número de competências preenchidas
  const avgComp = validComps.length > 0 
    ? validComps.reduce((acc, curr) => acc + curr.value, 0) / validComps.length 
    : 0;

  // Resultado Final Ponderado (60/40)
  // Se uma das categorias estiver totalmente vazia, a fórmula ajusta-se proporcionalmente
  // mas aqui seguimos a regra estrita do SIADAP: 0.6*MédiaObj + 0.4*MédiaComp
  const weightedTotal = (avgObj * OBJ_WEIGHT) + (avgComp * COMP_WEIGHT);
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
    Nº Objetivos Avaliados: ${employee.objectives.filter(o => o.value > 0).length}
    Média Objetivos: ${result.objectivesScore.toFixed(2)} / 5 (Peso 60%)
    Média Competências: ${result.competenciesScore.toFixed(2)} / 5 (Peso 40%)
    Nota Final Ponderada: ${result.weightedTotal.toFixed(2)} / 5 (${result.percentage.toFixed(1)}%)

    Por favor, forneça um resumo profissional em Português de Portugal com:
    1. Uma breve apreciação qualitativa.
    2. Sugestões de melhoria focadas no gap entre competências e objetivos.
    3. Classificação qualitativa esperada (Inadequado, Adequado, Bom, Muito Bom ou Excelente).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Não foi possível gerar a recomendação da IA no momento.";
  }
};
