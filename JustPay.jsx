import { useMemo, useState } from "react";
import { calculateCPF } from "../utils/cpfCalculator";
import { appendAudit } from "../utils/auditLogger";
import { money, monthLabel, uniqueId } from "../utils/helpers";

export default function JustPay({ employeesStore, payrollStore, auditStore, settings }) {
  const [month, setMonth] = useState(settings.defaultPayrollMonth || new Date().toISOString().slice(0, 7));
  const [bonus, setBonus] = useState(0);
  const [deduction, setDeduction] = useState(0);

  const active = (employeesStore.value || []).filter((e) => !["Resigned", "Notice"].includes(e.status));
  const previewRows = useMemo(() => active.map((e) => {
    const gross = Number(e.salary || 0) + Number(bonus || 0) - Number(deduction || 0);
    return { ...e, gross, ...calculateCPF(gross, e.ageBracket) };
  }), [active, bonus, deduction]);

  const totals = previewRows.reduce((acc, row) => {
    acc.gross += row.gross; acc.employeeCPF += row.employeeCPF; acc.employerCPF += row.employerCPF; acc.netPay += row.netPay; acc.totalCost += row.totalCost;
    return acc;
  }, { gross: 0, employeeCPF: 0, employerCPF: 0, netPay: 0, totalCost: 0 });

  const runPayroll = () => {
    if (!previewRows.length) return;
    const record = { id: uniqueId(), month, headcount: previewRows.length, bonus: Number(bonus || 0), deduction: Number(deduction || 0), rows: previewRows, totals, createdAt: new Date().toISOString(), status: "Confirmed" };
    payrollStore.save([record, ...(payrollStore.value || [])]);
    appendAudit(auditStore.get, auditStore.save, "PAYROLL_RUN", "JUSTPAY", `${month}: ${previewRows.length} employees`);
  };

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="label">Payroll Run</div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input className="input" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          <input className="input" type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value || 0))} placeholder="Bonus" />
          <input className="input" type="number" value={deduction} onChange={(e) => setDeduction(Number(e.target.value || 0))} placeholder="Deduction" />
        </div>
        <div className="mt-4"><button className="btn-primary" onClick={runPayroll}>Run payroll</button></div>
      </div>

      <div className="card p-5">
        <div className="label">Preview — {monthLabel(month)}</div>
        <div className="table-wrap mt-4">
          <table>
            <thead><tr><th>Name</th><th>Gross</th><th>Emp CPF</th><th>Er CPF</th><th>Net Pay</th><th>SDL</th><th>Total Cost</th></tr></thead>
            <tbody>
              {previewRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td><td>{money(row.gross)}</td><td>{money(row.employeeCPF)}</td><td>{money(row.employerCPF)}</td><td>{money(row.netPay)}</td><td>{money(row.sdl)}</td><td>{money(row.totalCost)}</td>
                </tr>
              ))}
              {!previewRows.length ? <tr><td colSpan="7" className="text-soft">No payroll-ready employees found.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-5">
        <div className="label">Payroll History</div>
        <div className="table-wrap mt-4">
          <table>
            <thead><tr><th>Month</th><th>Headcount</th><th>Gross</th><th>Employer CPF</th><th>Total Cost</th><th>Status</th></tr></thead>
            <tbody>
              {(payrollStore.value || []).map((run) => (
                <tr key={run.id}>
                  <td>{monthLabel(run.month)}</td><td>{run.headcount}</td><td>{money(run.totals.gross)}</td><td>{money(run.totals.employerCPF)}</td><td>{money(run.totals.totalCost)}</td><td>{run.status}</td>
                </tr>
              ))}
              {!(payrollStore.value || []).length ? <tr><td colSpan="6" className="text-soft">No payroll history yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
