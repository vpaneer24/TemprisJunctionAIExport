import { calculateCPF } from "../utils/cpfCalculator";
import { round2 } from "../utils/helpers";

export function buildMetrics(employees = [], finance = [], settings = {}) {
  const activeEmployees = employees.filter((e) => ["Active", "Probation", "On Leave"].includes(e.status));
  const payrollBreakdown = activeEmployees.map((e) => ({ ...e, ...calculateCPF(e.salary, e.ageBracket) }));

  const payroll = round2(payrollBreakdown.reduce((sum, e) => sum + Number(e.salary || 0), 0));
  const payrollTotalCost = round2(payrollBreakdown.reduce((sum, e) => sum + Number(e.totalCost || 0), 0));

  const expenses = finance.filter((f) => f.type === "Expense");
  const income = finance.filter((f) => f.type === "Income");
  const totalExpenses = round2(expenses.reduce((sum, f) => sum + Number(f.amount || 0), 0));
  const totalIncome = round2(income.reduce((sum, f) => sum + Number(f.amount || 0), 0));
  const netPosition = round2(totalIncome - totalExpenses);

  const monthlyExpenses = {};
  expenses.forEach((e) => {
    monthlyExpenses[e.month] = (monthlyExpenses[e.month] || 0) + Number(e.amount || 0);
  });

  const last3 = Object.entries(monthlyExpenses).sort(([a], [b]) => a.localeCompare(b)).slice(-3).map(([, amt]) => amt);
  const burnRate = round2(last3.length ? last3.reduce((a, b) => a + b, 0) / last3.length : 0);
  const runway = burnRate > 0 ? round2((settings.cashBalance || 0) / burnRate) : 0;

  return { activeEmployees, payrollBreakdown, payroll, payrollTotalCost, totalExpenses, totalIncome, netPosition, burnRate, runway };
}
