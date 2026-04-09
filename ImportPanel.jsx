import { readCsvFile, transformEmployees, transformFinance, transformPayroll, transformSettings } from "../utils/csvUtils";
import { appendAudit } from "../utils/auditLogger";

function ImportCard({ title, description, onFile }) {
  return (
    <div className="card p-5">
      <div className="label">{title}</div>
      <p className="mt-3 text-sm text-soft">{description}</p>
      <input
        className="mt-4 block w-full text-sm"
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export default function ImportPanel({ employeesStore, financeStore, payrollStore, settingsStore, auditStore }) {
  const importEmployees = async (file) => {
    const rows = await readCsvFile(file);
    const data = transformEmployees(rows);
    employeesStore.save(data);
    appendAudit(auditStore.get, auditStore.save, "CSV_IMPORT", "IMPORT", `Employees imported: ${data.length}`);
  };

  const importFinance = async (file) => {
    const rows = await readCsvFile(file);
    const data = transformFinance(rows);
    financeStore.save(data);
    appendAudit(auditStore.get, auditStore.save, "CSV_IMPORT", "IMPORT", `Finance imported: ${data.length}`);
  };

  const importPayroll = async (file) => {
    const rows = await readCsvFile(file);
    const data = transformPayroll(rows);
    payrollStore.save(data);
    appendAudit(auditStore.get, auditStore.save, "CSV_IMPORT", "IMPORT", `Payroll imported: ${data.length}`);
  };

  const importSettings = async (file) => {
    const rows = await readCsvFile(file);
    const data = transformSettings(rows);
    settingsStore.save(data);
    appendAudit(auditStore.get, auditStore.save, "CSV_IMPORT", "IMPORT", "Settings imported");
  };

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="label">CSV Import Center</div>
        <p className="mt-3 text-sm text-soft">
          Upload CSV files to replace the current local data. Use the templates in the /templates folder first.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ImportCard title="Employees CSV" description="Required columns: id,name,title,department,employmentType,startDate,salary,ageBracket,status,notes" onFile={importEmployees} />
        <ImportCard title="Finance CSV" description="Required columns: id,month,category,amount,type,notes" onFile={importFinance} />
        <ImportCard title="Payroll CSV" description="Required columns: id,month,headcount,gross,employeeCPF,employerCPF,netPay,totalCost,status,createdAt" onFile={importPayroll} />
        <ImportCard title="Settings CSV" description="Required columns: companyName,cashBalance,gstRegistered,financialYearEnd,defaultPayrollMonth" onFile={importSettings} />
      </div>
    </div>
  );
}
