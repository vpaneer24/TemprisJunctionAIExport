import { useState } from "react";
import { DEPARTMENTS, EMPLOYMENT_TYPES, STATUSES } from "../constants/sgRules";
import { appendAudit } from "../utils/auditLogger";
import { money, uniqueId } from "../utils/helpers";

const emptyForm = {
  id: "", name: "", title: "", department: "Engineering", employmentType: "Full-time",
  startDate: "", salary: "", ageBracket: "below55", status: "Active", notes: "",
};

export default function JoinForce({ employeesStore, auditStore }) {
  const [form, setForm] = useState(emptyForm);
  const employees = employeesStore.value || [];

  const save = () => {
    const next = { ...form, id: form.id || uniqueId(), salary: Number(form.salary || 0) };
    const existing = employees.filter((e) => e.id !== next.id);
    employeesStore.save([next, ...existing]);
    appendAudit(auditStore.get, auditStore.save, "EMPLOYEE_SAVE", "JOINFORCE", next.name);
    setForm(emptyForm);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <div className="card p-5">
        <div className="label">Add / Edit Employee</div>
        <div className="mt-4 grid gap-3">
          <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>{DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</select>
          <select className="input" value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}>{EMPLOYMENT_TYPES.map((item) => <option key={item}>{item}</option>)}</select>
          <input className="input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <input className="input" type="number" placeholder="Monthly salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          <select className="input" value={form.ageBracket} onChange={(e) => setForm({ ...form, ageBracket: e.target.value })}>
            <option value="below55">Below 55</option>
            <option value="55to60">55 to 60</option>
            <option value="60to65">60 to 65</option>
            <option value="above65">Above 65</option>
          </select>
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
          <textarea className="input min-h-24" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button className="btn-primary" onClick={save}>Save employee</button>
        </div>
      </div>

      <div className="card p-5">
        <div className="label">Employee Roster</div>
        <div className="table-wrap mt-4">
          <table>
            <thead><tr><th>Name</th><th>Title</th><th>Department</th><th>Salary</th><th>Status</th></tr></thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="cursor-pointer hover:bg-white/5" onClick={() => setForm({ ...e })}>
                  <td>{e.name}</td><td>{e.title}</td><td>{e.department}</td><td>{money(e.salary)}</td><td>{e.status}</td>
                </tr>
              ))}
              {!employees.length ? <tr><td colSpan="5" className="text-soft">No employees yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
