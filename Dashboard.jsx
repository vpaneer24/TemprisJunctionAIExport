import MetricCard from "./MetricCard";
import { money } from "../utils/helpers";

export default function Dashboard({ metrics, settings, alertCount, auditCount }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="label">Overview</div>
        <h1 className="mt-2 text-3xl font-bold">{settings.companyName || "Tempris Junction AI"}</h1>
        <p className="mt-2 text-soft">Single-screen command center for founder, finance and operations review.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Headcount" value={String(metrics.activeEmployees.length)} />
        <MetricCard label="Payroll" value={money(metrics.payroll)} />
        <MetricCard label="Burn Rate" value={money(metrics.burnRate)} />
        <MetricCard label="Runway" value={`${metrics.runway} months`} />
        <MetricCard label="Compliance Alerts" value={String(alertCount)} subtext={`${auditCount} audit events committed`} />
      </div>

      <div className="card p-5">
        <div className="label">Priority Summary</div>
        <ul className="mt-4 space-y-3 text-sm text-white">
          <li>• Monthly payroll total is <strong>{money(metrics.payroll)}</strong> across <strong>{metrics.activeEmployees.length}</strong> active or payroll-relevant employees.</li>
          <li>• Burn rate is <strong>{money(metrics.burnRate)}</strong> with estimated runway of <strong>{metrics.runway} months</strong>.</li>
          <li>• Net finance position currently stands at <strong>{money(metrics.netPosition)}</strong>.</li>
          <li>• Import CSV data from the IMPORT tab to replace demo data with real client data.</li>
        </ul>
      </div>
    </div>
  );
}
