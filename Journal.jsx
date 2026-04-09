import { useMemo, useState } from "react";
import { appendAudit } from "../utils/auditLogger";
import { money, uniqueId } from "../utils/helpers";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const empty = { month: new Date().toISOString().slice(0, 7), category: "Other", amount: "", type: "Expense", notes: "" };

export default function Journal({ financeStore, auditStore, metrics }) {
  const [form, setForm] = useState(empty);
  const rows = financeStore.value || [];

  const save = () => {
    const next = { ...form, id: uniqueId(), amount: Number(form.amount || 0) };
    financeStore.save([next, ...rows]);
    appendAudit(auditStore.get, auditStore.save, "FINANCE_ENTRY", "JOURNAL", `${next.type} ${next.category}`);
    setForm(empty);
  };

  const chartData = useMemo(() => {
    const map = {};
    rows.forEach((row) => {
      map[row.month] ||= { month: row.month, Income: 0, Expense: 0 };
      map[row.month][row.type] += Number(row.amount || 0);
    });
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  }, [rows]);

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <div className="card p-5">
        <div className="label">Add Finance Entry</div>
        <div className="mt-4 grid gap-3">
          <input className="input" type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} />
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {["Payroll", "Office", "Software", "Marketing", "Legal", "Revenue Received", "Other"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <input className="input" type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{["Expense", "Income"].map((item) => <option key={item}>{item}</option>)}</select>
          <textarea className="input min-h-24" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button className="btn-primary" onClick={save}>Save entry</button>
        </div>

        <div className="mt-6 space-y-2 text-sm">
          <div>Total expenses: <strong>{money(metrics.totalExpenses)}</strong></div>
          <div>Total income: <strong>{money(metrics.totalIncome)}</strong></div>
          <div>Net position: <strong>{money(metrics.netPosition)}</strong></div>
          <div>Burn rate: <strong>{money(metrics.burnRate)}</strong></div>
          <div>Runway: <strong>{metrics.runway} months</strong></div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card h-80 p-5">
          <div className="label">6-Month Trend</div>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="month" stroke="#9FB3C8" />
                <YAxis stroke="#9FB3C8" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Income" stroke="#00C8F0" strokeWidth={2} />
                <Line type="monotone" dataKey="Expense" stroke="#7C3AED" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="label">Ledger</div>
          <div className="table-wrap mt-4">
            <table>
              <thead><tr><th>Month</th><th>Category</th><th>Type</th><th>Amount</th><th>Notes</th></tr></thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.month}</td><td>{row.category}</td><td>{row.type}</td><td>{money(row.amount)}</td><td>{row.notes}</td>
                  </tr>
                ))}
                {!rows.length ? <tr><td colSpan="5" className="text-soft">No finance entries yet.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
