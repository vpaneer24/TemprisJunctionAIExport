export default function SettingsPanel({ settingsStore }) {
  const settings = settingsStore.value || {};
  const update = (key, value) => settingsStore.save({ ...settings, [key]: value });

  return (
    <div className="card p-5">
      <div className="label">Settings</div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input className="input" value={settings.companyName || ""} onChange={(e) => update("companyName", e.target.value)} placeholder="Company name" />
        <input className="input" type="number" value={settings.cashBalance || 0} onChange={(e) => update("cashBalance", Number(e.target.value || 0))} placeholder="Cash balance" />
        <input className="input" value={settings.financialYearEnd || ""} onChange={(e) => update("financialYearEnd", e.target.value)} placeholder="Financial year end MM-DD" />
        <input className="input" type="month" value={settings.defaultPayrollMonth || ""} onChange={(e) => update("defaultPayrollMonth", e.target.value)} />
      </div>
    </div>
  );
}
