
import { Employee, EvaluationResult } from '../types';
import { OBJ_WEIGHT, COMP_WEIGHT } from '../constants';
import { GoogleGenAI } from "@google/genai";

export const calculateEvaluation = (employee: Employee): EvaluationResult => {
  const validObjs = employee.objectives.filter(o => o.value > 0);
  const validComps = employee.competencies.filter(c => c.value > 0);

  const avgObj = validObjs.length > 0 
    ? validObjs.reduce((acc, curr) => acc + curr.value, 0) / validObjs.length 
    : 0;
    
  const avgComp = validComps.length > 0 
    ? validComps.reduce((acc, curr) => acc + curr.value, 0) / validComps.length 
    : 0;

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
