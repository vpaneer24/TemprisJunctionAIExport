import { CPF_CEILING, CPF_RATES } from "../constants/sgRules";
import { round2 } from "./helpers";

export function calculateCPF(grossSalary, ageBracket) {
  const salary = Number(grossSalary || 0);
  const rates = CPF_RATES[ageBracket] || CPF_RATES.below55;
  const applicableSalary = Math.min(salary, CPF_CEILING);

  const employeeCPF = round2(applicableSalary * rates.employee);
  const employerCPF = round2(applicableSalary * rates.employer);

  let sdl = salary * 0.0025;
  if (salary < 800) sdl = 2;
  if (sdl > 11.25) sdl = 11.25;
  sdl = round2(sdl);

  return {
    employeeCPF,
    employerCPF,
    netPay: round2(salary - employeeCPF),
    sdl,
    totalCost: round2(salary + employerCPF + sdl),
  };
}
