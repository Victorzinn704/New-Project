import { GoogleGenAI, Type } from "@google/genai";
import { Employee } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeEmployeePerformance(employee: Employee) {
  const prompt = `
    Analise o desempenho deste funcionário e forneça uma análise SWOT (Forças, Fraquezas, Oportunidades e Ameaças) e uma lista de Prós e Contras.
    
    Dados do Funcionário:
    - Nome: ${employee.name}
    - Cargo: ${employee.position} (${employee.role})
    - Área: ${employee.area}
    - Rendimento (1-10): ${employee.performance}
    - Reclamações: ${employee.complaints}
    - Atestados Médicos: ${employee.medicalCertificatesCount}
    - Status Atual: ${employee.status}
    
    Por favor, retorne a resposta em formato Markdown estruturado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao gerar análise. Verifique sua chave de API.";
  }
}

export async function getStrategicDecision(employees: Employee[], expenses: any[]) {
  const prompt = `
    Como um consultor de RH e Financeiro, analise os dados da empresa e apresente uma decisão estratégica importante.
    
    Resumo de Funcionários: ${employees.length}
    Resumo de Gastos: ${expenses.length}
    
    Funcionários em destaque:
    ${employees.map(e => `- ${e.name} (${e.role}): Rendimento ${e.performance}, Atestados: ${e.medicalCertificatesCount}`).join('\n')}
    
    Forneça uma análise crítica e uma recomendação estratégica em Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao gerar decisão estratégica.";
  }
}
