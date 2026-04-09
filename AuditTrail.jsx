export default function AuditTrail({ auditStore }) {
  const rows = auditStore.value || [];
  return (
    <div className="card p-5">
      <div className="label">Audit Trail</div>
      <div className="table-wrap mt-4">
        <table>
          <thead><tr><th>Timestamp</th><th>Action</th><th>Module</th><th>Detail</th><th>Session</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{new Date(row.timestamp).toLocaleString("en-SG")}</td><td>{row.action}</td><td>{row.module}</td><td>{row.detail}</td><td>{row.sessionId}</td>
              </tr>
            ))}
            {!rows.length ? <tr><td colSpan="5" className="text-soft">No audit entries yet.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
