import { getFunctions, httpsCallable } from "firebase/functions";
import { Employee } from "../types";
import { instrumentOperation } from "../utils/performance";
import { trackAiAnalysis } from "../utils/analytics";
import { logger } from "../utils/logger";

const functions = getFunctions();

async function callAI(
  type: "analyze" | "strategic",
  payload: unknown
): Promise<string> {
  const aiProxy = httpsCallable<{ type: string; payload: unknown }, { result: string }>(
    functions,
    "aiProxy"
  );

  const response = await aiProxy({ type, payload });
  return response.data.result;
}

export async function analyzeEmployeePerformance(employee: Employee) {
  return instrumentOperation(
    'ai_analyze_employee',
    async () => {
      try {
        const result = await callAI("analyze", {
          name: employee.name,
          role: employee.role,
          position: employee.position,
          area: employee.area,
          performance: employee.performance,
          complaints: employee.complaints,
          medicalCertificatesCount: employee.medicalCertificatesCount,
          status: employee.status,
        });
        trackAiAnalysis('employee', true);
        return result;
      } catch (error) {
        logger.error('AI employee analysis failed', error as Error, {
          employeeId: employee.id,
          employeeName: employee.name,
        });
        trackAiAnalysis('employee', false);
        throw error;
      }
    },
    { type: 'employee', employeeId: employee.id }
  );
}

export async function getStrategicDecision(
  employees: Employee[],
  expenses: unknown[]
) {
  return instrumentOperation(
    'ai_strategic_decision',
    async () => {
      try {
        const result = await callAI("strategic", {
          employeeCount: employees.length,
          expenseCount: expenses.length,
          employees: employees.map((e) => ({
            name: e.name,
            role: e.role,
            performance: e.performance,
            medicalCertificatesCount: e.medicalCertificatesCount,
          })),
        });
        trackAiAnalysis('strategic', true);
        return result;
      } catch (error) {
        logger.error('AI strategic analysis failed', error as Error, {
          employeeCount: employees.length,
          expenseCount: expenses.length,
        });
        trackAiAnalysis('strategic', false);
        throw error;
      }
    },
    { type: 'strategic', employeeCount: String(employees.length) }
  );
}
