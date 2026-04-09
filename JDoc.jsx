import { downloadCsv, downloadJson } from "../utils/exportUtils";

export default function JDoc({ employeesStore, payrollStore, financeStore, auditStore, settingsStore }) {
  const exportAll = () => {
    downloadJson(`junction-export-${new Date().toISOString().slice(0,10)}.json`, {
      employees: employeesStore.value || [],
      payrollHistory: payrollStore.value || [],
      financeEntries: financeStore.value || [],
      auditLog: auditStore.value || [],
      settings: settingsStore.value || {},
      exportedAt: new Date().toISOString(),
    });
  };

  const exportPayrollCsv = () => {
    const rows = (payrollStore.value || []).map((run) => ({
      month: run.month,
      headcount: run.headcount,
      gross: run.totals.gross,
      employeeCPF: run.totals.employeeCPF,
      employerCPF: run.totals.employerCPF,
      netPay: run.totals.netPay,
      totalCost: run.totals.totalCost,
      status: run.status,
      createdAt: run.createdAt,
    }));
    downloadCsv(`junction-payroll-${new Date().toISOString().slice(0,7)}.csv`, rows);
  };

  return (
    <div className="card p-5">
      <div className="label">JDoc Export</div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={exportAll}>Export all JSON</button>
        <button className="btn-secondary" onClick={exportPayrollCsv}>Export payroll CSV</button>
      </div>
    </div>
  );
}
