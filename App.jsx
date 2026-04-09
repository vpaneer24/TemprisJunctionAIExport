import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import JoinForce from "./components/JoinForce";
import JustPay from "./components/JustPay";
import Journal from "./components/Journal";
import Juris from "./components/Juris";
import JunctionAI from "./components/JunctionAI";
import AuditTrail from "./components/AuditTrail";
import JDoc from "./components/JDoc";
import SettingsPanel from "./components/SettingsPanel";
import ImportPanel from "./components/ImportPanel";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { buildMetrics } from "./hooks/useMetrics";
import { demoEmployees, demoFinance, demoSettings } from "./data/sampleData";
import { getComplianceItems, getComplianceStatus } from "./utils/complianceDates";

export default function App() {
  const [active, setActive] = useState("Dashboard");

  const employeesStore = useLocalStorage("junction_employees", demoEmployees);
  const financeStore = useLocalStorage("junction_finance", demoFinance);
  const payrollStore = useLocalStorage("junction_payroll_history", []);
  const auditStore = useLocalStorage("junction_audit", []);
  const settingsStore = useLocalStorage("junction_settings", demoSettings);
  const complianceOverrideStore = useLocalStorage("junction_compliance_overrides", {});

  const metrics = useMemo(() => buildMetrics(employeesStore.value, financeStore.value, settingsStore.value), [employeesStore.value, financeStore.value, settingsStore.value]);

  const alertCount = useMemo(() => {
    const doneMap = complianceOverrideStore.value || {};
    return getComplianceItems()
      .map((item) => getComplianceStatus(item.date, doneMap[item.id]))
      .filter((s) => s === "DUE SOON" || s === "OVERDUE").length;
  }, [complianceOverrideStore.value]);

  const aiContext = {
    companyName: settingsStore.value?.companyName || "Tempris Junction AI",
    headcount: metrics.activeEmployees.length,
    payroll: metrics.payroll,
    burnRate: metrics.burnRate,
    runway: metrics.runway,
    complianceAlerts: `${alertCount} active alerts`,
    netPosition: metrics.netPosition,
  };

  const resetDemo = () => {
    localStorage.removeItem("junction_payroll_history");
    localStorage.removeItem("junction_audit");
    employeesStore.save(demoEmployees);
    financeStore.save(demoFinance);
    settingsStore.save(demoSettings);
    complianceOverrideStore.save({});
    payrollStore.save([]);
    auditStore.save([]);
    setActive("Dashboard");
  };

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar active={active} onSelect={setActive} alertCount={alertCount} />

      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-soft">CSV-import version. Upload real employee, finance, payroll and settings files from the IMPORT tab.</div>
          <button className="btn-secondary" onClick={resetDemo}>Reset demo data</button>
        </div>

        <div className="space-y-6">
          {active === "Dashboard" && <Dashboard metrics={metrics} settings={settingsStore.value} alertCount={alertCount} auditCount={(auditStore.value || []).length} />}
          {active === "JOINFORCE" && <JoinForce employeesStore={employeesStore} auditStore={auditStore} />}
          {active === "JUSTPAY" && <JustPay employeesStore={employeesStore} payrollStore={payrollStore} auditStore={auditStore} settings={settingsStore.value} />}
          {active === "JOURNAL" && <Journal financeStore={financeStore} auditStore={auditStore} metrics={metrics} />}
          {active === "JURIS" && <Juris overridesStore={complianceOverrideStore} />}
          {active === "JUNCTION AI" && <JunctionAI context={aiContext} />}
          {active === "IMPORT" && <ImportPanel employeesStore={employeesStore} financeStore={financeStore} payrollStore={payrollStore} settingsStore={settingsStore} auditStore={auditStore} />}
          {active === "JDOC" && <JDoc employeesStore={employeesStore} payrollStore={payrollStore} financeStore={financeStore} auditStore={auditStore} settingsStore={settingsStore} />}
          {active === "AUDIT" && <AuditTrail auditStore={auditStore} />}
          <SettingsPanel settingsStore={settingsStore} />
        </div>
      </main>
    </div>
  );
}
