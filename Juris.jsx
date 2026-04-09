import { getComplianceItems, getComplianceStatus } from "../utils/complianceDates";

export default function Juris({ overridesStore }) {
  const doneMap = overridesStore.value || {};
  const items = getComplianceItems().map((item) => ({ ...item, status: getComplianceStatus(item.date, doneMap[item.id]) }));

  const markDone = (id) => overridesStore.save({ ...doneMap, [id]: true });

  const tone = (status) => ({
    "OVERDUE": "text-red-300 bg-red-500/20",
    "DUE SOON": "text-amber-300 bg-amber-500/20",
    "UPCOMING": "text-yellow-300 bg-yellow-500/20",
    "FUTURE": "text-soft bg-white/5",
    "DONE": "text-emerald-300 bg-emerald-500/20",
  }[status] || "text-soft bg-white/5");

  return (
    <div className="card p-5">
      <div className="label">Compliance Calendar</div>
      <div className="table-wrap mt-4">
        <table>
          <thead><tr><th>Date</th><th>Obligation</th><th>Authority</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td><td>{item.obligation}</td><td>{item.authority}</td>
                <td><span className={`rounded-full px-2 py-1 text-xs ${tone(item.status)}`}>{item.status}</span></td>
                <td>{item.status !== "DONE" ? <button className="btn-secondary" onClick={() => markDone(item.id)}>Mark done</button> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
